/**
 * Created by shrey on 22/01/2017.
 */


import InsightFacade from "../src/controller/InsightFacade";
import {Log} from "../src/Util";
import {expect} from 'chai';
import {InsightResponse} from "../src/controller/IInsightFacade";
import FileSystem from "../src/controller/FileSystem";
var fs: any = require("fs");
var testPath = "./test/data/";

describe("FileSystemSpec", function () {

    var fileSystem: FileSystem = new FileSystem();

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
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

    it("Should be able to write", function (done) {
        FileSystem.write("blah", null).then(function (value: boolean) {
            expect(value).to.equal(true);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Should not be able to check", function (done) {
        FileSystem.check("blah").then(function (value: boolean) {
            expect(value).to.equal(false);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });


});
