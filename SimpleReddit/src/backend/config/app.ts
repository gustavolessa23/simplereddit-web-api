import express from "express";
import bodyParser from "body-parser";

import { createDbConnection } from "../config/db";
import { getUserController } from "../controllers/users_controller";
import { getAuthController } from "../controllers/auth_controller";
import { getLinkController } from "../controllers/links_controller";
import { getCommentController } from "../controllers/comments_controller";

export async function getApp(){

    // Create db connection
    await createDbConnection();

    // Creates app
    const app = express();

    // Server config to be able to send JSON
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Declare main path
    app.get("/", (req, res) => {
        res.send("This is the home page!");
    });

    // Declare controllers
    const commentsController = getCommentController();
    const linksController = getLinkController();
    const usersController = getUserController();
    const authController = getAuthController();

    app.use("/api/v1/links", linksController);
    app.use("/api/v1/comments", commentsController);
    app.use("/api/v1/auth", authController);
    app.use("/api/v1/users", usersController);

    return app;
}

