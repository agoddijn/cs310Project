"use strict";
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var Server_1 = require("../src/rest/Server");
var _debugger_1 = require("_debugger");
describe("EchoSpec", function () {
    var server = new Server_1.default(_debugger_1.port);
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
    });
    it("Should be able to start and stop", function (done) {
        server.start().then(function (value) {
            chai_1.expect(value).to.equal(true);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
        server.stop().then(function (value) {
            chai_1.expect(value).to.equal(true);
            done();
        }).catch(function (err) {
            Util_1.Log.test('Error:' + err);
            done(err);
        });
    });
    it("Should be able to echo", function () {
        var out = Server_1.default.performEcho('echo');
        Util_1.Log.test(JSON.stringify(out));
        sanityCheck(out);
        chai_1.expect(out.code).to.equal(200);
        chai_1.expect(out.body).to.deep.equal({ message: 'echo...echo' });
    });
    it("Should be able to echo silence", function () {
        var out = Server_1.default.performEcho('');
        Util_1.Log.test(JSON.stringify(out));
        sanityCheck(out);
        chai_1.expect(out.code).to.equal(200);
        chai_1.expect(out.body).to.deep.equal({ message: '...' });
    });
    it("Should be able to handle a missing echo message sensibly", function () {
        var out = Server_1.default.performEcho(undefined);
        Util_1.Log.test(JSON.stringify(out));
        sanityCheck(out);
        chai_1.expect(out.code).to.equal(400);
        chai_1.expect(out.body).to.deep.equal({ error: 'Message not provided' });
    });
    it("Should be able to handle a null echo message sensibly", function () {
        var out = Server_1.default.performEcho(null);
        Util_1.Log.test(JSON.stringify(out));
        sanityCheck(out);
        chai_1.expect(out.code).to.equal(400);
        chai_1.expect(out.body).to.have.property('error');
        chai_1.expect(out.body).to.deep.equal({ error: 'Message not provided' });
    });
});
//# sourceMappingURL=EchoSpec.js.map