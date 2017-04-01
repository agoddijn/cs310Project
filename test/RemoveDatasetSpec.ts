/**
 * Created by alexgoddijn on 22/01/2017.
 */

/**
 * Created by alexgoddijn on 22/01/2017.
 */
/**
 * Created by Alex Goddijn on 2017-01-20.
 */

import InsightFacade from "../src/controller/InsightFacade";
import {Log} from "../src/Util";
import {expect} from 'chai';
import {InsightResponse} from "../src/controller/IInsightFacade";
import FileSystem from "../src/controller/FileSystem";
var fs: any = require("fs");
var testPath = "./test/data/";

describe("RemoveDatasetSpec", function () {

    var isf: InsightFacade = new InsightFacade();

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    function checkErr(response: InsightResponse) {
        expect(response.code).to.equal(404);
        expect(response.body).to.have.property("error");
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        var cachePath = './cache';
        if( fs.existsSync(cachePath) ) {
            fs.readdirSync(cachePath).forEach(function(file: any,index: any){
                var curPath = cachePath + "/" + file;
                fs.unlinkSync(curPath);
            });
            fs.rmdirSync(cachePath);
        }
    });

    it("It should reject given the file has not been previously added", function (done) {
        var filename = "courses";
        isf.removeDataset(filename).then(function (res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not succeed");
        }).catch(function (err: any) {
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            checkErr(err);
            FileSystem.check(filename).then(function(exists: boolean) {
                expect(exists).to.equal(false);
                done();
            }).catch(function(err: any) {
                Log.test(JSON.stringify(err));
                done(err);
            });
        });
    });

    it("It should reject given the file has not been previously added", function (done) {
        var filename = "courses2";
        isf.removeDataset(filename).then(function (res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Data could not be removed");
        }).catch(function (err: any) {
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            checkErr(err);
            FileSystem.check(filename).then(function(exists: boolean) {
                expect(exists).to.equal(false);
                done();
            }).catch(function(err: any) {
                Log.test(JSON.stringify(err));
                done(err);
            });
        });
    });


});
