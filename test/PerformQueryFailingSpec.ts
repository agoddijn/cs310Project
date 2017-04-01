/**
 * Created by Alex Goddijn on 2017-01-20.
 */

import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import {Log} from "../src/Util";
import {InsightResponse, Course} from "../src/controller/IInsightFacade";
import FileSystem from "../src/controller/FileSystem";

var badReq1 = require("./data/badRequest1.json");
var badReq2 = require("./data/badRequest2.json");
var badReq3 = require("./data/badRequest3.json");
var badReq4 = require("./data/badRequest4.json");
var badReq5 = require("./data/badRequest5.json");
var badReq6 = require("./data/badRequest6.json");
var badReq8 = require("./data/badRequest8.json");
var notFound1 = require("./data/notFound1.json");
var notFound2 = require("./data/notFound2.json");

describe("PerformQueryFailingSpec", function () {

    var isf: InsightFacade = new InsightFacade();

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
        FileSystem.write("courses", []);
        FileSystem.write("rooms", []);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("It should throw 400 Query is not valid given null", function (done) {
        isf.performQuery(null).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 Query is not valid given undefined", function (done) {
        isf.performQuery(undefined).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 Query is not valid given empty JSON object", function (done) {
        isf.performQuery({}).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });



    it("It should throw 400 Query is not valid given empty JSON array", function (done) {
        isf.performQuery([]).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");;
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 Query is not valid given empty JSON array", function (done) {
        isf.performQuery([]).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if body doesn't have enough keys", function (done) {
        let queryRequest = require("./data/badRequest9.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if body doesn't have WHERE", function (done) {
        let queryRequest = require("./data/badReq1.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if body is not an object", function (done) {
        let queryRequest = require("./data/badReq2.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });


    it("It should throw 400 token not supported given an invalid MCOMPARATOR JSON object", function (done) {
        isf.performQuery(badReq1).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");;
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 token not supported given an invalid MCOMPARATOR anywhere in the chain", function (done) {
        isf.performQuery(badReq2).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");;
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if MComparator has more than 1 key", function (done) {
        let queryRequest = require("./data/badRequest11.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if MComparator key is not a number", function (done) {
        let queryRequest = require("./data/badReq6.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if logicComparator doesnt have conditions", function (done) {
        let queryRequest = require("./data/badRequest10.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if logicComparator is not an array", function (done) {
        let queryRequest = require("./data/badReq3.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if SComparator doesnt have a string", function (done) {
        let queryRequest = require("./data/badRequest12.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if SComparator has more than one key", function (done) {
        let queryRequest = require("./data/badReq4.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if SComparator key is not a string", function (done) {
        let queryRequest = require("./data/badReq5.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if Negation is not an object", function (done) {
        let queryRequest = require("./data/badReq7.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if COLUMNS is not an array", function (done) {
        let queryRequest = require("./data/badReq8.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if COLUMNS is empty", function (done) {
        let queryRequest = require("./data/badReq9.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if form isn't a TABLE", function (done) {
        let queryRequest = require("./data/badRequest13.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });


    it("It should throw 424 not found given a non existent id", function (done) {
        isf.performQuery(badReq3).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.key("missing");
            expect(err.body.missing).to.deep.equal(["courses1", "courses1", "courses1"]);
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 424 not found given multiple non existent id's", function (done) {
        isf.performQuery(badReq4).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.key("missing");
            expect(err.body.missing).to.deep.equal(["courses1", "courses1", "courses2", "courses2"]);
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 424 not found given multiple non existent id's in order or columns", function (done) {
        isf.performQuery(badReq8).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.key("missing");
            expect(err.body.missing).to.deep.equal(["courses2", "courses1", "courses1", "courses1"]);
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 token not supported given an invalid COLUMNS JSON object", function (done) {
        isf.performQuery(badReq5).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 token not supported given an invalid FORM JSON object", function (done) {
        isf.performQuery(badReq6).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if both a course key and room key are in the request", function (done) {
        let queryRequest = require("./data/invalidReqRoomAndCourseKey.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if it tries to query two datasets at the same time", function (done) {
        let queryRequest = require("./data/badRequest14.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if order does not match columns", function (done) {
        let queryRequest = require("./data/orderNotInColumns.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if order does not have keys", function (done) {
        let queryRequest = require("./data/badReq10.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if keys are not an array", function (done) {
        //PASSES IN THE UI as 200:OK
        let queryRequest = require("./data/badReq11.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if keys are empty", function (done) {
        let queryRequest = require("./data/badReq12.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if type of value is not correct", function (done) {
        let queryRequest = require("./data/valueTypeIncorrect.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("Should throw 424 if id is missing, even if query is invalid", function (done) {
        let queryRequest = require("./data/should424.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.key("missing");
            expect(err.body.missing).to.deep.equal(["courses1", "courses1", "courses1"]);
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if rooms has course key", function (done) {
        let queryRequest = require("./data/roomsWithCoursesKey.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if rooms has a random key", function (done) {
        let queryRequest = require("./data/roomsWithRandomKey.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if courses has rooms key", function (done) {
        let queryRequest = require("./data/badRequest18.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if there is an invalid query", function (done) {
        // for oxygen
        let queryRequest = require("./data/badRequest22.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if all Column keys are not included", function (done) {
        // {"error":"All COLUMNS keys need to be either in GROUP or in APPLY"}
        let queryRequest = require("./data/badRequest15.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if APPLY is missing", function (done) {
        // {"error":"Transformations needs to contains both GROUP and APPLY"}
        let queryRequest = require("./data/badRequest16.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error")
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if GROUP is missing", function (done) {
        // {"error":"Transformations needs to contains both GROUP and APPLY"}
        let queryRequest = require("./data/badRequest33.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if GROUP is not an array", function (done) {
        ////PASSES IN THE UI as 200:OK
        let queryRequest = require("./data/badRequest34.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error")
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if GROUP is empty", function (done) {
        let queryRequest = require("./data/badRequest35.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error")
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if APPLY is not an array", function (done) {
        let queryRequest = require("./data/badRequest36.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error")
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if APPLYkey is not an object", function (done) {
        let queryRequest = require("./data/badRequest37.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error")
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if AVG has wrong type", function (done) {
        // {"error":"Avg supports only numerical values"}
        let queryRequest = require("./data/badRequest17.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if APPLY has wrong key", function (done) {
        // {"error":"[object Object] is not a valid key"}
        let queryRequest = require("./data/badRequest19.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if APPLY token is wrong", function (done) {
        // {"error":"Apply token not recognized"}
        let queryRequest = require("./data/badRequest20.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 424 if id's are missing", function (done) {
        // {"missing":["rooms3","rooms4","rooms5"]}
        let queryRequest = require("./data/badRequest21.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.key("missing");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 if ORDER direction is invalid", function (done) {
        //{"error":"Order direction not valid"}
        let queryRequest = require("./data/badRequest31.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });


    it("It should throw 400 if APPLY token has _ ", function (done) {
        // {"error":"Apply token not recognized"}
        let queryRequest = require("./data/badRequest23.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("Venus: Invalid query should result in 400", function (done) {
        let queryRequest = require("./data/badRequest24.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("Venus2: Invalid query should result in 424", function (done) {
        let queryRequest = require("./data/badRequest29.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.key("missing");
            expect(err.body.missing).to.deep.equal(["foo"]);
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("Vineseed: Invalid query should result in 400", function (done) {
        let queryRequest = require("./data/badRequest25.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("Vineseed2: Invalid query should result in 400", function (done) {
        let queryRequest = require("./data/badRequest30.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.key("missing");
            expect(err.body.missing).to.deep.equal(["foo"]);
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("Uranus: Invalid query should result in 400", function (done) {
        let queryRequest = require("./data/badRequest26.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });


    it("Sunergy: Invalid query should result in 400", function (done) {
        //{"error":"Group cannot contain apply keys"}
        let queryRequest = require("./data/badRequest27.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("Uranium: Invalid query should result in 400", function (done) {
        let queryRequest = require("./data/badRequest28.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("Uranium2: Invalid query should result in 400", function (done) {
        let queryRequest = require("./data/badRequest28.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("Uranium3: Invalid query should result in 400", function (done) {
        let queryRequest = require("./data/badRequest40.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });


    it("Sulfur: Invalid query should result in 400", function (done) {
        let queryRequest = require("./data/badRequest32.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("Order key not in group or apply should throw 400", function (done) {
        let queryRequest = require("./data/orderKeysInColumns.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("find bugs", function (done) {
        let queryRequest = require("./data/findBugs.json");
        isf.performQuery(queryRequest).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

});
