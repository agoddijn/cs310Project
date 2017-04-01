/**
 * Created by alexgoddijn on 22/03/2017.
 */

import {IScheduler, ScheduleBlock, Time, RoomSchedule} from "./IScheduler";
import {Log} from "../Util";
import QueryGenerator from "./QueryGenerator"
import {QueryRequest} from "./IInsightFacade";

export default class Scheduler implements IScheduler {

    QGen: QueryGenerator;
    scheduleList: any;
    couldNotSchedule: Array<any>;
    roomSchedule: any;

    constructor() {
        Log.trace("Scheduler::init()");
        this.QGen = new QueryGenerator();
        this.scheduleList = {};
        this.couldNotSchedule = new Array();
        this.roomSchedule = {};
    }



    public getInfoCourses(courses: Array<any>): Promise<Array<any>> {

        let vm = this;

        return new Promise(function(fulfill, reject) {

            vm.getSize(courses).then(function(sizes: Array<number>) {

                vm.getSectionNum(courses).then(function(groupedSections: Array<any>) {

                    for (let i = 0; i < groupedSections.length; i++) {
                        let count = groupedSections[i]["sectionCount"];
                        count = Math.ceil(count/3);
                        groupedSections[i]["sectionCount"] = count;
                        let course = groupedSections[i];
                        course["size"] = sizes[i];

                    }

                    let expandedSections = vm.expandSections(groupedSections);

                    fulfill(expandedSections);

                }).catch(function(err: any) {
                    Log.error(JSON.stringify(err));
                    reject(err);
                })

            }).catch(function(err: any) {
                Log.error(JSON.stringify(err));
                reject(err);
            })

        })
    }

    /*
     * <---------------------- GetInfoCourses helper functions ----------------------------->
     */

    /**
     * Get the size the course (number of pass + fail students in largest section that is not overall section)
     *
     * @param courses
     */
    public getSize(courses: Array<any>): Promise<Array<number>> {

        let vm = this;

        let filterOverall = {
            "WHERE": {
                "NOT" : {
                    "EQ": {
                        "courses_year": 1900
                    }
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_pass",
                    "courses_fail"
                ],
                "FORM": "TABLE"
            }
        };

        return new Promise(function(fulfill, reject) {
            vm.QGen.filter(courses, filterOverall).then(function(data: Array<any>) {
                let toReturn: Array<number> = new Array();
                let max: number = 0;
                let curDept: string = "";
                let curId: string = "";
                for (let course of data) {
                    if (curDept === "") {
                        curDept = course["courses_dept"];
                        curId = course["courses_id"];
                    }
                    if (course["courses_dept"] !== curDept || course["courses_id"] !== curId) {
                        toReturn.push(max);
                        curDept = course["courses_dept"];
                        curId = course["courses_id"];
                        max = 0;
                    } else {
                        let cur = course["courses_pass"] + course["courses_fail"];
                        if (cur > max) max = cur;
                    }
                }

                toReturn.push(max);

                fulfill(toReturn);

            }).catch(function(err: any) {
                reject(err);
            });
        });
    }

    /**
     * Get the number of sections for course
     *
     * @param courses
     */
    public getSectionNum(courses: Array<any>): Promise<Array<any>> {

        let vm = this;

        let filter2014 = {
            "WHERE": {
                "EQ": {
                    "courses_year": 2014
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_uuid"
                ],
                "FORM": "TABLE"
            }
        };

        let groupSections = {
            "WHERE": {
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "sectionCount"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": [
                        "courses_dept",
                        "courses_id"
                    ]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_dept",
                    "courses_id"
                ],
                "APPLY": [{
                    "sectionCount": {
                        "COUNT": "courses_uuid"
                    }
                }]
            }
        };

        return new Promise(function(fulfill, reject) {

            vm.QGen.filter(courses, filter2014).then(function(data: Array<any>) {

                vm.QGen.filter(data, groupSections).then(function(grouped: Array<any>) {

                    fulfill(grouped);

                }).catch(function(err: any) {
                    Log.error(JSON.stringify(err));
                    reject(err);
                })

            }).catch(function(err: any) {
                Log.error(JSON.stringify(err));
                reject(err);
            })

        })
    }

    /**
     * Expand the sections into appropriate sections with increasing section number
     *
     * @param courses
     */
    public expandSections(groupedSections: Array<any>): Array<any> {

        let toReturn: Array<any> = new Array();

        for (let section of groupedSections) {
            let sectionCount = section["sectionCount"];
            for (let i = 0; i < sectionCount; i++) {
                let newSection = JSON.parse(JSON.stringify(section));
                newSection["section_num"] = i;
                delete newSection["sectionCount"];
                toReturn.push(newSection);
            }
        }

        return toReturn;

    }

    /*
     * <---------------------- END GetInfoCourses helper functions ----------------------------->
     */

    public schedule(courses: Array<any>, rooms: Array<any>): Promise<[any, any, number, number]> {

        let vm = this;

        let sortBySize = {
            "ORDER": {
                "dir": "DOWN",
                "keys": [
                    "size"
                ]
            }
        };

        let peopleScheduled = 0;
        let peopleUnscheduled = 0;

        return new Promise(function(fulfill, reject) {

            vm.QGen.sort(courses, sortBySize).then(function(sorted: Array<any>) {

                vm.initialiseRoomSchedule(rooms);

                let moreCourses: boolean = true;

                for (let i = 0; i < rooms.length && moreCourses; i++) {
                    let room = rooms[i];
                    let roomDone: boolean = false;
                    while(!roomDone) {
                        // Note: This method modifies the courses array by removing courseToSchedule
                        let courseToSchedule = vm.getLargestSectionThatFits(sorted, room["rooms_seats"]);
                        if (!courseToSchedule) { // No more courses left
                            roomDone = true;
                            moreCourses = false;
                            break;
                        }
                        let scheduled: boolean = false;
                        let nth = 0;
                        while (!scheduled) {
                            let first = vm.getAvailableTime(room, nth);
                            if (first == null && nth == 0) { // Case where room can no longer be scheduled (go to next room)
                                scheduled = true;
                                roomDone = true;
                            } else if (first == null) { // Case where there is conflicts for this section (check next room)
                                if (rooms[i + 1]["rooms_size"] > courseToSchedule["size"]) { // try next room
                                    room = rooms[i + 1];
                                    nth = 0;
                                } else { // Can't schedule
                                    vm.couldNotSchedule.push(courseToSchedule);
                                    scheduled = true;
                                }
                            } else { // Case where there is room for scheduling for this room
                                let scheduleProp: ScheduleBlock = vm.scheduleCourse(courseToSchedule, room, first);
                                if (!vm.checkSectionConflict(scheduleProp)) { // Course was succesffully scheduled
                                    vm.blockRoom(room, first);
                                    vm.updateSchedule(scheduleProp);
                                    scheduled = true;
                                    peopleScheduled += courseToSchedule["size"];
                                } else {
                                    nth++;
                                }
                            }
                        }
                    }
                }

                peopleUnscheduled = vm.calculateUnscheduled(courses);

                Log.info("People Scheduled: " + peopleScheduled);
                Log.info("People Unscheduled: " + peopleUnscheduled);
                Log.info("Heuristic: " + (peopleScheduled/(peopleScheduled+peopleUnscheduled)));

                let toReturn: Array<ScheduleBlock> = vm.getTranslatedSchedule();

                fulfill([toReturn, vm.couldNotSchedule, peopleScheduled, peopleUnscheduled]);

            }).catch(function(err: any) {
                Log.error(JSON.stringify(err));
                reject(err);
            })

        })

    }

    /*
     * <---------------------- Schedule helper functions ----------------------------->
     */

    /**
     * Calculate number of people that could nto be scheduled
     *
     * @param courses Anyone left in courses is unscheduled
     * @returns {number}
     */
    public calculateUnscheduled(courses: any): number {

        let vm = this;

        let numUnscheduled = 0;

        for (let unscheduled of vm.couldNotSchedule) {
            numUnscheduled += unscheduled["size"];
        }
        for (let unscheduled of courses) {
            vm.couldNotSchedule.push(unscheduled);
            numUnscheduled += unscheduled["size"];
        }

        return numUnscheduled;

    }

    /**
     * Create an array of the schedule blocks from the schedulelist object
     *
     * @returns {Array<ScheduleBlock>}
     */
    public getTranslatedSchedule(): any {
        
        let vm = this;

        let toReturn: any = {};
        
        for (let key of Object.keys(vm.scheduleList)) {
            let courseDept = vm.scheduleList[key];
            for (let key2 of Object.keys(courseDept)) {
                let courseArray = courseDept[key2];
                for (let sched of courseArray) {
                    if (!toReturn[sched["room_shortname"]]) {
                        toReturn[sched["room_shortname"]] = {};
                    }
                    if (!toReturn[sched["room_shortname"]][sched["room_num"]]) {
                        toReturn[sched["room_shortname"]][sched["room_num"]] = new Array();
                    }
                    toReturn[sched["room_shortname"]][sched["room_num"]].push(sched);
                }
            }
        }

        for (let roomShort of Object.keys(toReturn)) {
            for (let roomNum of Object.keys(toReturn[roomShort])) {
                let list = toReturn[roomShort][roomNum];
                list.sort(function (a: any, b: any) {
                    let sorter: any = {
                        "mon": 1,
                        "tues": 2,
                        "wed": 3,
                        "thurs": 4,
                        "fri": 5
                    };
                    let toReturn = sorter[a["day"]] - sorter[b["day"]];
                    if (toReturn != 0) return toReturn;
                    return a["start_time"] - b["start_time"];
                })
            }
        }

        return toReturn;
        
    }

    /**
     * Update the schedule list with the given schedule proposition
     *
     * @param scheduleProp The proposed schedule
     */
    public updateSchedule(scheduleProp: ScheduleBlock): void {

        let vm = this;

        if (!vm.scheduleList[scheduleProp.course_dept]) {
            vm.scheduleList[scheduleProp.course_dept] = {};
            vm.scheduleList[scheduleProp.course_dept][scheduleProp.course_id] = new Array<ScheduleBlock>();
        } else if (!vm.scheduleList[scheduleProp.course_dept][scheduleProp.course_id]) {
            vm.scheduleList[scheduleProp.course_dept][scheduleProp.course_id] = new Array<ScheduleBlock>();
        }

        vm.scheduleList[scheduleProp.course_dept][scheduleProp.course_id].push(scheduleProp);

    }

    /**
     * Initializes the room schedule for all the rooms
     *
     * @param rooms
     */
    public initialiseRoomSchedule(rooms: Array<any>): void {

        let vm = this;

        let shortDays = ["mon", "wed", "fri"];
        let longDays = ["tues", "thurs"];
        let startTime = 8;
        let endTime = 17;
        let shortTime = 1;
        let longTime = 1.5;

        for (let room of rooms) {

            let scheduleBlock: RoomSchedule = {
                room_shortname: room["rooms_shortname"],
                room_num: room["rooms_number"],
                available: new Array(),
            };

            for (let shortDay of shortDays) {
                for (let i = startTime; i < endTime; i += shortTime) {

                    let timeBlock: Time = {
                        day: shortDay,
                        start_time: i,
                        end_time: i + shortTime
                    };

                    scheduleBlock.available.push(timeBlock);

                }
            }

            for (let longDay of longDays) {
                for (let i = startTime; i < endTime; i += longTime) {

                    let timeBlock: Time = {
                        day: longDay,
                        start_time: i,
                        end_time: i + longTime
                    };

                    scheduleBlock.available.push(timeBlock);

                }
            }

            if (!vm.roomSchedule[room["rooms_shortname"]]) {
                vm.roomSchedule[room["rooms_shortname"]] = {};
            }
            vm.roomSchedule[room["rooms_shortname"]][room["rooms_number"]] = scheduleBlock;
        }
    }

    /**
     * Get the first available time for a particular room
     *
     * @param room The room to check available times for
     * @param nth get the nth available time (0 based index)
     *
     * @return The first available time for that room or false if none exists
     */
    public getAvailableTime(room: any, nth: number): Time {

        let vm = this;

        let thisRoomSchedule: RoomSchedule = vm.roomSchedule[room["rooms_shortname"]][room["rooms_number"]];

        if(thisRoomSchedule.available.length > nth) {
            return thisRoomSchedule.available[nth];
        } else {
            return null;
        }

    }

    /**
     * Remove the specified time for the list of available times
     *
     * @param room The room to block
     * @param time The time to block it
     */
    public blockRoom(room: any, time: Time): void {

        let vm = this;

        let thisRoomSchedule: RoomSchedule = vm.roomSchedule[room["rooms_shortname"]][room["rooms_number"]];
        let index = thisRoomSchedule.available.indexOf(time);
        if (index > -1) {
            thisRoomSchedule.available.splice(index, 1);
        }

    }

    /**
     * Get the largest remaining course that fits into given capacity
     * Return format {course_dept, course_id}
     *
     * @param courses The list of remaining courses to be scheduled
     * @param capacity The capacity of the room to schedule section into
     *
     * @modifies courses by removing the course it returns
     */
    public getLargestSectionThatFits(courses: Array<any>, capacity: number): any {

        let vm = this;

        for(let i = 0; courses[i]; i++) {
            let course = courses[i];
            if (course["size"] <= capacity) {
                let toReturn = courses.splice(i,1)[0];
                return toReturn;
            } else {
                let unScheduled = courses.splice(i,1)[0];
                vm.couldNotSchedule.push(unScheduled);
                i--;
            }
        }

        return null;

    }

    /**
     * Check if attempted scheduling causes section conflict
     *
     * @param block The schedule block to be scheduled
     *
     * return true if there is a conflict, false otherwise
     */
    public checkSectionConflict(block: ScheduleBlock): boolean {

        let vm = this;

        if(vm.scheduleList[block.course_dept] && vm.scheduleList[block.course_dept][block.course_id]){

            let courseSchedule = vm.scheduleList[block.course_dept][block.course_id];

            for (let scheduledBlock of courseSchedule) {
                if (scheduledBlock.day == block.day &&
                    scheduledBlock.start_time == block.start_time) {
                    return true;
                }
            }

            return false;

        } else {

            return false;

        }

    }

    /**
     * Takes a course and a time and returns a ScheduleBlock for that combination
     *
     * @param course The course to schedule
     * @param time the time to schedule it into
     */
    public scheduleCourse(course: any, room: any, time: Time): ScheduleBlock {

        if (!course) {
            Log.error("Course is undefined?");
        }

        let toReturn: ScheduleBlock = {
            room_shortname: room["rooms_shortname"],
            room_num: room["rooms_number"],
            room_size: room["rooms_seats"],
            course_dept: course["courses_dept"],
            course_id: course["courses_id"],
            section_num: course["section_num"],
            section_size: course["size"],
            day: time.day,
            start_time: time.start_time,
            end_time: time.end_time
        };

        return toReturn;
    }

    /*
     * <---------------------- END Schedule helper functions ----------------------------->
     */

    public validateScheduleQueries(courseQuery: QueryRequest, roomQuery: QueryRequest): [boolean, string] {

        let vm = this;

        let res: [boolean, string];

        res = vm.checkCourseColumns(courseQuery["OPTIONS"]["COLUMNS"]);
        if (!res[0]) return res;

        res = vm.checkCourseOrder(courseQuery["OPTIONS"]["ORDER"]);
        if (!res[0]) return res;

        res = vm.checkRoomColumn(roomQuery["OPTIONS"]["COLUMNS"]);
        if (!res[0]) return res;

        res = vm.checkRoomOrder(roomQuery["OPTIONS"]["ORDER"]);
        if (!res[0]) return res;

        return [true, ""];

    }

    public checkCourseColumns(columns: Array<any>): [boolean, string] {
        let required: Array<string> = ["courses_dept", "courses_id", "courses_pass", "courses_fail", "courses_year", "courses_uuid"];

        for (let req of required) {
            if (columns.indexOf(req) < 0) return [false, "Missing " + req + " from columns"];
        }

        return [true, ""];
    }

    public checkCourseOrder(order: any): [boolean, string] {
        if (order["dir"] !== "UP") return [false, "Order direction for courses is wrong"];

        let required: Array<string> = ["courses_dept", "courses_id", "courses_year"];

        for (let i = 0; i < required.length; i++) {
            if (order["keys"][i] !== required[i]) return [false, "Order is incorrect"];
        }

        return [true, ""];

    }

    public checkRoomColumn(columns: Array<any>): [boolean, string] {
        let required: Array<string> = ["rooms_shortname", "rooms_number", "rooms_seats"];

        for (let req of required) {
            if (columns.indexOf(req) < 0) return [false, "Missing " + req  + " from columns"];
        }

        return [true, ""];
    }

    public checkRoomOrder(order: any): [boolean, string] {
        if (order["dir"] !== "DOWN") return [false, "Order direction for courses is wrong"];

        let required: Array<string> = ["rooms_seats", "rooms_shortname", "rooms_number"];

        for (let i = 0; i < required.length; i++) {
            if (order["keys"][i] !== required[i]) return [false, "Order is incorrect"];
        }

        return [true, ""];
    }

}
