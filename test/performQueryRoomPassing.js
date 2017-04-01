"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var fs = require("fs");
var testPath = "./test/data/";
describe("PerformQueryRoomPassing", function () {
    function sanityCheck(response) {
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    var insightFacade = new InsightFacade_1.default();
    before(function (done) {
        Util_1.Log.test('Before: ' + this.test.parent.title);
        this.timeout(3000000);
        var data = fs.readFileSync(testPath + "rooms.zip");
        insightFacade.addDataset("rooms", data).then(function (res) {
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
    it("Simple room query", function (done) {
        var queryRequest = require("./data/simpleRoomRequest.json");
        var objBody = require("./data/simpleRoomResponse.json");
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
    it("Partial address room query", function (done) {
        var queryRequest = require("./data/partialAddressRequest.json");
        var objBody = require("./data/partialAddressResponse.json");
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
    it("Partial href left room query", function (done) {
        var queryRequest = require("./data/findPartialHrefLRequest.json");
        var objBody = require("./data/findPartialHrefLResponse.json");
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
    it("Partial href right room query", function (done) {
        var queryRequest = require("./data/findPartialHrefRRequest.json");
        var objBody = require("./data/findPartialHrefRResponse.json");
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
    it("Partial href both room query", function (done) {
        var queryRequest = require("./data/findPartialHrefBRequest.json");
        var objBody = require("./data/findPartialHrefBResponse.json");
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
    it("Find small rooms", function (done) {
        var queryRequest = require("./data/findSmallRoomsRequest.json");
        var objBody = require("./data/findSmallRoomsResponse.json");
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
    it("Find all rooms of certain type", function (done) {
        var queryRequest = require("./data/findAllRoomsOfTypeRequest.json");
        var objBody = require("./data/findAllRoomsOfTypeResponse.json");
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
    it("Find all rooms of certain type 2", function (done) {
        var queryRequest = require("./data/findAllRoomsOfType2Request.json");
        var objBody = require("./data/findAllRoomsOfType2Response.json");
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
    it("Find all rooms of certain type partial from the right", function (done) {
        var queryRequest = require("./data/findAllRoomsOfType3Request.json");
        var objBody = require("./data/findAllRoomsOfType3Response.json");
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
    it("Find all rooms of certain type partial from the left", function (done) {
        var queryRequest = require("./data/findAllRoomsOfType4Request.json");
        var objBody = require("./data/findAllRoomsOfType4Response.json");
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
    it("Find all rooms of certain type with a wildcard", function (done) {
        var queryRequest = require("./data/findAllRoomsOfType5Request.json");
        var objBody = require("./data/findAllRoomsOfType5Response.json");
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
    it("Find address with lat lon", function (done) {
        var queryRequest = require("./data/findAddressWithLatLonRequest.json");
        var objBody = require("./data/findAddressWithLatLonResponse.json");
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
    it("Should be able to sort URLs", function (done) {
        var queryRequest = require("./data/filterByHrefRequest.json");
        var objBody = require("./data/filterByHrefResponse.json");
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
    it("Should double sort", function (done) {
        var queryRequest = require("./data/QueryWithDoublesortingRequest.json");
        var objBody = require("./data/QueryWithDoublesortingResponse.json");
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
    it("Should count rows", function (done) {
        var queryRequest = require("./data/ApplyTokenCOUNTRequest.json");
        var objBody = require("./data/ApplyTokenCOUNTResponse.json");
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
    it("Should return correctly with redundent groups", function (done) {
        var queryRequest = require("./data/redundentGroup.json");
        var objBody = require("./data/redundentGroupResponse.json");
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
    it("Should calculate average", function (done) {
        var queryRequest = require("./data/ApplyTokenAVGRequest.json");
        var objBody = require("./data/ApplyTokenAVGResponse.json");
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
    it("Should be able to sort with two Apply Tokens", function (done) {
        var queryRequest = require("./data/TwoApplyTokensRequest.json");
        var objBody = require("./data/TwoApplyTokensReponse.json");
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
    it("Should be able to group with 2 or more group tokens", function (done) {
        var queryRequest = require("./data/multiGroupRequest.json");
        var objBody = require("./data/multiGroupResponse.json");
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
    it("Should be able to sort with multiple Apply Tokens of group", function (done) {
        var queryRequest = require("./data/MultipleTokensGroupRequest.json");
        var objBody = require("./data/MultipleTokensGroupResponse.json");
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
    it("Should be able to sort with multiple Apply Tokens", function (done) {
        var queryRequest = require("./data/MultipleTokensRequest.json");
        var objBody = require("./data/MultipleTokensResponse.json");
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
    it("Vanadium: Sorting should be supported", function (done) {
        var queryRequest = require("./data/VanadiumRoomsRequest.json");
        var objBody = require("./data/VanadiumRoomsResponse.json");
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
//# sourceMappingURL=performQueryRoomPassing.js.map