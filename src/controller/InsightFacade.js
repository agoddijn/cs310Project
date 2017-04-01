"use strict";
var Util_1 = require("../Util");
var ZipParser_1 = require("./ZipParser");
var FileSystem_1 = require("./FileSystem");
var QueryGenerator_1 = require("./QueryGenerator");
var util_1 = require("util");
var Scheduler_1 = require("./Scheduler");
var fs = require("fs");
var InsightFacade = (function () {
    function InsightFacade() {
        Util_1.Log.trace('InsightFacadeImpl::init()');
    }
    InsightFacade.prototype.addDataset = function (id, content) {
        var parser = new ZipParser_1.default();
        return new Promise(function (fulfill, reject) {
            if (util_1.isNullOrUndefined(id) || util_1.isNullOrUndefined(content)) {
                Util_1.Log.error("Error in InsightFacade.addDataset() [null or undefined]");
                reject({ code: 400, body: { error: "id or content is null or undefined" } });
            }
            parser.parse(content, id).then(function (data) {
                FileSystem_1.default.check(id).then(function (success) {
                    var code;
                    if (success)
                        code = 201;
                    else
                        code = 204;
                    FileSystem_1.default.write(id, data).then(function (success) {
                        if (success) {
                            Util_1.Log.info("Data successfully cached");
                            fulfill({ code: code, body: { message: "Data successfully added" } });
                        }
                        else {
                            Util_1.Log.info("Data unsuccessfully cached");
                            reject({ code: 400, body: { error: "Data unsuccessfully cached" } });
                        }
                    }).catch(function (err) {
                        Util_1.Log.error("Error in InsightFacade.addDataset() [FileSystem.write()]");
                        Util_1.Log.error(err);
                        reject({ code: 400, body: { error: "Could not write file to memory" } });
                    });
                }).catch(function (err) {
                    Util_1.Log.error("Error in InsightFacade.addDataset() [FileSystem.check()]");
                    Util_1.Log.error(err);
                    reject({ code: 400, body: { error: "Could not access memory" } });
                });
            }).catch(function (err) {
                Util_1.Log.error("Error in InsightFacade.addDataset() [zipParser.parse()]");
                Util_1.Log.error(err);
                reject({ code: 400, body: { error: err.message } });
            });
        });
    };
    ;
    InsightFacade.prototype.removeDataset = function (id) {
        return new Promise(function (fulfill, reject) {
            FileSystem_1.default.remove(id).then(function (success) {
                if (success) {
                    Util_1.Log.info("Data successfully removed");
                    fulfill({ code: 204, body: {} });
                }
                else {
                    Util_1.Log.error("Data could not be removed");
                    reject({ code: 404, body: {} });
                }
            }).catch(function (err) {
                Util_1.Log.error("Error in removeDataset");
                Util_1.Log.error(err);
                reject({ code: 404, body: { error: err.message } });
            });
        });
    };
    ;
    InsightFacade.prototype.performQuery = function (query) {
        var QGen = new QueryGenerator_1.default();
        return new Promise(function (fulfill, reject) {
            QGen.checkQuery(query).then(function (id) {
                FileSystem_1.default.read(id).then(function (data) {
                    QGen.filter(data, query).then(function (filtered) {
                        fulfill({ code: 200, body: { render: 'TABLE', result: filtered } });
                    }).catch(function (err) {
                        Util_1.Log.error(err.message);
                        reject({ code: 400, body: { error: err.message } });
                    });
                }).catch(function (err) {
                    Util_1.Log.error(err.message);
                    reject({ code: 400, body: { error: "Could not read file" } });
                });
            }).catch(function (err) {
                Util_1.Log.error(JSON.stringify(err));
                reject(err);
            });
        });
    };
    ;
    InsightFacade.prototype.performSchedule = function (courseQuery, roomQuery) {
        var vm = this;
        var scheduler = new Scheduler_1.default();
        return new Promise(function (fulfill, reject) {
            vm.performQuery(courseQuery).then(function (response) {
                var courses = response.body["result"];
                vm.performQuery(roomQuery).then(function (response) {
                    var rooms = response.body["result"];
                    var res = scheduler.validateScheduleQueries(courseQuery, roomQuery);
                    if (res[0]) {
                        scheduler.getInfoCourses(courses).then(function (coursesInfo) {
                            scheduler.schedule(coursesInfo, rooms).then(function (schedule) {
                                if (!(Object.keys(schedule[0]).length == 0)) {
                                    fulfill({ code: 200,
                                        body: {
                                            schedule: schedule[0],
                                            unscheduled: schedule[1],
                                            peopleScheduled: schedule[2],
                                            peopleUnscheduled: schedule[3]
                                        } });
                                }
                                else {
                                    reject({ code: 400,
                                        body: {
                                            error: "Could not find schedule with given constraints"
                                        }
                                    });
                                }
                            }).catch(function (err) {
                                Util_1.Log.error(JSON.stringify(err));
                                reject({ code: 400,
                                    body: {
                                        error: "Uh oh! something went wrong",
                                        additional: err
                                    }
                                });
                            });
                        }).catch(function (err) {
                            Util_1.Log.error(JSON.stringify(err));
                            reject({ code: 400,
                                body: {
                                    error: "Uh oh! something went wrong",
                                    additional: err
                                }
                            });
                        });
                    }
                    else {
                        reject({ code: 400, body: { error: res[1] } });
                    }
                }).catch(function (err) {
                    Util_1.Log.error(JSON.stringify(err));
                    reject(err);
                });
            }).catch(function (err) {
                Util_1.Log.error(JSON.stringify(err));
                reject(err);
            });
        });
    };
    return InsightFacade;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsightFacade;
;
//# sourceMappingURL=InsightFacade.js.map