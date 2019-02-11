import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";
import { Repository } from "typeorm";
import { User } from "../entities/user";

export function getUserController() {

    const userRepository = getUserRepository();
    const router = express.Router();

    const userDetailsSchema = {
        email: joi.string().email().required(),
        password: joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).required()
    };

    const handlers = getUsersHandlers(userDetailsSchema, userRepository, joi);

    // Add new user - HTTP POST -> http://localhost:8080/api/v1/users/
    router.post("/", handlers.newUser);

    // Get one user by ID - HTTP GET -> http://localhost:8080/api/v1/users/1
    router.get("/:id", handlers.getUserById);
    
    // Get all users - HTTP GET -> http://localhost:8080/api/v1/users/
    router.get("/", handlers.getAllUsers);

    return router;
}


export function getUsersHandlers(userDetailsSchema: any, userRepository: Repository<User>, joi: any){

    const newUser = (req: express.Request, res: express.Response) => {
        (async () => {
            try {
                const newUser = req.body; // get information from body
                const result = joi.validate(newUser, userDetailsSchema); // validate against schema
                if (result.error) return res.status(400).json({Error: "User details invalid. Please check your fields."}); // ir invalid, return 400 with message

                const user = await userRepository.save(newUser); // save to the DB

                // return added user and status 200
                res.status(201).json({
                    'Result': `User [ID ${user.id}] added successfully!`,
                    user
                });
            }catch(error){ // catch any exception
                console.log(error);
                res.status(500).json({
                    Error: "Exception caught!"
                });
            }
        })();
    };

    const getUserById = (req: express.Request, res: express.Response) => {
        (async () => {
            try {
                const id = req.params.id; // get user id by URL
                const user = await userRepository.findOne(id,{
                    relations: ['links', 'comments']
                }); // get user from DB
                
                if(!user) return res.status(404).json({Error: "User not found."}) // return error if not found

                res.status(200).json(user);
            }catch(error){ // catch any exception
                console.log(error);
                res.status(500).json({
                    Error: "Exception caught!"
                });
            }
        })();
    };

    const getAllUsers = (req: express.Request, res: express.Response) => {
        (async () => {
            try {
                const users = await userRepository.find(); // get all users
                if(!users) return res.status(404).json({Error: "Users not found"});


                res.status(200).json(users);
            }catch(error){ // catch any exception
                console.log(error);
                res.status(500).json({
                    Error: "Exception caught!"
                });
            }
        })();
    };

    return{
        newUser: newUser,
        getUserById: getUserById,
        getAllUsers: getAllUsers
    }

}