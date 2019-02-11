import { createConnection } from "typeorm";
import { Comment } from "../entities/comment";
import { Vote } from "../entities/vote";
import { User } from "../entities/user";
import { Link } from "../entities/link";

export async function createDbConnection() {

    // Read the database settings from the environment vairables. If non existing, use standard ones
    const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
    const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'secret';
    const DATABASE_USER = process.env.DATABASE_USER || 'postgres';
    const DATABASE_DB = process.env.DATABASE_DB || 'simplereddit';
    const DATABASE_PORT = parseInt(process.env.DATABASE_PORT as string) || 5432;

    // // Display the settings in the console so we can see if something is wrong
    // console.log(
    //     `
    //         host: ${DATABASE_HOST}
    //         password: ${DATABASE_PASSWORD}
    //         user: ${DATABASE_USER}
    //         db: ${DATABASE_DB}
    //         port: ${DATABASE_PORT}     
    //     `
    // );

    // Open database connection
    await createConnection({
        type: 'postgres',
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_DB,
        // If you forget to add your entities here you will get a "repository not found" error
        entities: [
            User,
            Link,
            Comment,
            Vote
        ],
        // This setting will automatically create database tables in the database server
        synchronize: true
    });

}
