/**
 * Created by alexgoddijn on 22/03/2017.
 */

import {expect} from 'chai';
import {Log} from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
var fs: any = require("fs");
var testPath = "./test/data/";


describe("ScheduleSpec", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    var insightFacade: InsightFacade = new InsightFacade();

    before(function (done) {
        Log.test('Before: ' + (<any>this).test.parent.title);
        this.timeout(600000);
        let dataCourses = fs.readFileSync(testPath + "courses.zip");
        let dataRooms = fs.readFileSync(testPath + "rooms.zip");
        insightFacade.addDataset("courses", dataCourses).then(function(res: InsightResponse) {
            insightFacade.addDataset("rooms", dataRooms).then(function(res: InsightResponse) {
                done();
            }).catch(function(err: any) {
                Log.test(JSON.stringify(err));
                done("Could not load rooms dataset");
            });
        }).catch(function(err: any) {
            Log.test(JSON.stringify(err));
            done("Could not load courses dataset");
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

    it("Should schedule with a simple course request", function (done) {
        let queryRequestCourse = require("./data/scheduleQueryCourses.json");
        let queryRequestRoom = require("./data/scheduleQueryRooms.json");
        insightFacade.performSchedule(queryRequestCourse, queryRequestRoom).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal({});
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });


});
