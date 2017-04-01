/**
 * This is the REST entry point for the project.
 * Restify is configured here.
 */

import restify = require('restify');

import {Log} from "../Util";
import {InsightResponse} from "../controller/IInsightFacade";
import Router from './Router';
import InsightFacade from "../controller/InsightFacade";
var fs: any = require("fs");
var testPath = "./test/data/";

/**
 * This configures the REST endpoints for the server.
 */
export default class Server {

    private port: number;
    private rest: restify.Server;

    constructor(port: number) {
        Log.info("Server::<init>( " + port + " )");
        this.port = port;
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        Log.info('Server::close()');
        let that = this;
        return new Promise(function (fulfill) {

            Log.info('Removing Cache');

            var cachePath = './cache';
            if( fs.existsSync(cachePath) ) {
                fs.readdirSync(cachePath).forEach(function(file: any,index: any){
                    var curPath = cachePath + "/" + file;
                    fs.unlinkSync(curPath);
                });
                fs.rmdirSync(cachePath);
            }

            that.rest.close(function () {
                fulfill(true);
            });

        });
    }

    /**
     * Starts the server. Returns a promise with a boolean value. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<boolean>}
     */
    public start(): Promise<boolean> {
        let that = this;
        let insightFacade = new InsightFacade();
        return new Promise(function (fulfill, reject) {
            try {
                Log.info('Server::start() - start');

                Log.info('Adding data');
                let dataCourses = fs.readFileSync(testPath + "courses.zip");
                let dataRooms = fs.readFileSync(testPath + "rooms.zip");
                insightFacade.addDataset("courses", dataCourses).then(function(res: InsightResponse) {
                    insightFacade.addDataset("rooms", dataRooms).then(function(res: InsightResponse) {

                        that.rest = restify.createServer({
                            name: 'insightUBC'
                        });

                        that.rest.use(restify.bodyParser({mapParams: true, mapFiles: true}));

                        // Serve index page and static files
                        that.rest.get(/.*/, restify.serveStatic({
                            'directory': __dirname + '/client',
                            'default': 'index.html'
                        }));

                        // provides the echo service
                        // curl -is  http://localhost:4321/echo/myMessage
                        that.rest.get('/echo/:msg', Server.echo);

                        // Other endpoints will go here

                        that.rest.del('/dataset/:id', Router.removeDataset);

                        that.rest.put('/dataset/:id', Router.addDataset);

                        that.rest.post('/query', Router.performQuery);

                        that.rest.post('/schedule', Router.performSchedule);

                        that.rest.listen(that.port, function () {
                            Log.info('Server::start() - restify listening: ' + that.rest.url);
                            fulfill(true);
                        });

                        that.rest.on('error', function (err: string) {
                            // catches errors in restify start; unusual syntax due to internal node not using normal exceptions here
                            Log.info('Server::start() - restify ERROR: ' + err);
                            reject(err);
                        });

                    }).catch(function(err: any) {
            Log.error('Server::start() - ERROR: ' + err);
            reject(err);
        });
    }).catch(function(err: any) {
        Log.error('Server::start() - ERROR: ' + err);
        reject(err);
    });

            } catch (err) {
                Log.error('Server::start() - ERROR: ' + err);
                reject(err);
            }
        });
    }

    // The next two methods handle the echo service.
    // These are almost certainly not the best place to put these, but are here for your reference.
    // By updating the Server.echo function pointer above, these methods can be easily moved.

    public static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::echo(..) - params: ' + JSON.stringify(req.params));
        try {
            let result = Server.performEcho(req.params.msg);
            Log.info('Server::echo(..) - responding ' + result.code);
            res.json(result.code, result.body);
        } catch (err) {
            Log.error('Server::echo(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static performEcho(msg: string): InsightResponse {
        if (typeof msg !== 'undefined' && msg !== null) {
            return {code: 200, body: {message: msg + '...' + msg}};
        } else {
            return {code: 400, body: {error: 'Message not provided'}};
        }
    }

}
