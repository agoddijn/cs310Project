/**
 * Created by alexgoddijn on 22/01/2017.
 */
/**
 * Created by Alex Goddijn on 2017-01-20.
 */

import InsightFacade from "../src/controller/InsightFacade";
import {Log} from "../src/Util";
import {expect} from 'chai';
import {InsightResponse, Course, Room} from "../src/controller/IInsightFacade";
import FileSystem from "../src/controller/FileSystem";
var fs: any = require("fs");
var testPath = "./test/data/";

describe("AddDatasetPassingSpec", function () {

    var isf: InsightFacade = new InsightFacade();

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    function courseCheck(response: Course, id: string) {
        expect(response).to.have.property(id + "_dept");
        expect(response[id + "_dept"]).to.be.a('string');
        expect(response).to.have.property(id + "_id");
        expect(response[id + "_id"]).to.be.a('string');
        expect(response).to.have.property(id + "_avg");
        expect(response[id + "_avg"]).to.be.a('number');
        expect(response).to.have.property(id + "_instructor");
        expect(response[id + "_instructor"]).to.be.a('string');
        expect(response).to.have.property(id + "_title");
        expect(response[id + "_title"]).to.be.a('string');
        expect(response).to.have.property(id + "_pass");
        expect(response[id + "_pass"]).to.be.a('number');
        expect(response).to.have.property(id + "_fail");
        expect(response[id + "_fail"]).to.be.a('number');
        expect(response).to.have.property(id + "_audit");
        expect(response[id + "_audit"]).to.be.a('number');
        expect(response).to.have.property(id + "_year");
        expect(response[id + "_year"]).to.be.a('number');
    }

    function roomCheck(response: Room, id: string) {
        expect(response).to.have.property(id + "_fullname");
        expect(response[id + "_fullname"]).to.be.a('string');
        expect(response).to.have.property(id + "_shortname");
        expect(response[id + "_shortname"]).to.be.a('string');
        expect(response).to.have.property(id + "_number");
        expect(response[id + "_number"]).to.be.a('string');
        expect(response).to.have.property(id + "_name");
        expect(response[id + "_name"]).to.be.a('string');
        expect(response).to.have.property(id + "_address");
        expect(response[id + "_address"]).to.be.a('string');
        expect(response).to.have.property(id + "_lat");
        expect(response[id + "_lat"]).to.be.a('number');
        expect(response).to.have.property(id + "_lon");
        expect(response[id + "_lon"]).to.be.a('number');
        expect(response).to.have.property(id + "_seats");
        expect(response[id + "_seats"]).to.be.a('number');
        expect(response).to.have.property(id + "_type");
        expect(response[id + "_type"]).to.be.a('string');
        expect(response).to.have.property(id + "_furniture");
        expect(response[id + "_furniture"]).to.be.a('string');
        expect(response).to.have.property(id + "_href");
        expect(response[id + "_href"]).to.be.a('string');
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

    it("It should parse and cache a big zip file of courses", function (done) {
        this.timeout(300000);
        var filename = "courses";
        var pathToFile: string = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        isf.addDataset(filename, zipData).then(function (res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(204);
            FileSystem.read(filename).then(function (data1: Course[]) {

                expect(data1.length).to.equal(64612);
                courseCheck(data1[0], filename);

                isf.addDataset(filename, zipData).then(function (res: InsightResponse) {
                    Log.test(JSON.stringify(res));
                    sanityCheck(res);
                    expect(res.code).to.equal(201);

                    FileSystem.read(filename).then(function (data2: Course[]) {

                        expect(data2.length).to.equal(64612);
                        courseCheck(data2[0], filename);

                        isf.removeDataset(filename).then(function (res: InsightResponse) {
                            Log.test(JSON.stringify(res));
                            FileSystem.check(filename).then(function(exists) {
                                expect(exists).to.equal(false);
                                done();

                            }).catch(function (err: any) {
                                Log.test(JSON.stringify(err));
                                done(err);
                            });


                        }).catch(function (err: any) {
                            Log.test(JSON.stringify(err));
                            done(err);
                        });

                    }).catch(function (err: any) {
                        Log.test(JSON.stringify(err));
                        done(err);
                    });

                }).catch(function (err: any) {
                    Log.test(JSON.stringify(err));
                    done(err);
                });

            }).catch(function (err: any) {
                Log.test(JSON.stringify(err));
                done(err);
            });

        }).catch(function (err: any) {
            Log.test(JSON.stringify(err));
            done(err);
        });
    });

    it("It should parse and cache a big zip file of rooms", function (done) {
        this.timeout(300000);
        var filename = "rooms";
        var pathToFile: string = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        isf.addDataset(filename, zipData).then(function (res: InsightResponse) {

            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(204);
            FileSystem.read(filename).then(function (data1: Room[]) {

                expect(data1.length).to.equal(364);
                roomCheck(data1[0], filename);

                isf.addDataset(filename, zipData).then(function (res: InsightResponse) {
                    Log.test(JSON.stringify(res));
                    sanityCheck(res);
                    expect(res.code).to.equal(201);

                    FileSystem.read(filename).then(function (data2: Course[]) {

                        expect(data2.length).to.equal(364);
                        roomCheck(data2[0], filename);

                        isf.removeDataset(filename).then(function (res: InsightResponse) {
                            Log.test(JSON.stringify(res));
                            FileSystem.check(filename).then(function(exists) {
                                expect(exists).to.equal(false);
                                done();

                            }).catch(function (err: any) {
                                Log.test(JSON.stringify(err));
                                done(err);
                            });


                        }).catch(function (err: any) {
                            Log.test(JSON.stringify(err));
                            done(err);
                        });

                    }).catch(function (err: any) {
                        Log.test(JSON.stringify(err));
                        done(err);
                    });

                }).catch(function (err: any) {
                    Log.test(JSON.stringify(err));
                    done(err);
                });

            }).catch(function (err: any) {
                Log.test(JSON.stringify(err));
                done(err);
            });

        }).catch(function (err: any) {
            Log.test(JSON.stringify(err));
            done(err);
        });
    });

});
