import * as express from "express";
import {getUserRepository} from "../repositories/user_repository";
import * as joi from "joi";
import jwt from "jsonwebtoken";
import {Repository} from "typeorm";
import {User} from "../entities/user";

/**
 * Ger authorization controller and endpoint
 */
export function getAuthController() {

    const AUTH_SECRET = process.env.AUTH_SECRET; // get salt from environment
    const userRepository = getUserRepository(); // load user repository for DB operations
    const router = express.Router(); // create router for endpoint creation

    // Define user details joi schema
    const userDetailsSchema = {
        email: joi
            .string()
            .email()
            .required(),
        password: joi
            .string()
            .regex(/^[a-zA-Z0-9]{6,16}$/)
            .required()
    };

    const handler = getAuthHandler(userRepository, userDetailsSchema, joi, AUTH_SECRET);

    // Login - HTTP POST -> http://localhost:8080/api/v1/auth/login/
    router.post("/login", handler.tryLogin);

    return router;
}

/**
 * Get authorization handler 
 * @param userRepository 
 * @param userDetailsSchema 
 * @param joi 
 * @param auth_salt 
 */
export function getAuthHandler(userRepository : Repository < User >, userDetailsSchema : any, joi : any, auth_salt : any) {

    // Login function
    const tryLogin = (req : express.Request, res : express.Response) => {

        (async() => {
            try {
                const userDetails = req.body; // get user details from body
                const result = joi.validate(userDetails, userDetailsSchema); // validate agains schema
                if (result.error) {
                    // if is not valid
                    res
                        .status(400)
                        .json({Error: "User details invalid. Please check fields."});
                } else {
                    const match = await userRepository.findOne(userDetails); // get user from DB
                    if (match === undefined) {
                        // if is undefined, it wasn't found
                        res
                            .status(404)
                            .json({Error: "User not found!"});
                    } else {
                        if (auth_salt === undefined) {
                            // if salt is not defined
                            res
                                .status(500)
                                .json({Error: "Authentication couldn't be completed. Please check your parameters."});
                        } else {
                            const token = jwt.sign({
                                id: match.id
                            }, auth_salt); // validate to generate token
                            // return status 200
                            res
                                .status(200)
                                .json({'Result': `User [ID = ${match.id}] logged successfully!`, token: token});
                        }
                    }
                }
            } catch (error) { // catch any exception
                console.log(error);
                res
                    .status(500)
                    .json({Error: "Exception caught!"});
            }
        })();

    };

    return {tryLogin: tryLogin}

}