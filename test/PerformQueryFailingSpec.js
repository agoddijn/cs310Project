"use strict";
var InsightFacade_1 = require("../src/controller/InsightFacade");
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var FileSystem_1 = require("../src/controller/FileSystem");
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
    var isf = new InsightFacade_1.default();
    function sanityCheck(response) {
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    before(function () {
        Util_1.Log.test('Before: ' + this.test.parent.title);
        FileSystem_1.default.write("courses", []);
        FileSystem_1.default.write("rooms", []);
    });
    beforeEach(function () {
        Util_1.Log.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        Util_1.Log.test('After: ' + this.test.parent.title);
    });
    afterEach(function () {
        Util_1.Log.test('AfterTest: ' + this.currentTest.title);
    });
    it("It should throw 400 Query is not valid given null", function (done) {
        isf.performQuery(null).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 Query is not valid given undefined", function (done) {
        isf.performQuery(undefined).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 Query is not valid given empty JSON object", function (done) {
        isf.performQuery({}).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 Query is not valid given empty JSON array", function (done) {
        isf.performQuery([]).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
            ;
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 Query is not valid given empty JSON array", function (done) {
        isf.performQuery([]).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if body doesn't have enough keys", function (done) {
        var queryRequest = require("./data/badRequest9.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if body doesn't have WHERE", function (done) {
        var queryRequest = require("./data/badReq1.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if body is not an object", function (done) {
        var queryRequest = require("./data/badReq2.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 token not supported given an invalid MCOMPARATOR JSON object", function (done) {
        isf.performQuery(badReq1).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
            ;
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 token not supported given an invalid MCOMPARATOR anywhere in the chain", function (done) {
        isf.performQuery(badReq2).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
            ;
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if MComparator has more than 1 key", function (done) {
        var queryRequest = require("./data/badRequest11.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if MComparator key is not a number", function (done) {
        var queryRequest = require("./data/badReq6.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if logicComparator doesnt have conditions", function (done) {
        var queryRequest = require("./data/badRequest10.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if logicComparator is not an array", function (done) {
        var queryRequest = require("./data/badReq3.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if SComparator doesnt have a string", function (done) {
        var queryRequest = require("./data/badRequest12.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if SComparator has more than one key", function (done) {
        var queryRequest = require("./data/badReq4.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if SComparator key is not a string", function (done) {
        var queryRequest = require("./data/badReq5.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if Negation is not an object", function (done) {
        var queryRequest = require("./data/badReq7.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if COLUMNS is not an array", function (done) {
        var queryRequest = require("./data/badReq8.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if COLUMNS is empty", function (done) {
        var queryRequest = require("./data/badReq9.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if form isn't a TABLE", function (done) {
        var queryRequest = require("./data/badRequest13.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 424 not found given a non existent id", function (done) {
        isf.performQuery(badReq3).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(424);
            chai_1.expect(err.body).to.have.key("missing");
            chai_1.expect(err.body.missing).to.deep.equal(["courses1", "courses1", "courses1"]);
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 424 not found given multiple non existent id's", function (done) {
        isf.performQuery(badReq4).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(424);
            chai_1.expect(err.body).to.have.key("missing");
            chai_1.expect(err.body.missing).to.deep.equal(["courses1", "courses1", "courses2", "courses2"]);
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 424 not found given multiple non existent id's in order or columns", function (done) {
        isf.performQuery(badReq8).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(424);
            chai_1.expect(err.body).to.have.key("missing");
            chai_1.expect(err.body.missing).to.deep.equal(["courses2", "courses1", "courses1", "courses1"]);
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 token not supported given an invalid COLUMNS JSON object", function (done) {
        isf.performQuery(badReq5).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 token not supported given an invalid FORM JSON object", function (done) {
        isf.performQuery(badReq6).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if both a course key and room key are in the request", function (done) {
        var queryRequest = require("./data/invalidReqRoomAndCourseKey.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if it tries to query two datasets at the same time", function (done) {
        var queryRequest = require("./data/badRequest14.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if order does not match columns", function (done) {
        var queryRequest = require("./data/orderNotInColumns.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if order does not have keys", function (done) {
        var queryRequest = require("./data/badReq10.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if keys are not an array", function (done) {
        var queryRequest = require("./data/badReq11.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if keys are empty", function (done) {
        var queryRequest = require("./data/badReq12.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if type of value is not correct", function (done) {
        var queryRequest = require("./data/valueTypeIncorrect.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Should throw 424 if id is missing, even if query is invalid", function (done) {
        var queryRequest = require("./data/should424.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(424);
            chai_1.expect(err.body).to.have.key("missing");
            chai_1.expect(err.body.missing).to.deep.equal(["courses1", "courses1", "courses1"]);
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if rooms has course key", function (done) {
        var queryRequest = require("./data/roomsWithCoursesKey.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if rooms has a random key", function (done) {
        var queryRequest = require("./data/roomsWithRandomKey.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if courses has rooms key", function (done) {
        var queryRequest = require("./data/badRequest18.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if there is an invalid query", function (done) {
        var queryRequest = require("./data/badRequest22.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if all Column keys are not included", function (done) {
        var queryRequest = require("./data/badRequest15.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if APPLY is missing", function (done) {
        var queryRequest = require("./data/badRequest16.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if GROUP is missing", function (done) {
        var queryRequest = require("./data/badRequest33.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if GROUP is not an array", function (done) {
        var queryRequest = require("./data/badRequest34.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if GROUP is empty", function (done) {
        var queryRequest = require("./data/badRequest35.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if APPLY is not an array", function (done) {
        var queryRequest = require("./data/badRequest36.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if APPLYkey is not an object", function (done) {
        var queryRequest = require("./data/badRequest37.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if AVG has wrong type", function (done) {
        var queryRequest = require("./data/badRequest17.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if APPLY has wrong key", function (done) {
        var queryRequest = require("./data/badRequest19.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if APPLY token is wrong", function (done) {
        var queryRequest = require("./data/badRequest20.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 424 if id's are missing", function (done) {
        var queryRequest = require("./data/badRequest21.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(424);
            chai_1.expect(err.body).to.have.key("missing");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if ORDER direction is invalid", function (done) {
        var queryRequest = require("./data/badRequest31.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should throw 400 if APPLY token has _ ", function (done) {
        var queryRequest = require("./data/badRequest23.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Venus: Invalid query should result in 400", function (done) {
        var queryRequest = require("./data/badRequest24.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Venus2: Invalid query should result in 424", function (done) {
        var queryRequest = require("./data/badRequest29.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(424);
            chai_1.expect(err.body).to.have.key("missing");
            chai_1.expect(err.body.missing).to.deep.equal(["foo"]);
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Vineseed: Invalid query should result in 400", function (done) {
        var queryRequest = require("./data/badRequest25.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Vineseed2: Invalid query should result in 400", function (done) {
        var queryRequest = require("./data/badRequest30.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(424);
            chai_1.expect(err.body).to.have.key("missing");
            chai_1.expect(err.body.missing).to.deep.equal(["foo"]);
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Uranus: Invalid query should result in 400", function (done) {
        var queryRequest = require("./data/badRequest26.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Sunergy: Invalid query should result in 400", function (done) {
        var queryRequest = require("./data/badRequest27.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Uranium: Invalid query should result in 400", function (done) {
        var queryRequest = require("./data/badRequest28.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Uranium2: Invalid query should result in 400", function (done) {
        var queryRequest = require("./data/badRequest28.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Uranium3: Invalid query should result in 400", function (done) {
        var queryRequest = require("./data/badRequest40.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Sulfur: Invalid query should result in 400", function (done) {
        var queryRequest = require("./data/badRequest32.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("Order key not in group or apply should throw 400", function (done) {
        var queryRequest = require("./data/orderKeysInColumns.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("find bugs", function (done) {
        var queryRequest = require("./data/findBugs.json");
        isf.performQuery(queryRequest).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            chai_1.expect(err.code).to.equal(400);
            chai_1.expect(err.body).to.have.key("error");
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});
//# sourceMappingURL=PerformQueryFailingSpec.js.map