
/**
 * This is the main programmatic entry point for the project.
 */

import {IInsightFacade, InsightResponse, QueryRequest, Course, Room} from "./IInsightFacade";

import {Log} from "../Util";
import ZipParser from "./ZipParser";
import FileSystem from "./FileSystem";
import QueryGenerator from "./QueryGenerator";
import {isNullOrUndefined} from "util";
import Scheduler from "./Scheduler";
import {ScheduleBlock} from "./IScheduler";

var fs = require("fs");

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    public addDataset(id: string, content: string): Promise<InsightResponse> {
        var parser = new ZipParser();
        return new Promise(function(fulfill, reject) {

            if(isNullOrUndefined(id) || isNullOrUndefined(content)) {
                Log.error("Error in InsightFacade.addDataset() [null or undefined]");
                reject({code: 400, body: {error: "id or content is null or undefined"}});
            }

            parser.parse(content, id).then(function (data: Course[] | Room[]) {

                FileSystem.check(id).then(function(success: boolean) {
                    var code: number;
                    if(success) code = 201;
                    else code = 204;

                    FileSystem.write(id, data).then(function(success: boolean) {
                        if (success) {
                            Log.info("Data successfully cached");
                            fulfill({code: code, body: {message: "Data successfully added"}});
                        } else {
                            Log.info("Data unsuccessfully cached");
                            reject({code: 400, body: {error: "Data unsuccessfully cached"}});
                        }
                    }).catch(function(err: any) {
                        Log.error("Error in InsightFacade.addDataset() [FileSystem.write()]");
                        Log.error(err);
                        reject({code: 400, body: {error: "Could not write file to memory"}});
                    });

                }).catch(function(err: any) {
                    Log.error("Error in InsightFacade.addDataset() [FileSystem.check()]");
                    Log.error(err);
                    reject({code: 400, body: {error: "Could not access memory"}});
                });

            }).catch(function (err: any) {
                Log.error("Error in InsightFacade.addDataset() [zipParser.parse()]");
                Log.error(err);
                reject({code: 400, body: {error: err.message}});
            });
        });
    };


    public removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function(fulfill, reject) {
            FileSystem.remove(id).then(function(success: boolean) {
                if (success) {
                    Log.info("Data successfully removed");
                    fulfill({code: 204, body: {}});
                } else {
                    Log.error("Data could not be removed");
                    reject({code: 404, body: {}});
                }
            }).catch(function(err: any) {
                Log.error("Error in removeDataset");
                Log.error(err);
                reject({code: 404, body: {error: err.message}});
            });
        });
    };

    public performQuery(query: QueryRequest): Promise <InsightResponse> {
        var QGen : QueryGenerator = new QueryGenerator();
        return new Promise(function(fulfill, reject) {
            QGen.checkQuery(query).then(function(id: string) {

                FileSystem.read(id).then(function(data: Course[] | Room[]) {

                    QGen.filter(data, query).then(function(filtered: Array<{}>) {
                        fulfill({code: 200, body: {render: 'TABLE', result: filtered}});

                    }).catch(function(err: any) {
                        Log.error(err.message);
                        reject({code: 400, body: {error: err.message}});
                    });

                }).catch(function(err: any) {
                    Log.error(err.message);
                    reject({code: 400, body: {error: "Could not read file"}});
                });

            }).catch(function(err: InsightResponse) {
                Log.error(JSON.stringify(err));
                reject(err);
            })
        });
    };

    public performSchedule(courseQuery: QueryRequest, roomQuery: QueryRequest): Promise <InsightResponse> {
        let vm = this;
        let scheduler: Scheduler = new Scheduler();
        return new Promise(function(fulfill, reject) {
            vm.performQuery(courseQuery).then(function(response: any) {
                let courses: any = response.body["result"];
                vm.performQuery(roomQuery).then(function(response: any) {
                    let rooms: any = response.body["result"];

                    let res: [boolean, string] = scheduler.validateScheduleQueries(courseQuery, roomQuery);

                    if (res[0]) {

                        scheduler.getInfoCourses(courses).then(function(coursesInfo: Array<any>) {

                            scheduler.schedule(coursesInfo, rooms).then(function(schedule: [any, any, number, number]) {

                                if(!(Object.keys(schedule[0]).length == 0)) {
                                    fulfill({code: 200,
                                        body: {
                                            schedule: schedule[0],
                                            unscheduled: schedule[1],
                                            peopleScheduled: schedule[2],
                                            peopleUnscheduled: schedule[3]
                                        }});
                                } else {
                                    reject({code: 400,
                                        body: {
                                            error: "Could not find schedule with given constraints"
                                        }
                                    });
                                }

                            }).catch(function(err: InsightResponse) {
                                Log.error(JSON.stringify(err));
                                reject({code: 400,
                                    body: {
                                        error: "Uh oh! something went wrong",
                                        additional: err
                                    }
                                });
                            })

                        }).catch(function(err: InsightResponse) {
                            Log.error(JSON.stringify(err));
                            reject({code: 400,
                                body: {
                                    error: "Uh oh! something went wrong",
                                    additional: err
                                }
                            });
                        })

                    } else {

                        reject({code: 400, body: {error: res[1]}});

                    }

                }).catch(function(err: InsightResponse) {
                    Log.error(JSON.stringify(err));
                    reject(err);
                })
            }).catch(function(err: InsightResponse) {
                Log.error(JSON.stringify(err));
                reject(err);
            });
        });
    }
};
