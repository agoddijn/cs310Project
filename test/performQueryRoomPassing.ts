
/**
 * Created by alexgoddijn on 17/02/2017.
 */

import {expect} from 'chai';
import {Log} from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
var fs: any = require("fs");
var testPath = "./test/data/";


describe("PerformQueryRoomPassing", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    var insightFacade: InsightFacade = new InsightFacade();

    before(function (done) {
        Log.test('Before: ' + (<any>this).test.parent.title);
        this.timeout(3000000);
        let data = fs.readFileSync(testPath + "rooms.zip");
        insightFacade.addDataset("rooms", data).then(function(res: InsightResponse) {
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

    /* <------------------ For Rooms ------------------>*/

    it("Simple room query", function (done) {
        let queryRequest = require("./data/simpleRoomRequest.json");
        let objBody = require("./data/simpleRoomResponse.json");
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

    it("Partial address room query", function (done) {
        let queryRequest = require("./data/partialAddressRequest.json");
        let objBody = require("./data/partialAddressResponse.json");
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

    it("Partial href left room query", function (done) {
        let queryRequest = require("./data/findPartialHrefLRequest.json");
        let objBody = require("./data/findPartialHrefLResponse.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    })

    it("Partial href right room query", function (done) {
        let queryRequest = require("./data/findPartialHrefRRequest.json");
        let objBody = require("./data/findPartialHrefRResponse.json");
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

    it("Partial href both room query", function (done) {
        let queryRequest = require("./data/findPartialHrefBRequest.json");
        let objBody = require("./data/findPartialHrefBResponse.json");
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

    it("Find small rooms", function (done) {
        let queryRequest = require("./data/findSmallRoomsRequest.json");
        let objBody = require("./data/findSmallRoomsResponse.json");
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

    it("Find all rooms of certain type", function (done) {
        let queryRequest = require("./data/findAllRoomsOfTypeRequest.json");
        let objBody = require("./data/findAllRoomsOfTypeResponse.json");
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

    it("Find all rooms of certain type 2", function (done) {
        // for rooms of type ""
        let queryRequest = require("./data/findAllRoomsOfType2Request.json");
        let objBody = require("./data/findAllRoomsOfType2Response.json");
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

    it("Find all rooms of certain type partial from the right", function (done) {
        // for rooms of type "Ca*"
        let queryRequest = require("./data/findAllRoomsOfType3Request.json");
        let objBody = require("./data/findAllRoomsOfType3Response.json");
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

    it("Find all rooms of certain type partial from the left", function (done) {
        // for rooms of type "*ab"
        let queryRequest = require("./data/findAllRoomsOfType4Request.json");
        let objBody = require("./data/findAllRoomsOfType4Response.json");
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

    it("Find all rooms of certain type with a wildcard", function (done) {
        // for rooms of type "*some thing"
        let queryRequest = require("./data/findAllRoomsOfType5Request.json");
        let objBody = require("./data/findAllRoomsOfType5Response.json");
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

    it("Find address with lat lon", function (done) {
        let queryRequest = require("./data/findAddressWithLatLonRequest.json");
        let objBody = require("./data/findAddressWithLatLonResponse.json");
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

    it("Should be able to sort URLs", function (done) {
        let queryRequest = require("./data/filterByHrefRequest.json");
        let objBody = require("./data/filterByHrefResponse.json");
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

    // it("Should return all rows if WHERE is empty", function (done) {
    //     let queryRequest = require("./data/AllRowsRequest.json");
    //     let objBody = require("./data/AllRowsResponse.json");
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

    it("Should double sort", function (done) {
        let queryRequest = require("./data/QueryWithDoublesortingRequest.json");
        let objBody = require("./data/QueryWithDoublesortingResponse.json");
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

    it("Should count rows", function (done) {
        let queryRequest = require("./data/ApplyTokenCOUNTRequest.json");
        let objBody = require("./data/ApplyTokenCOUNTResponse.json");
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

    it("Should return correctly with redundent groups", function (done) {
        let queryRequest = require("./data/redundentGroup.json");
        let objBody = require("./data/redundentGroupResponse.json");
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

    it("Should calculate average", function (done) {
        let queryRequest = require("./data/ApplyTokenAVGRequest.json");
        let objBody = require("./data/ApplyTokenAVGResponse.json");
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

    it("Should be able to sort with two Apply Tokens", function (done) {
        let queryRequest = require("./data/TwoApplyTokensRequest.json");
        let objBody = require("./data/TwoApplyTokensReponse.json");
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

    it("Should be able to group with 2 or more group tokens", function (done) {
        //group of rooms_shortname and rooms_seats
        let queryRequest = require("./data/multiGroupRequest.json");
        let objBody = require("./data/multiGroupResponse.json");
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

    it("Should be able to sort with multiple Apply Tokens of group", function (done) {
        //group of rooms_shortname and rooms_seats
        let queryRequest = require("./data/MultipleTokensGroupRequest.json");
        let objBody = require("./data/MultipleTokensGroupResponse.json");
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

    it("Should be able to sort with multiple Apply Tokens", function (done) {
        // only groups rooms_shortname
        let queryRequest = require("./data/MultipleTokensRequest.json");
        let objBody = require("./data/MultipleTokensResponse.json");
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

    it("Vanadium: Sorting should be supported", function (done) {
        let queryRequest = require("./data/VanadiumRoomsRequest.json");
        let objBody = require("./data/VanadiumRoomsResponse.json");
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
