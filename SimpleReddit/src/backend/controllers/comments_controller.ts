import * as express from "express";
import * as joi from "joi";
import {authMiddleware, loggerMiddleware} from "../config/middleware";
import {getCommentRepository} from "../repositories/comment_repository";
import {User} from "../entities/user";
import {Link} from "../entities/link";
import {getLinkRepository} from "../repositories/link_repository";
import {getUserRepository} from "../repositories/user_repository";
import {Comment} from "../entities/comment";
import {Repository} from "typeorm";

/**
 * Get comment controller's router, including set endpoints.
 */
export function getCommentController() {

    // Instantiate repositories to perform database operations
    const commentRepository = getCommentRepository();
    const linkRepository = getLinkRepository();
    const userRepository = getUserRepository();

    // Create router instance so we can declare enpoints
    const router = express.Router();

    // Declare Joi Schema so we can validate comments
    const commentSchema = {
        linkid: joi.number(),
        commentBody: joi.string()
    };

    const handlers = getHandlers(commentRepository, linkRepository, userRepository, commentSchema, joi);

    // Update a comment - HTTP PATCH -> http://localhost:8080/api/v1/comments/:id
    router.patch("/:id", authMiddleware, handlers.updateCommentHandler);

    // Delete a comment - HTTP DELETE -> http://localhost:8080/movies/1
    router.delete("/:id", authMiddleware, handlers.deleteCommentHandler);

    // Create a comment - HTTP POST -> http://localhost:8080/comments/
    router.post("/", authMiddleware, handlers.addCommentHandler);

    return router;
}

/**
 * Retrieve comments handlers, after injecting dependencies
 * @param commentRepository 
 * @param linkRepository 
 * @param userRepository 
 * @param commentSchema 
 * @param joi 
 */
export function getHandlers(commentRepository : Repository < Comment >, linkRepository : Repository < Link >, userRepository : Repository < User >, commentSchema : any, joi : any) {

    const addCommentHandler = (req : express.Request, res : express.Response) => {
        (async() => {
            try {
                // Validate request body against comment schema, returning 400 if not valid
                const result = joi.validate(req.body, commentSchema);
                if (result.error) 
                    return res.status(400).json({Error: "Comment is not valid, please check the fields!"});
                
                const userId = (req as any).userId; // get the logged used ID
                const retrievedUser = await userRepository.findOne(userId); // get user from DB

                // If user can't be found, return 404
                if (!retrievedUser) 
                    return res.status(404).json({Error: "User not found!"});
                
                const linkId = req.body.linkid; // get link id from body
                const retrievedLink = await linkRepository.findOne(linkId); // get link from DV

                // If link is not found, return 404
                if (!retrievedLink) 
                    return res.status(404).json({Error: "Link not found! Please confirm the Link Id."});
                
                const commentText = req.body.commentBody; // get comment body

                // Create new comment
                const newComment = new Comment(retrievedUser, retrievedLink, commentText);

                // Save to the database
                const comment = await commentRepository.save(newComment);
                // Return status 200
                res
                    .status(201)
                    .json({'Result': `Comment created successfully!`, 'Comment': comment});
            } catch (error) { // catch any exception
                console.log(error);
                res
                    .status(500)
                    .json({Error: "Exception caught!"});
            }
        })();
    };

    const deleteCommentHandler = (req : express.Request, res : express.Response) => {
        (async() => {
            try {
                const userId = (req as any).userId; // get the logged user ID
                const id = req.params.id; // get comment id from URL

                // retrieve comment from database
                const comment : any = await commentRepository.findOne(id, {relations: ['user']});

                // If comment cannot be found, return 404
                if (!comment) 
                    return res.status(404).json({Error: "Comment not found!"});
                
                // If logged user is not the comment creator, return 400
                if (userId != comment.user.id) 
                    return res.status(400).json({Error: "Only the author can delete a comment!"});
                
                // Perform db operation
                const deletedComment = await commentRepository.remove(comment);

                // Respond with status 200
                res
                    .status(200)
                    .json({'Result': `Comment [ID = ${id}] deleted successfully!`, 'Comment': deletedComment});
            } catch (error) { // catch any exception
                console.log(error);
                res
                    .status(500)
                    .json({Error: "Exception caught!"});
            }
        })();
    };

    const updateCommentHandler = (req : express.Request, res : express.Response) => {
        (async() => {
            try {
                const id = req.params.id; // get comment ID from URL
                const update = req.body; // get updated fields from body
                const userId = (req as any).userId; // get the logged used ID

                // retrieve the comment from database
                const oldComment : any = await commentRepository.findOne(id, {relations: ['user']});

                // If comment cannot be found, return 404
                if (!oldComment) 
                    return res.status(404).json({Error: "Comment not found!"});
                
                // If logged user ID is different from comment's user ID, return 400
                if (userId != oldComment.user.id) 
                    return res.status(400).json({Error: "Only the comment author can edit it!"});
                
                const keys = Object.keys(update);
                keys.forEach(key => {
                    (oldComment as any)[key] = (update as any)[key];
                });

                const updatedComment = await commentRepository.save(oldComment); // save to database
                res.json({'Result': `Comment [ID = ${id}] updated successfully!`, 'Comment': oldComment});
            } catch (error) { // catch any exception
                console.log(error);
                res
                    .status(500)
                    .json({Error: "Exception caught!"});
            }
        })();
    };

    return {addCommentHandler: addCommentHandler, deleteCommentHandler: deleteCommentHandler, updateCommentHandler: updateCommentHandler}

}
