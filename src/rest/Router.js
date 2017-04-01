"use strict";
var Util_1 = require("../Util");
var InsightFacade_1 = require("../controller/InsightFacade");
var Router = (function () {
    function Router() {
    }
    Router.addDataset = function (req, res, next) {
        var isf = new InsightFacade_1.default();
        if (req.params.body) {
            var dataStr = new Buffer(req.params.body).toString('base64');
            Util_1.Log.info("Adding dataset " + req.params.id);
            isf.addDataset(req.params.id, dataStr).then(function (response) {
                res.json(response.code, response.body);
                return next();
            }).catch(function (err) {
                res.json(err.code, err.body);
                return next();
            });
        }
        else {
            res.json({ code: 400, body: { error: "No data given" } });
            return next();
        }
    };
    Router.removeDataset = function (req, res, next) {
        var isf = new InsightFacade_1.default();
        if (req.params.id) {
            Util_1.Log.info("Removing dataset " + req.params.id);
            isf.removeDataset(req.params.id).then(function (response) {
                res.json(response.code, response.body);
                return next();
            }).catch(function (err) {
                res.json(err.code, err.body);
                return next();
            });
        }
        else {
            res.json({ code: 404, body: { error: "id given" } });
            return next();
        }
    };
    Router.performQuery = function (req, res, next) {
        var isf = new InsightFacade_1.default();
        if (req.body) {
            Util_1.Log.info("Querying dataset " + req.body);
            isf.performQuery(req.body).then(function (response) {
                res.json(response.code, response.body);
                return next();
            }).catch(function (err) {
                res.json(err.code, err.body);
                return next();
            });
        }
        else {
        }
    };
    Router.performSchedule = function (req, res, next) {
        var isf = new InsightFacade_1.default();
        if (req.body) {
            Util_1.Log.info("Performing scheduling");
            isf.performSchedule(req.body.courses, req.body.rooms).then(function (response) {
                res.json(response.code, response.body);
                return next();
            }).catch(function (err) {
                res.json(err.code, err.body);
                return next();
            });
        }
    };
    return Router;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Router;
//# sourceMappingURL=Router.js.map