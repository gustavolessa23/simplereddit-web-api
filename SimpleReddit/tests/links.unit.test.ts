import {expect} from "chai";
import {it, describe} from "mocha";
import {getLinksHandlers} from "../src/backend/controllers/links_controller";

describe("Unit test of Link Handlers, from links_controller.ts", () => {

    it("Should be able to create a link, when mocking all dependencies", (done) => {

        // create fake vote repository
        const fakeVoteRepository : any = {};

        // create fake joi
        const fakeJoi : any = {
            validate: (value : any, schema : any) => {
                return Promise.resolve(null);
            }
        }

        // create fake user
        const fakeUser : any = {
            "email": "teste@teste.com",
            "id": 1,
            "links": [],
            "comments": []
        }

        // create fake validation schema
        const fakeSchema : any = {};

        // create fake request
        const fakeReq : any = {
            userId: 1,
            body: {
                title: "Testing Link Creation",
                url: "https://www.createlink.com/"
            }
        };

        // create fake link
        const fakeLink = {
            "title": fakeReq.body.title,
            "url": fakeReq.body.url,
            "id": 1,
            "comments": [],
            "votes": []
        };

        // create fake user repository
        const fakeUserRepository : any = {
            findOne: (id : number) => {
                return Promise.resolve(fakeUser);
            }
        };

        // create fake link repository
        const fakeLinkRepository : any = {
            save: (link : any) => {
                return Promise.resolve(fakeLink);
            }
        };

        // crete fake response
        const fakeRes : any = {
            json: function (link: any) {
                expect(link.title).eql(fakeLink.title);
                expect(link.url).eql(fakeLink.url);
                done();
            },
            end: function () {},
            status: function (s : number) {
                this.statusCode = s;
                return this;
            }
        }

        // Call method using fake data
        const {createLink} = getLinksHandlers(fakeLinkRepository, fakeUserRepository, fakeVoteRepository, fakeSchema, fakeJoi);
        createLink(fakeReq, fakeRes);

    });

    // it("Should be able to retrieve a link by ID, when mocking all dependencies", (done) => {

    //     const fakeVoteRepository : any = {};

    //     const fakeJoi : any = {
    //         validate: (value : any, schema : any) => {
    //             return Promise.resolve(null);
    //         }
    //     }

    //     const fakeUser : any = {
    //         "email": "teste@teste.com",
    //         "password": "secret1",
    //         "id": 1,
    //         "links": [],
    //         "comments": []
    //     }

    //     const fakeSchema : any = {};

    //     const fakeReq : any = {
    //         params: {
    //             id: '1'
    //         }
    //     };

    //     const fakeLink = {
    //         "title": "Testing Getting A Link!",
    //         "url": "https://www.getlink.com/",
    //         "id": 1,
    //         "user": fakeUser,
    //         "comments": [],
    //         "votes": []
    //     };

    //     const fakeUserRepository : any = {
    //         findOne: () => {
    //             return Promise.resolve(fakeUser);
    //         }
    //     };

    //     const fakeLinkRepository : any = {
    //         findOne: () => {
    //             return Promise.resolve(fakeLink);
    //         }
    //     };


    //     const fakeRes: any = {
    //         json: function (link: any) {
    //             expect(link.title).eql(fakeLink.title);
    //             expect(link.url).eql(fakeLink.url);
    //             expect(link.id).eql(fakeLink.id);
    //             expect(link.user).eql(fakeLink.user);
    //             done();
    //         },
    //         end: function () {},
    //         status: function (s: number) {
    //             this.statusCode = s;
    //             expect(this.statusCode).eql(200);
    //             done();
    //         }
    //     }

    //     // Call method using fake data

    //     const {getLinkById} = getLinksHandlers(fakeLinkRepository, fakeUserRepository, fakeVoteRepository, fakeSchema, fakeJoi);
    //     getLinkById(fakeReq, fakeRes);

    // });

});