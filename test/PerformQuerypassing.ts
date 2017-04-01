/**
 * Created by shrey on 2017-01-21.
 */
/**
 * Created by rtholmes on 2016-10-31.
 */

import {expect} from 'chai';
import {Log} from "../src/Util";
import {InsightResponse, QueryRequest, IInsightFacade} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
var fs: any = require("fs");
var testPath = "./test/data/";


describe("PerformQueryPassing", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    var insightFacade: InsightFacade = new InsightFacade();

    before(function (done) {
        Log.test('Before: ' + (<any>this).test.parent.title);
        this.timeout(300000);
        let data = fs.readFileSync(testPath + "courses.zip");
        insightFacade.addDataset("courses", data).then(function(res: InsightResponse) {
            done();
        }).catch(function(err: any) {
            Log.test(JSON.stringify(err));
            done("Could not load dataset");
        });

    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insightFacade = new InsightFacade();
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        var cachePath = './cache';
        if( fs.existsSync(cachePath) ) {
            fs.readdirSync(cachePath).forEach(function(file: any,index: any){
                var curPath = cachePath + "/" + file;
                fs.unlinkSync(curPath);
            });
            fs.rmdirSync(cachePath);
        }
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        insightFacade = null;
    });

    /* <------------------ For Courses ------------------>*/

    it("Simple query with GT", function (done) {
        let queryRequest = require("./data/simpleGTquery.json");
        let objBody = require("./data/simpleGTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Simple query with EQ", function (done) {
        let queryRequest = require("./data/simpleEQquery.json");
        let objBody = require("./data/simpleEQbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Simple query with LT", function (done) {
        let queryRequest = require("./data/simpleLTquery.json");
        let objBody = require("./data/simpleLTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Complex query", function (done) {
        let queryRequest = require("./data/complexQuery.json");
        let objBody = require("./data/complexQueryBody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Complex query with NOT", function (done) {
        let queryRequest = require("./data/complexQueryNOT.json");
        let objBody = require("./data/complexQueryNOTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for sections by specific person", function (done) {
        let queryRequest = require("./data/SpecificInstructorQuery.json");
        let objBody = require("./data/SpecificInstructorQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for instructors with partial name", function (done) {
        let queryRequest = require("./data/InstructorPartialQuery.json");
        let objBody = require("./data/InstructorPartialQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for instructors in a dept with partial name", function (done) {
        let queryRequest = require("./data/InstructorPartialDeptQuery.json");
        let objBody = require("./data/InstructorPartialDeptQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for instructors in a dept with partial name from right", function (done) {
        let queryRequest = require("./data/InstructorPartialDeptQuery11.json");
        let objBody = require("./data/InstructorPartialDeptQuerybody11.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for instructors in a dept with partial name from left", function (done) {
        let queryRequest = require("./data/InstructorPartialDeptQuery22.json");
        let objBody = require("./data/InstructorPartialDeptQuerybody22.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for instructors in a dept with partial name just wildcard", function (done) {
        let queryRequest = require("./data/InstructorPartialDeptQueryrequest44.json");
        let objBody = require("./data/InstructorPartialDeptQuerybody44.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for instructors in a dept with partial name two wildcards", function (done) {
        let queryRequest = require("./data/InstructorPartialDeptQueryrequest55.json");
        let objBody = require("./data/InstructorPartialDeptQuerybody55.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for instructors in a dept with no name", function (done) {
        let queryRequest = require("./data/InstructorPartialDeptQuery33.json");
        let objBody = require("./data/InstructorPartialDeptQuerybody33.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for courses in a dept with partial name", function (done) {
        let queryRequest = require("./data/CoursesPartialDeptQuery.json");
        let objBody = require("./data/CoursesPartialDeptQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for courses in a dept with partial name from right", function (done) {
        let queryRequest = require("./data/CoursesPartialRightDeptQuery.json");
        let objBody = require("./data/CoursesPartialRightDeptQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for courses in a dept with partial name from left", function (done) {
        let queryRequest = require("./data/CoursesPartialLeftDeptQuery.json");
        let objBody = require("./data/CoursesPartialLeftDeptQuerybody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for courses in a dept with partial name from left 2", function (done) {
        let queryRequest = require("./data/CoursesPartialLeftDeptQuery2.json");
        let objBody = require("./data/CoursesPartialLeftDeptResponse2.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for courses in a dept not taught by a specific person", function (done) {
        let queryRequest = require("./data/SpecificInstructorQueryNOT.json");
        let objBody = require("./data/SpecificInstructorQueryNOTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for courses in multiple dept taught by instructors", function (done) {
        let queryRequest = require("./data/AllCoursesInMultipleDeptbyInstructors.json");
        let objBody = require("./data/AllCoursesInMultipleDeptbyInstructorsbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Query for all courses taught by instructors", function (done) {
        let queryRequest = require("./data/AllCoursesbyInstructors.json");
        let objBody = require("./data/AllCoursesbyInstructorsbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Should filter by course year", function (done) {
        let queryRequest = require("./data/filterByYearRequest.json");
        let objBody = require("./data/filterByYearResponse.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    // it("Should return noting if id is invalid in WHERE", function (done) {
    //     //Whistler: Valid query should return 200.
    //     let queryRequest = require("./data/invalidIdinWHERErequest.json");
    //     let objBody = require("./data/invalidIdinWHEREresponse.json");
    //     insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
    //         sanityCheck(value);
    //         expect(value.code).to.equal(200);
    //         expect(value.body).to.deep.equal(objBody);
    //         done();
    //     }).catch(function (err) {
    //         Log.test('Error:' + err);
    //         done(err);
    //     });
    // });

    // it("Should be able to sort with multiple Apply Tokens", function (done) {
    //     // groups course_dept, should also pass for Sahara
    //     let queryRequest = require("./data/MultipleTokensCoursesRequest.json");
    //     let objBody = require("./data/MultipleTokensCoursesResponse.json");
    //     insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
    //         sanityCheck(value);
    //         expect(value.code).to.equal(200);
    //         expect(value.body).to.deep.equal(objBody);
    //         done();
    //     }).catch(function (err) {
    //         Log.test('Error:' + err);
    //         done(err);
    //     });
    // });

    it("Taurus: Should be able to find the average of all courses within a department", function (done) {
        let queryRequest = require("./data/TaurusRequest.json");
        let objBody = require("./data/TaurusResponse.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    // it("Vanadium: Sorting should be supported", function (done) {
    //     let queryRequest = require("./data/VanadiumRequest.json");
    //     let objBody = require("./data/VanadiumResponse.json");
    //     insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
    //         sanityCheck(value);
    //         expect(value.code).to.equal(200);
    //         expect(value.body).to.deep.equal(objBody);
    //         done();
    //     }).catch(function (err) {
    //         Log.test('Error:' + err);
    //         done(err);
    //     });
    // });
    //
    // it("Vanadium2: Sorting should be supported", function (done) {
    //     let queryRequest = require("./data/VanadiumRequest2.json");
    //     let objBody = require("./data/VanadiumResponse2.json");
    //     insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
    //         sanityCheck(value);
    //         expect(value.code).to.equal(200);
    //         expect(value.body).to.deep.equal(objBody);
    //         done();
    //     }).catch(function (err) {
    //         Log.test('Error:' + err);
    //         done(err);
    //     });
    // });

    it("Voyager: Should be able to query with group and apply", function (done) {
        let queryRequest = require("./data/VoyagerRequest.json");
        let objBody = require("./data/VoyagerResponse.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Should query for d4", function (done) {
        let queryRequest = require("./data/d4Request.json");
        let objBody = require("./data/d4Response.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });




});
