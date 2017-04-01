"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var fs = require("fs");
var testPath = "./test/data/";
describe("ScheduleSpec", function () {
    function sanityCheck(response) {
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    var insightFacade = new InsightFacade_1.default();
    before(function (done) {
        Util_1.Log.test('Before: ' + this.test.parent.title);
        this.timeout(600000);
        var dataCourses = fs.readFileSync(testPath + "courses.zip");
        var dataRooms = fs.readFileSync(testPath + "rooms.zip");
        insightFacade.addDataset("courses", dataCourses).then(function (res) {
            insightFacade.addDataset("rooms", dataRooms).then(function (res) {
                done();
            }).catch(function (err) {
                Util_1.Log.test(JSON.stringify(err));
                done("Could not load rooms dataset");
            });
        }).catch(function (err) {
            Util_1.Log.test(JSON.stringify(err));
            done("Could not load courses dataset");
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
    it("Should schedule with a simple course request", function (done) {
        var queryRequestCourse = require("./data/scheduleQueryCourses.json");
        var queryRequestRoom = require("./data/scheduleQueryRooms.json");
        insightFacade.performSchedule(queryRequestCourse, queryRequestRoom).then(function (value) {
            sanityCheck(value);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(value.body).to.deep.equal({});
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
});
//# sourceMappingURL=ScheduleSpec.js.map