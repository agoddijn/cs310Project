"use strict";
var Util_1 = require("../src/Util");
var chai_1 = require("chai");
var FileSystem_1 = require("../src/controller/FileSystem");
var fs = require("fs");
var testPath = "./test/data/";
describe("FileSystemSpec", function () {
    var fileSystem = new FileSystem_1.default();
    function sanityCheck(response) {
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
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
    it("Should be able to write", function (done) {
        FileSystem_1.default.write("blah", null).then(function (value) {
            chai_1.expect(value).to.equal(true);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Should not be able to check", function (done) {
        FileSystem_1.default.check("blah").then(function (value) {
            chai_1.expect(value).to.equal(false);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
});
//# sourceMappingURL=FileSystemSpec.js.map