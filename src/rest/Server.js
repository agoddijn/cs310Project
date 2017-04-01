"use strict";
var restify = require("restify");
var Util_1 = require("../Util");
var Router_1 = require("./Router");
var InsightFacade_1 = require("../controller/InsightFacade");
var fs = require("fs");
var testPath = "./test/data/";
var Server = (function () {
    function Server(port) {
        Util_1.Log.info("Server::<init>( " + port + " )");
        this.port = port;
    }
    Server.prototype.stop = function () {
        Util_1.Log.info('Server::close()');
        var that = this;
        return new Promise(function (fulfill) {
            Util_1.Log.info('Removing Cache');
            var cachePath = './cache';
            if (fs.existsSync(cachePath)) {
                fs.readdirSync(cachePath).forEach(function (file, index) {
                    var curPath = cachePath + "/" + file;
                    fs.unlinkSync(curPath);
                });
                fs.rmdirSync(cachePath);
            }
            that.rest.close(function () {
                fulfill(true);
            });
        });
    };
    Server.prototype.start = function () {
        var that = this;
        var insightFacade = new InsightFacade_1.default();
        return new Promise(function (fulfill, reject) {
            try {
                Util_1.Log.info('Server::start() - start');
                Util_1.Log.info('Adding data');
                var dataCourses = fs.readFileSync(testPath + "courses.zip");
                var dataRooms_1 = fs.readFileSync(testPath + "rooms.zip");
                insightFacade.addDataset("courses", dataCourses).then(function (res) {
                    insightFacade.addDataset("rooms", dataRooms_1).then(function (res) {
                        that.rest = restify.createServer({
                            name: 'insightUBC'
                        });
                        that.rest.use(restify.bodyParser({ mapParams: true, mapFiles: true }));
                        that.rest.get(/.*/, restify.serveStatic({
                            'directory': __dirname + '/client',
                            'default': 'index.html'
                        }));
                        that.rest.get('/echo/:msg', Server.echo);
                        that.rest.del('/dataset/:id', Router_1.default.removeDataset);
                        that.rest.put('/dataset/:id', Router_1.default.addDataset);
                        that.rest.post('/query', Router_1.default.performQuery);
                        that.rest.post('/schedule', Router_1.default.performSchedule);
                        that.rest.listen(that.port, function () {
                            Util_1.Log.info('Server::start() - restify listening: ' + that.rest.url);
                            fulfill(true);
                        });
                        that.rest.on('error', function (err) {
                            Util_1.Log.info('Server::start() - restify ERROR: ' + err);
                            reject(err);
                        });
                    }).catch(function (err) {
                        Util_1.Log.error('Server::start() - ERROR: ' + err);
                        reject(err);
                    });
                }).catch(function (err) {
                    Util_1.Log.error('Server::start() - ERROR: ' + err);
                    reject(err);
                });
            }
            catch (err) {
                Util_1.Log.error('Server::start() - ERROR: ' + err);
                reject(err);
            }
        });
    };
    Server.echo = function (req, res, next) {
        Util_1.Log.trace('Server::echo(..) - params: ' + JSON.stringify(req.params));
        try {
            var result = Server.performEcho(req.params.msg);
            Util_1.Log.info('Server::echo(..) - responding ' + result.code);
            res.json(result.code, result.body);
        }
        catch (err) {
            Util_1.Log.error('Server::echo(..) - responding 400');
            res.json(400, { error: err.message });
        }
        return next();
    };
    Server.performEcho = function (msg) {
        if (typeof msg !== 'undefined' && msg !== null) {
            return { code: 200, body: { message: msg + '...' + msg } };
        }
        else {
            return { code: 400, body: { error: 'Message not provided' } };
        }
    };
    return Server;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Server;
//# sourceMappingURL=Server.js.map