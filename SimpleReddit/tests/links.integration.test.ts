import {expect} from "chai";
import request from "supertest";
import jwt from "jsonwebtoken";
import {getApp} from "../src/backend/config/app";

describe("Integration test of POST request to links_controller.rs", () => {

    it("Should be able to create a link using the backend resources", (done) => {

        // get app and then
        getApp().then((app) => {

            // get authentication salf from environment or use default one
            const secret = process.env.AUTH_SECRET || 'magic';
            
            // retrieve token
            const FAKE_TOKEN = jwt.sign({
                id: 1
            }, secret as string);

            // create link data
            const link = {
                title: "Test",
                url: "http://www.test.com/" + new Date().getTime()
            };

            // start app
            request(app)
                .post("/api/v1/links") // HTTP POST
                .send(link) // link data in the body
                .set("Content-Type", "application/json") // headers
                .set("Accept", "application/json")
                .set("x-auth-token", FAKE_TOKEN)
                .expect(201) // expect Created (201)
                .end(function (err, res) {
                    if (err) 
                        throw err;
                    expect(res.body.title).eql(link.title); // assert its the same data provided
                    expect(res.body.url).eql(link.url);
                    done();
                });
        });
    });
});