import * as express from "express";
import * as joi from "joi";
import {authMiddleware, loggerMiddleware} from "../config/middleware";
import {getLinkRepository} from "../repositories/link_repository";
import {getVoteRepository} from "../repositories/vote_repository";
import {Link} from "../entities/link";
import {getUserRepository} from "../repositories/user_repository";
import {Vote} from "../entities/vote";
import {Repository} from "typeorm";
import {User} from "../entities/user";

/**
 * Function to return links controller's router, with set endpoints
 */
export function getLinkController() {

    // Create respositories so we can perform database operations
    const linkRepository = getLinkRepository();
    const voteRepository = getVoteRepository();
    const userRepository = getUserRepository();

    // Create router instance so we can declare enpoints
    const router = express.Router();

    // Declare Joi Schema so we can validate links
    const linkSchemaForPost = {
        url: joi
            .string()
            .uri()
            .trim()
            .required(),
        title: joi
            .string()
            .required()
    };

    const handlers = getLinksHandlers(linkRepository, userRepository, voteRepository, linkSchemaForPost, joi);

    // List all links with comments - HTTP GET ->
    // http://localhost:8080/api/vi/links/
    router.get("/", handlers.getAllLinks);

    // Get one link by ID - HTTP GET -> http://localhost:8080/api/v1/links/:id
    router.get("/:id", handlers.getLinkById);

    // Delete a link by ID- HTTP DELETE -> http://localhost:8080/api/v1/links/1
    router.delete("/:id", authMiddleware, handlers.deleteLinkById);

    // Create a new link - HTTP POST -> http://localhost:8080/api/v1/links/
    router.post("/", authMiddleware, handlers.createLink);

    // Upvote a link - HTTP POST -> http://localhost:8080/api/v1/links/1/upvote
    router.post("/:id/upvote", authMiddleware, handlers.upvoteLink);

    // Downvote a link - HTTP POST -> http://localhost:8080/api/v1/links/1/downvote
    router.post("/:id/downvote", authMiddleware, handlers.downvoteLink);

    return router;
}

/**
 * Retrieve links handlers, injecting dependencies
 * @param linkRepository 
 * @param userRepository 
 * @param voteRepository 
 * @param linkSchemaForPost 
 * @param joi 
 */
export function getLinksHandlers(linkRepository : Repository < Link >, userRepository : Repository < User >, voteRepository : Repository < Vote >, linkSchemaForPost : any, joi : any) {

    // Get all links
    const getAllLinks = (req : express.Request, res : express.Response) => {
        (async() => {
            try {
                // retrieve all links including their comments
                const links = await linkRepository.find({relations: ['comments','votes']});
                // return status 200 and links
                res
                    .status(200)
                    .json({'Amount of links': links.length, 'Links': links});
            } catch (error) { // catch any exception
                console.log(error);
                res
                    .status(500)
                    .json({Error: "Exception caught!"});
            }
        })();
    };

    // Create new link
    const createLink = (req : express.Request, res : express.Response) => {
        (async() => {
            try {
                //Validate against the schema
                const result = joi.validate(req.body, linkSchemaForPost);

                //If not valid, return status 400 with message
                if (result.error) 
                    return res.status(400).json({Error: "Link is not valid. Please check the parameters sent."});
                
                const newUrl = req.body.url; // get url from body
                const newTitle = req.body.title; // get title from body

                // Return user information of logged user
                const creator : any = await userRepository.findOne((req as any).userId);

                // If user cannot be found, return 404
                if (!creator) 
                    return res.status(404).json({Error: "User could not be found!"});
                
                // The following lines will run only if all fields are valid and set Create new
                // link
                const newLink = new Link(newTitle, newUrl, creator);

                // Save new link to database
                const savedLink = await linkRepository.save(newLink);

                // // Return result  res.status(201).json({    
                    // 'Result': `Link [ID = ${savedLink.id}] created successfully!`,
                    // 'Link details': savedLink });

                // Return result
                res
                    .status(201)
                    .json(savedLink);
            } catch (error) { // catch any exception
                console.log(error);
                res
                    .status(500)
                    .json({Error: "Exception caught!"});
            }

        })();
    };

    // Delete a link using its ID
    const deleteLinkById = (req : express.Request, res : express.Response) => {
        (async() => {
            try {
                const userId = (req as any).userId; // get logged used ID
                const id = req.params.id; // get link ID from URL

                // retrieve link from DB along with its user information
                const linkToDelete : any = await linkRepository.findOne(id, {relations: ['user']});

                // If link cannot be found, return 404
                if (!linkToDelete) 
                    return res.status(404).json({Error: "Link not found!"})

                    // If link creator is not the same as logged user, return 403
                if (linkToDelete.user.id != userId) {
                    res
                        .status(403)
                        .json({Error: "Link can only be deleted by its author!"})
                };

                const removedLink = await linkRepository.delete(id); // perform database operation

                res
                    .status(200)
                    .json({ // return result
                        Result: `Link ID:${id} removed successfully!`,
                        linkToDelete
                    });
            } catch (error) { // catch any exception
                console.log(error);
                res
                    .status(500)
                    .json({Error: "Exception caught!"});
            }
        })();
    };

    // Get a link by ID
    const getLinkById = (req : express.Request, res : express.Response) => {
        (async() => {
            try {
                const linkId = req.params.id; // get link id from params

                const retrievedLink : any = await linkRepository.findOne({ // retrieve link by ID
                    relations: [
                        "comments", "votes"
                    ],
                    where: {
                        id: linkId
                    }
                });

                // If not found, return 404
                if (!retrievedLink) 
                    return res.status(404).json({Error: "Link not found!"});
                
                // Return link found
                res.status(200).json(retrievedLink);
  
            } catch (error) { // catch any exception
                res
                    .status(500)
                    .json({Error: "Exception caught!"});
            }
        })();
    };

    // Upvote a link
    const upvoteLink = (req : express.Request, res : express.Response) => {
        (async() => {
            try {
                const voter = await userRepository.findOne((req as any).userId); // get logged user's info from DB
                if (!voter) 
                    return res.status(404).json({Error: "User not found!"}); // return error if not found
                
                const relatedLink : any = await linkRepository.findOne(req.params.id, { // return link from DB
                    relations: ['user']
                });
                if (!relatedLink) 
                    return res.status(404).json({Error: "Link not found!"}); // return error if not found
                
                // return error if link creator is the same as voter
                if (relatedLink.user.id == voter.id) 
                    return res.status(403).json({Error: "Cannot vote your own link! "});
                
                const newVote = new Vote(voter, relatedLink, true); // create new vote
                const savedVote = await voteRepository.save(newVote); // save new vote to DB
                // return result
                res
                    .status(200)
                    .json({'Result': `Upvote saved successfully!`, savedVote});

            } catch (error) { // catch any exception
                console.log(error);
                res
                    .status(500)
                    .json({Error: "Exception caught!"});
            }
        })();
    };

    // Downvote a link
    const downvoteLink = (req : express.Request, res : express.Response) => {
        (async() => {
            try {
                const voter : any = await userRepository.findOne((req as any).userId); // get logged user's info from DB
                if (!voter) 
                    return res.status(404).json({Error: "User not found!"}); // return error if not found
                
                const relatedLink : any = await linkRepository.findOne(req.params.id, { // return link from DB
                    relations: ['user']
                });
                if (!relatedLink) 
                    return res.status(404).json({Error: "Link not found!"}); // return error if not found
                
                // return error if link creator is the same as voter
                if (relatedLink.user.id == voter.id) 
                    return res.status(403).json({Error: "Cannot vote your own link! "});
                
                const newVote = new Vote(voter, relatedLink, false); // create new vote
                const savedVote = await voteRepository.save(newVote); // save new vote to DB
                // return result
                res
                    .status(200)
                    .json({'Result': `Downvote saved successfully!`, savedVote});

            } catch (error) { // catch any exception
                console.log(error);
                res
                    .status(500)
                    .json({Error: "Exception caught!"});
            }
        })();
    };

    return {
        getAllLinks: getAllLinks,
        createLink: createLink,
        deleteLinkById: deleteLinkById,
        getLinkById: getLinkById,
        upvoteLink: upvoteLink,
        downvoteLink: downvoteLink
    }

}