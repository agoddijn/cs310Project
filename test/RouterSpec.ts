/**
 * Created by rtholmes on 2016-10-31.
 */


import {expect} from 'chai';
import {Log} from "../src/Util";
import Server from "../src/rest/Server";
import restify = require('restify');
import {Response} from "restify";


var fs: any = require("fs");
var testPath = "./test/data/";
var chai = require('chai');
var chaiHttp = require('chai-http');


describe("RouterSpec", function () {

    chai.use(chaiHttp);

    var port = 4321;
    var server: Server = new Server(port);

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
        return server.start().catch(function(err:any) {
            Log.test(err);
            expect.fail();
        });
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        return server.stop().catch(function(err:any) {
            expect.fail();
        });
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });


    it("Should be able to add", function () {
        this.timeout(10000);
        var filename = "courses";
        var pathToFile: string = testPath + filename + ".zip";
        return chai.request("http://localhost:" + port)
        .put("/dataset/" + filename)
        .attach("body", fs.readFileSync(pathToFile), "courses.zip")
        .then(function (res: Response) {
            Log.trace('then:');
            Log.test(JSON.stringify(res));
            expect(res.status).to.equal(204);
        })
        .catch(function (err: any) {
            Log.trace('catch:');
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("Should be able to query", function () {
        let queryRequest = require("./data/simpleEQquery.json");
        let objBody = require("./data/simpleEQbody.json");
        return chai.request("http://localhost:" + port)
        .post('/query')
        .send(queryRequest)
        .then(function (res: any) {
            Log.trace('then:');
            Log.test(JSON.stringify(res));
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(objBody);
        })
        .catch(function (err: any) {
            Log.trace('catch:');
            Log.test(JSON.stringify(err.response.status));
            Log.test(JSON.stringify(err.response.text));
            expect.fail();
        });
    });

    it("Should be able to remove", function () {
        var filename = "courses";
        return chai.request("http://localhost:" + port)
        .delete('/dataset/' + filename)
        .then(function (res: any) {
            Log.trace('then:');
            Log.test(JSON.stringify(res));
            expect(res.status).to.equal(204);
        })
        .catch(function (err: any) {
            Log.trace('catch:');
            Log.test(JSON.stringify(err.response.status));
            Log.test(JSON.stringify(err.response.text));
            expect.fail();
        });
    });

    it("Should not be able to remove", function () {
        var filename = "rooms";
        return chai.request("http://localhost:" + port)
        .delete('/dataset/' + filename)
        .then(function (res: any) {
            Log.test(JSON.stringify(res));
            expect.fail();
        })
        .catch(function (err: any) {
            Log.trace('catch:');
            Log.test(JSON.stringify(err.response.status));
            Log.test(JSON.stringify(err.response.text));
            expect(err.status).to.equal(404);
        }).catch(function (err: any) {
            Log.trace('catch2:');
            expect.fail();
        });
    });

});
