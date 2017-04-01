"use strict";
var InsightFacade_1 = require("../src/controller/InsightFacade");
var Util_1 = require("../src/Util");
var chai_1 = require("chai");
var FileSystem_1 = require("../src/controller/FileSystem");
var fs = require("fs");
var testPath = "./test/data/";
describe("AddDatasetPassingSpec", function () {
    var isf = new InsightFacade_1.default();
    function sanityCheck(response) {
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    function courseCheck(response, id) {
        chai_1.expect(response).to.have.property(id + "_dept");
        chai_1.expect(response[id + "_dept"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_id");
        chai_1.expect(response[id + "_id"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_avg");
        chai_1.expect(response[id + "_avg"]).to.be.a('number');
        chai_1.expect(response).to.have.property(id + "_instructor");
        chai_1.expect(response[id + "_instructor"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_title");
        chai_1.expect(response[id + "_title"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_pass");
        chai_1.expect(response[id + "_pass"]).to.be.a('number');
        chai_1.expect(response).to.have.property(id + "_fail");
        chai_1.expect(response[id + "_fail"]).to.be.a('number');
        chai_1.expect(response).to.have.property(id + "_audit");
        chai_1.expect(response[id + "_audit"]).to.be.a('number');
        chai_1.expect(response).to.have.property(id + "_year");
        chai_1.expect(response[id + "_year"]).to.be.a('number');
    }
    function roomCheck(response, id) {
        chai_1.expect(response).to.have.property(id + "_fullname");
        chai_1.expect(response[id + "_fullname"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_shortname");
        chai_1.expect(response[id + "_shortname"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_number");
        chai_1.expect(response[id + "_number"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_name");
        chai_1.expect(response[id + "_name"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_address");
        chai_1.expect(response[id + "_address"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_lat");
        chai_1.expect(response[id + "_lat"]).to.be.a('number');
        chai_1.expect(response).to.have.property(id + "_lon");
        chai_1.expect(response[id + "_lon"]).to.be.a('number');
        chai_1.expect(response).to.have.property(id + "_seats");
        chai_1.expect(response[id + "_seats"]).to.be.a('number');
        chai_1.expect(response).to.have.property(id + "_type");
        chai_1.expect(response[id + "_type"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_furniture");
        chai_1.expect(response[id + "_furniture"]).to.be.a('string');
        chai_1.expect(response).to.have.property(id + "_href");
        chai_1.expect(response[id + "_href"]).to.be.a('string');
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
    it("It should parse and cache a big zip file of courses", function (done) {
        this.timeout(300000);
        var filename = "courses";
        var pathToFile = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        isf.addDataset(filename, zipData).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            sanityCheck(res);
            chai_1.expect(res.code).to.equal(204);
            FileSystem_1.default.read(filename).then(function (data1) {
                chai_1.expect(data1.length).to.equal(64612);
                courseCheck(data1[0], filename);
                isf.addDataset(filename, zipData).then(function (res) {
                    Util_1.Log.test(JSON.stringify(res));
                    sanityCheck(res);
                    chai_1.expect(res.code).to.equal(201);
                    FileSystem_1.default.read(filename).then(function (data2) {
                        chai_1.expect(data2.length).to.equal(64612);
                        courseCheck(data2[0], filename);
                        isf.removeDataset(filename).then(function (res) {
                            Util_1.Log.test(JSON.stringify(res));
                            FileSystem_1.default.check(filename).then(function (exists) {
                                chai_1.expect(exists).to.equal(false);
                                done();
                            }).catch(function (err) {
                                Util_1.Log.test(JSON.stringify(err));
                                done(err);
                            });
                        }).catch(function (err) {
                            Util_1.Log.test(JSON.stringify(err));
                            done(err);
                        });
                    }).catch(function (err) {
                        Util_1.Log.test(JSON.stringify(err));
                        done(err);
                    });
                }).catch(function (err) {
                    Util_1.Log.test(JSON.stringify(err));
                    done(err);
                });
            }).catch(function (err) {
                Util_1.Log.test(JSON.stringify(err));
                done(err);
            });
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            done(err);
        });
    });
    it("It should parse and cache a big zip file of rooms", function (done) {
        this.timeout(300000);
        var filename = "rooms";
        var pathToFile = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        isf.addDataset(filename, zipData).then(function (res) {
            Util_1.Log.test(JSON.stringify(res));
            sanityCheck(res);
            chai_1.expect(res.code).to.equal(204);
            FileSystem_1.default.read(filename).then(function (data1) {
                chai_1.expect(data1.length).to.equal(364);
                roomCheck(data1[0], filename);
                isf.addDataset(filename, zipData).then(function (res) {
                    Util_1.Log.test(JSON.stringify(res));
                    sanityCheck(res);
                    chai_1.expect(res.code).to.equal(201);
                    FileSystem_1.default.read(filename).then(function (data2) {
                        chai_1.expect(data2.length).to.equal(364);
                        roomCheck(data2[0], filename);
                        isf.removeDataset(filename).then(function (res) {
                            Util_1.Log.test(JSON.stringify(res));
                            FileSystem_1.default.check(filename).then(function (exists) {
                                chai_1.expect(exists).to.equal(false);
                                done();
                            }).catch(function (err) {
                                Util_1.Log.test(JSON.stringify(err));
                                done(err);
                            });
                        }).catch(function (err) {
                            Util_1.Log.test(JSON.stringify(err));
                            done(err);
                        });
                    }).catch(function (err) {
                        Util_1.Log.test(JSON.stringify(err));
                        done(err);
                    });
                }).catch(function (err) {
                    Util_1.Log.test(JSON.stringify(err));
                    done(err);
                });
            }).catch(function (err) {
                Util_1.Log.test(JSON.stringify(err));
                done(err);
            });
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            done(err);
        });
    });
});
//# sourceMappingURL=AddDatasetPassingSpec.js.map