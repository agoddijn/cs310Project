/**
 * Created by alexgoddijn on 28/02/2017.
 */

import {Log} from '../Util';
import InsightFacade from '../controller/InsightFacade';
import {InsightResponse} from '../controller/IInsightFacade';
import restify = require('restify');

export default class Router {

    public static addDataset(req: restify.Request, res: restify.Response, next: restify.Next): any {
        var isf = new InsightFacade();
        if (req.params.body) {
            let dataStr = new Buffer(req.params.body).toString('base64');
            Log.info("Adding dataset " + req.params.id);
            isf.addDataset(req.params.id, dataStr).then(function (response: InsightResponse) {
                res.json(response.code, response.body);
                return next();
            }).catch(function (err: InsightResponse) {
                res.json(err.code, err.body);
                return next();
            });
        } else {
            res.json({code: 400, body: {error: "No data given"}});
            return next();
        }
    }

    public static removeDataset(req: restify.Request, res: restify.Response, next: restify.Next): any {
        var isf = new InsightFacade();
        if (req.params.id) {
            Log.info("Removing dataset " + req.params.id);
            isf.removeDataset(req.params.id).then(function(response: InsightResponse) {
                res.json(response.code, response.body);
                return next();
            }).catch(function(err: InsightResponse) {
                res.json(err.code, err.body);
                return next();
            });
        } else {
            res.json({code: 404, body: {error: "id given"}});
            return next();
        }
    }

    public static performQuery(req: restify.Request, res: restify.Response, next: restify.Next): any {
        var isf = new InsightFacade();
        if (req.body) {
            Log.info("Querying dataset " + req.body);
            isf.performQuery(req.body).then(function(response: InsightResponse) {
                res.json(response.code, response.body);
                return next();
            }).catch(function(err: InsightResponse) {
                res.json(err.code, err.body);
                return next();
            });
        } else {

        }

    }

    public static performSchedule(req: restify.Request, res: restify.Response, next: restify.Next): any {
        var isf = new InsightFacade();
        if (req.body) {
            Log.info("Performing scheduling");
            isf.performSchedule(req.body.courses, req.body.rooms).then(function(response: InsightResponse) {
                res.json(response.code, response.body);
                return next();
            }).catch(function(err: InsightResponse) {
                res.json(err.code, err.body);
                return next();
            });
        }
    }

}