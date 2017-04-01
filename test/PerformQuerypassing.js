"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var fs = require("fs");
var testPath = "./test/data/";
describe("PerformQueryPassing", function () {
    function sanityCheck(response) {
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    var insightFacade = new InsightFacade_1.default();
    before(function (done) {
        Util_1.Log.test('Before: ' + this.test.parent.title);
        this.timeout(300000);
        var data = fs.readFileSync(testPath + "courses.zip");
        insightFacade.addDataset("courses", data).then(function (res) {
            done();
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            done("Could not load dataset");
        });
    });
    beforeEach(function () {
        Util_1.Log.test('BeforeTest: ' + this.currentTest.title);
        insightFacade = new InsightFacade_1.default();
    });
    after(function () {
        Util_1.Log.test('After: ' + this.test.parent.title);
        var cachePath = './cache';
        if (fs.existsSync(cachePath)) {
            fs.readdirSync(cachePath).forEach(function (file, index) {
                var curPath = cachePath + "/" + file;
                fs.unlinkSync(curPath);
            });
            fs.rmdirSync(cachePath);
        }
    });
    afterEach(function () {
        Util_1.Log.test('AfterTest: ' + this.currentTest.title);
        insightFacade = null;
    });
    it("Simple query with GT", function (done) {
        var queryRequest = require("./data/simpleGTquery.json");
        var objBody = require("./data/simpleGTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Simple query with EQ", function (done) {
        var queryRequest = require("./data/simpleEQquery.json");
        var objBody = require("./data/simpleEQbody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Simple query with LT", function (done) {
        var queryRequest = require("./data/simpleLTquery.json");
        var objBody = require("./data/simpleLTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Complex query", function (done) {
        var queryRequest = require("./data/complexQuery.json");
        var objBody = require("./data/complexQueryBody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Complex query with NOT", function (done) {
        var queryRequest = require("./data/complexQueryNOT.json");
        var objBody = require("./data/complexQueryNOTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for sections by specific person", function (done) {
        var queryRequest = require("./data/SpecificInstructorQuery.json");
        var objBody = require("./data/SpecificInstructorQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for instructors with partial name", function (done) {
        var queryRequest = require("./data/InstructorPartialQuery.json");
        var objBody = require("./data/InstructorPartialQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for instructors in a dept with partial name", function (done) {
        var queryRequest = require("./data/InstructorPartialDeptQuery.json");
        var objBody = require("./data/InstructorPartialDeptQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for instructors in a dept with partial name from right", function (done) {
        var queryRequest = require("./data/InstructorPartialDeptQuery11.json");
        var objBody = require("./data/InstructorPartialDeptQuerybody11.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for instructors in a dept with partial name from left", function (done) {
        var queryRequest = require("./data/InstructorPartialDeptQuery22.json");
        var objBody = require("./data/InstructorPartialDeptQuerybody22.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for instructors in a dept with partial name just wildcard", function (done) {
        var queryRequest = require("./data/InstructorPartialDeptQueryrequest44.json");
        var objBody = require("./data/InstructorPartialDeptQuerybody44.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for instructors in a dept with partial name two wildcards", function (done) {
        var queryRequest = require("./data/InstructorPartialDeptQueryrequest55.json");
        var objBody = require("./data/InstructorPartialDeptQuerybody55.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for instructors in a dept with no name", function (done) {
        var queryRequest = require("./data/InstructorPartialDeptQuery33.json");
        var objBody = require("./data/InstructorPartialDeptQuerybody33.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for courses in a dept with partial name", function (done) {
        var queryRequest = require("./data/CoursesPartialDeptQuery.json");
        var objBody = require("./data/CoursesPartialDeptQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for courses in a dept with partial name from right", function (done) {
        var queryRequest = require("./data/CoursesPartialRightDeptQuery.json");
        var objBody = require("./data/CoursesPartialRightDeptQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for courses in a dept with partial name from left", function (done) {
        var queryRequest = require("./data/CoursesPartialLeftDeptQuery.json");
        var objBody = require("./data/CoursesPartialLeftDeptQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for courses in a dept with partial name from left 2", function (done) {
        var queryRequest = require("./data/CoursesPartialLeftDeptQuery2.json");
        var objBody = require("./data/CoursesPartialLeftDeptResponse2.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for courses in a dept not taught by a specific person", function (done) {
        var queryRequest = require("./data/SpecificInstructorQueryNOT.json");
        var objBody = require("./data/SpecificInstructorQueryNOTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for courses in multiple dept taught by instructors", function (done) {
        var queryRequest = require("./data/AllCoursesInMultipleDeptbyInstructors.json");
        var objBody = require("./data/AllCoursesInMultipleDeptbyInstructorsbody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Query for all courses taught by instructors", function (done) {
        var queryRequest = require("./data/AllCoursesbyInstructors.json");
        var objBody = require("./data/AllCoursesbyInstructorsbody.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Should filter by course year", function (done) {
        var queryRequest = require("./data/filterByYearRequest.json");
        var objBody = require("./data/filterByYearResponse.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Taurus: Should be able to find the average of all courses within a department", function (done) {
        var queryRequest = require("./data/TaurusRequest.json");
        var objBody = require("./data/TaurusResponse.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Voyager: Should be able to query with group and apply", function (done) {
        var queryRequest = require("./data/VoyagerRequest.json");
        var objBody = require("./data/VoyagerResponse.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Should query for d4", function (done) {
        var queryRequest = require("./data/d4Request.json");
        var objBody = require("./data/d4Response.json");
        insightFacade.performQuery(queryRequest).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
});
//# sourceMappingURL=PerformQuerypassing.js.map