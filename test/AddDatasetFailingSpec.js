"use strict";
var InsightFacade_1 = require("../src/controller/InsightFacade");
var Util_1 = require("../src/Util");
var chai_1 = require("chai");
var FileSystem_1 = require("../src/controller/FileSystem");
var fs = require("fs");
var testPath = "./test/data/";
describe("AddDatasetfailingSpec", function () {
    var isf = new InsightFacade_1.default();
    function sanityCheck(response) {
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    function checkErr(response) {
        chai_1.expect(response.code).to.equal(400);
        chai_1.expect(response.body).to.have.property("error");
    }
    before(function () {
        Util_1.Log.test('Before: ' + this.test.parent.title);
    });
    beforeEach(function () {
        Util_1.Log.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        Util_1.Log.test('After: ' + this.test.parent.title);
    });
    afterEach(function () {
        Util_1.Log.test('AfterTest: ' + this.currentTest.title);
        var cachePath = './cache';
        if (fs.existsSync(cachePath)) {
            fs.readdirSync(cachePath).forEach(function (file, index) {
                var curPath = cachePath + "/" + file;
                fs.unlinkSync(curPath);
            });
            fs.rmdirSync(cachePath);
        }
    });
    it("It should reject given zip file with bad JSON", function (done) {
        var filename = "badZip1";
        var pathToFile = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        isf.addDataset(filename, zipData).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not succeed");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            checkErr(err);
            FileSystem_1.default.check(filename).then(function (exists) {
                chai_1.expect(exists).to.equal(false);
                done();
            }).catch(function (err) {
                Util_1.Log.test(JSON.stringify(err));
                done(err);
            });
        });
    });
    it("It should reject given bad zip file", function (done) {
        var filename = "badZip2";
        var pathToFile = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        isf.addDataset(filename, zipData).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            done("Should not succeed");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            checkErr(err);
            FileSystem_1.default.check(filename).then(function (exists) {
                chai_1.expect(exists).to.equal(false);
                done();
            }).catch(function (err) {
                Util_1.Log.test(JSON.stringify(err));
                done(err);
            });
        });
    });
    it("It should reject given invalid id", function (done) {
        var filename = "courses";
        var pathToFile = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        var id = null;
        isf.addDataset(id, zipData).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            sanityCheck(res);
            done("Should not succeed");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            checkErr(err);
            done();
        }).catch(function (err) {
            done(err);
        });
    });
    it("It should reject given a different id", function (done) {
        var filename = "courses";
        var pathToFile = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        var id = "rooms";
        isf.addDataset(id, zipData).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            sanityCheck(res);
            done("Should not succeed");
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            sanityCheck(err);
            checkErr(err);
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});
//# sourceMappingURL=AddDatasetFailingSpec.js.map