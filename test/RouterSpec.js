"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var Server_1 = require("../src/rest/Server");
var fs = require("fs");
var testPath = "./test/data/";
var chai = require('chai');
var chaiHttp = require('chai-http');
describe("RouterSpec", function () {
    chai.use(chaiHttp);
    var port = 4321;
    var server = new Server_1.default(port);
    before(function () {
        Util_1.Log.test('Before: ' + this.test.parent.title);
        return server.start().catch(function (err) {
            Util_1.Log.test(err);
            chai_1.expect.fail();
        });
    });
    beforeEach(function () {
        Util_1.Log.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        Util_1.Log.test('After: ' + this.test.parent.title);
        return server.stop().catch(function (err) {
            chai_1.expect.fail();
        });
    });
    afterEach(function () {
        Util_1.Log.test('AfterTest: ' + this.currentTest.title);
    });
    it("Should be able to add", function () {
        this.timeout(10000);
        var filename = "courses";
        var pathToFile = testPath + filename + ".zip";
        return chai.request("http://localhost:" + port)
            .put("/dataset/" + filename)
            .attach("body", fs.readFileSync(pathToFile), "courses.zip")
            .then(function (res) {
            Util_1.Log.trace('then:');
            Util_1.Log.test(JSON.stringify(res));
            chai_1.expect(res.status).to.equal(204);
        })
            .catch(function (err) {
            Util_1.Log.trace('catch:');
            Util_1.Log.test(JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Should be able to query", function () {
        var queryRequest = require("./data/simpleEQquery.json");
        var objBody = require("./data/simpleEQbody.json");
        return chai.request("http://localhost:" + port)
            .post('/query')
            .send(queryRequest)
            .then(function (res) {
            Util_1.Log.trace('then:');
            Util_1.Log.test(JSON.stringify(res));
            chai_1.expect(res.status).to.equal(200);
            chai_1.expect(res.body).to.deep.equal(objBody);
        })
            .catch(function (err) {
            Util_1.Log.trace('catch:');
            Util_1.Log.test(JSON.stringify(err.response.status));
            Util_1.Log.test(JSON.stringify(err.response.text));
            chai_1.expect.fail();
        });
    });
    it("Should be able to remove", function () {
        var filename = "courses";
        return chai.request("http://localhost:" + port)
            .delete('/dataset/' + filename)
            .then(function (res) {
            Util_1.Log.trace('then:');
            Util_1.Log.test(JSON.stringify(res));
            chai_1.expect(res.status).to.equal(204);
        })
            .catch(function (err) {
            Util_1.Log.trace('catch:');
            Util_1.Log.test(JSON.stringify(err.response.status));
            Util_1.Log.test(JSON.stringify(err.response.text));
            chai_1.expect.fail();
        });
    });
    it("Should not be able to remove", function () {
        var filename = "rooms";
        return chai.request("http://localhost:" + port)
            .delete('/dataset/' + filename)
            .then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            chai_1.expect.fail();
        })
            .catch(function (err) {
            Util_1.Log.trace('catch:');
            Util_1.Log.test(JSON.stringify(err.response.status));
            Util_1.Log.test(JSON.stringify(err.response.text));
            chai_1.expect(err.status).to.equal(404);
        }).catch(function (err) {
            Util_1.Log.trace('catch2:');
            chai_1.expect.fail();
        });
    });
});
//# sourceMappingURL=RouterSpec.js.map