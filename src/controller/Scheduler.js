"use strict";
var Util_1 = require("../Util");
var QueryGenerator_1 = require("./QueryGenerator");
var Scheduler = (function () {
    function Scheduler() {
        Util_1.Log.trace("Scheduler::init()");
        this.QGen = new QueryGenerator_1.default();
        this.scheduleList = {};
        this.couldNotSchedule = new Array();
        this.roomSchedule = {};
    }
    Scheduler.prototype.getInfoCourses = function (courses) {
        var vm = this;
        return new Promise(function (fulfill, reject) {
            vm.getSize(courses).then(function (sizes) {
                vm.getSectionNum(courses).then(function (groupedSections) {
                    for (var i = 0; i < groupedSections.length; i++) {
                        var count = groupedSections[i]["sectionCount"];
                        count = Math.ceil(count / 3);
                        groupedSections[i]["sectionCount"] = count;
                        var course = groupedSections[i];
                        course["size"] = sizes[i];
                    }
                    var expandedSections = vm.expandSections(groupedSections);
                    fulfill(expandedSections);
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
    Scheduler.prototype.getSize = function (courses) {
        var vm = this;
        var filterOverall = {
            "WHERE": {
                "NOT": {
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
        return new Promise(function (fulfill, reject) {
            vm.QGen.filter(courses, filterOverall).then(function (data) {
                var toReturn = new Array();
                var max = 0;
                var curDept = "";
                var curId = "";
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var course = data_1[_i];
                    if (curDept === "") {
                        curDept = course["courses_dept"];
                        curId = course["courses_id"];
                    }
                    if (course["courses_dept"] !== curDept || course["courses_id"] !== curId) {
                        toReturn.push(max);
                        curDept = course["courses_dept"];
                        curId = course["courses_id"];
                        max = 0;
                    }
                    else {
                        var cur = course["courses_pass"] + course["courses_fail"];
                        if (cur > max)
                            max = cur;
                    }
                }
                toReturn.push(max);
                fulfill(toReturn);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    Scheduler.prototype.getSectionNum = function (courses) {
        var vm = this;
        var filter2014 = {
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
        var groupSections = {
            "WHERE": {},
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
        return new Promise(function (fulfill, reject) {
            vm.QGen.filter(courses, filter2014).then(function (data) {
                vm.QGen.filter(data, groupSections).then(function (grouped) {
                    fulfill(grouped);
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
    Scheduler.prototype.expandSections = function (groupedSections) {
        var toReturn = new Array();
        for (var _i = 0, groupedSections_1 = groupedSections; _i < groupedSections_1.length; _i++) {
            var section = groupedSections_1[_i];
            var sectionCount = section["sectionCount"];
            for (var i = 0; i < sectionCount; i++) {
                var newSection = JSON.parse(JSON.stringify(section));
                newSection["section_num"] = i;
                delete newSection["sectionCount"];
                toReturn.push(newSection);
            }
        }
        return toReturn;
    };
    Scheduler.prototype.schedule = function (courses, rooms) {
        var vm = this;
        var sortBySize = {
            "ORDER": {
                "dir": "DOWN",
                "keys": [
                    "size"
                ]
            }
        };
        var peopleScheduled = 0;
        var peopleUnscheduled = 0;
        return new Promise(function (fulfill, reject) {
            vm.QGen.sort(courses, sortBySize).then(function (sorted) {
                vm.initialiseRoomSchedule(rooms);
                var moreCourses = true;
                for (var i = 0; i < rooms.length && moreCourses; i++) {
                    var room = rooms[i];
                    var roomDone = false;
                    while (!roomDone) {
                        var courseToSchedule = vm.getLargestSectionThatFits(sorted, room["rooms_seats"]);
                        if (!courseToSchedule) {
                            roomDone = true;
                            moreCourses = false;
                            break;
                        }
                        var scheduled = false;
                        var nth = 0;
                        while (!scheduled) {
                            var first = vm.getAvailableTime(room, nth);
                            if (first == null && nth == 0) {
                                scheduled = true;
                                roomDone = true;
                            }
                            else if (first == null) {
                                if (rooms[i + 1]["rooms_size"] > courseToSchedule["size"]) {
                                    room = rooms[i + 1];
                                    nth = 0;
                                }
                                else {
                                    vm.couldNotSchedule.push(courseToSchedule);
                                    scheduled = true;
                                }
                            }
                            else {
                                var scheduleProp = vm.scheduleCourse(courseToSchedule, room, first);
                                if (!vm.checkSectionConflict(scheduleProp)) {
                                    vm.blockRoom(room, first);
                                    vm.updateSchedule(scheduleProp);
                                    scheduled = true;
                                    peopleScheduled += courseToSchedule["size"];
                                }
                                else {
                                    nth++;
                                }
                            }
                        }
                    }
                }
                peopleUnscheduled = vm.calculateUnscheduled(courses);
                Util_1.Log.info("People Scheduled: " + peopleScheduled);
                Util_1.Log.info("People Unscheduled: " + peopleUnscheduled);
                Util_1.Log.info("Heuristic: " + (peopleScheduled / (peopleScheduled + peopleUnscheduled)));
                var toReturn = vm.getTranslatedSchedule();
                fulfill([toReturn, vm.couldNotSchedule, peopleScheduled, peopleUnscheduled]);
            }).catch(function (err) {
                Util_1.Log.error(JSON.stringify(err));
                reject(err);
            });
        });
    };
    Scheduler.prototype.calculateUnscheduled = function (courses) {
        var vm = this;
        var numUnscheduled = 0;
        for (var _i = 0, _a = vm.couldNotSchedule; _i < _a.length; _i++) {
            var unscheduled = _a[_i];
            numUnscheduled += unscheduled["size"];
        }
        for (var _b = 0, courses_1 = courses; _b < courses_1.length; _b++) {
            var unscheduled = courses_1[_b];
            vm.couldNotSchedule.push(unscheduled);
            numUnscheduled += unscheduled["size"];
        }
        return numUnscheduled;
    };
    Scheduler.prototype.getTranslatedSchedule = function () {
        var vm = this;
        var toReturn = {};
        for (var _i = 0, _a = Object.keys(vm.scheduleList); _i < _a.length; _i++) {
            var key = _a[_i];
            var courseDept = vm.scheduleList[key];
            for (var _b = 0, _c = Object.keys(courseDept); _b < _c.length; _b++) {
                var key2 = _c[_b];
                var courseArray = courseDept[key2];
                for (var _d = 0, courseArray_1 = courseArray; _d < courseArray_1.length; _d++) {
                    var sched = courseArray_1[_d];
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
        for (var _e = 0, _f = Object.keys(toReturn); _e < _f.length; _e++) {
            var roomShort = _f[_e];
            for (var _g = 0, _h = Object.keys(toReturn[roomShort]); _g < _h.length; _g++) {
                var roomNum = _h[_g];
                var list = toReturn[roomShort][roomNum];
                list.sort(function (a, b) {
                    var sorter = {
                        "mon": 1,
                        "tues": 2,
                        "wed": 3,
                        "thurs": 4,
                        "fri": 5
                    };
                    var toReturn = sorter[a["day"]] - sorter[b["day"]];
                    if (toReturn != 0)
                        return toReturn;
                    return a["start_time"] - b["start_time"];
                });
            }
        }
        return toReturn;
    };
    Scheduler.prototype.updateSchedule = function (scheduleProp) {
        var vm = this;
        if (!vm.scheduleList[scheduleProp.course_dept]) {
            vm.scheduleList[scheduleProp.course_dept] = {};
            vm.scheduleList[scheduleProp.course_dept][scheduleProp.course_id] = new Array();
        }
        else if (!vm.scheduleList[scheduleProp.course_dept][scheduleProp.course_id]) {
            vm.scheduleList[scheduleProp.course_dept][scheduleProp.course_id] = new Array();
        }
        vm.scheduleList[scheduleProp.course_dept][scheduleProp.course_id].push(scheduleProp);
    };
    Scheduler.prototype.initialiseRoomSchedule = function (rooms) {
        var vm = this;
        var shortDays = ["mon", "wed", "fri"];
        var longDays = ["tues", "thurs"];
        var startTime = 8;
        var endTime = 17;
        var shortTime = 1;
        var longTime = 1.5;
        for (var _i = 0, rooms_1 = rooms; _i < rooms_1.length; _i++) {
            var room = rooms_1[_i];
            var scheduleBlock = {
                room_shortname: room["rooms_shortname"],
                room_num: room["rooms_number"],
                available: new Array(),
            };
            for (var _a = 0, shortDays_1 = shortDays; _a < shortDays_1.length; _a++) {
                var shortDay = shortDays_1[_a];
                for (var i = startTime; i < endTime; i += shortTime) {
                    var timeBlock = {
                        day: shortDay,
                        start_time: i,
                        end_time: i + shortTime
                    };
                    scheduleBlock.available.push(timeBlock);
                }
            }
            for (var _b = 0, longDays_1 = longDays; _b < longDays_1.length; _b++) {
                var longDay = longDays_1[_b];
                for (var i = startTime; i < endTime; i += longTime) {
                    var timeBlock = {
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
    };
    Scheduler.prototype.getAvailableTime = function (room, nth) {
        var vm = this;
        var thisRoomSchedule = vm.roomSchedule[room["rooms_shortname"]][room["rooms_number"]];
        if (thisRoomSchedule.available.length > nth) {
            return thisRoomSchedule.available[nth];
        }
        else {
            return null;
        }
    };
    Scheduler.prototype.blockRoom = function (room, time) {
        var vm = this;
        var thisRoomSchedule = vm.roomSchedule[room["rooms_shortname"]][room["rooms_number"]];
        var index = thisRoomSchedule.available.indexOf(time);
        if (index > -1) {
            thisRoomSchedule.available.splice(index, 1);
        }
    };
    Scheduler.prototype.getLargestSectionThatFits = function (courses, capacity) {
        var vm = this;
        for (var i = 0; courses[i]; i++) {
            var course = courses[i];
            if (course["size"] <= capacity) {
                var toReturn = courses.splice(i, 1)[0];
                return toReturn;
            }
            else {
                var unScheduled = courses.splice(i, 1)[0];
                vm.couldNotSchedule.push(unScheduled);
                i--;
            }
        }
        return null;
    };
    Scheduler.prototype.checkSectionConflict = function (block) {
        var vm = this;
        if (vm.scheduleList[block.course_dept] && vm.scheduleList[block.course_dept][block.course_id]) {
            var courseSchedule = vm.scheduleList[block.course_dept][block.course_id];
            for (var _i = 0, courseSchedule_1 = courseSchedule; _i < courseSchedule_1.length; _i++) {
                var scheduledBlock = courseSchedule_1[_i];
                if (scheduledBlock.day == block.day &&
                    scheduledBlock.start_time == block.start_time) {
                    return true;
                }
            }
            return false;
        }
        else {
            return false;
        }
    };
    Scheduler.prototype.scheduleCourse = function (course, room, time) {
        if (!course) {
            Util_1.Log.error("Course is undefined?");
        }
        var toReturn = {
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
    };
    Scheduler.prototype.validateScheduleQueries = function (courseQuery, roomQuery) {
        var vm = this;
        var res;
        res = vm.checkCourseColumns(courseQuery["OPTIONS"]["COLUMNS"]);
        if (!res[0])
            return res;
        res = vm.checkCourseOrder(courseQuery["OPTIONS"]["ORDER"]);
        if (!res[0])
            return res;
        res = vm.checkRoomColumn(roomQuery["OPTIONS"]["COLUMNS"]);
        if (!res[0])
            return res;
        res = vm.checkRoomOrder(roomQuery["OPTIONS"]["ORDER"]);
        if (!res[0])
            return res;
        return [true, ""];
    };
    Scheduler.prototype.checkCourseColumns = function (columns) {
        var required = ["courses_dept", "courses_id", "courses_pass", "courses_fail", "courses_year", "courses_uuid"];
        for (var _i = 0, required_1 = required; _i < required_1.length; _i++) {
            var req = required_1[_i];
            if (columns.indexOf(req) < 0)
                return [false, "Missing " + req + " from columns"];
        }
        return [true, ""];
    };
    Scheduler.prototype.checkCourseOrder = function (order) {
        if (order["dir"] !== "UP")
            return [false, "Order direction for courses is wrong"];
        var required = ["courses_dept", "courses_id", "courses_year"];
        for (var i = 0; i < required.length; i++) {
            if (order["keys"][i] !== required[i])
                return [false, "Order is incorrect"];
        }
        return [true, ""];
    };
    Scheduler.prototype.checkRoomColumn = function (columns) {
        var required = ["rooms_shortname", "rooms_number", "rooms_seats"];
        for (var _i = 0, required_2 = required; _i < required_2.length; _i++) {
            var req = required_2[_i];
            if (columns.indexOf(req) < 0)
                return [false, "Missing " + req + " from columns"];
        }
        return [true, ""];
    };
    Scheduler.prototype.checkRoomOrder = function (order) {
        if (order["dir"] !== "DOWN")
            return [false, "Order direction for courses is wrong"];
        var required = ["rooms_seats", "rooms_shortname", "rooms_number"];
        for (var i = 0; i < required.length; i++) {
            if (order["keys"][i] !== required[i])
                return [false, "Order is incorrect"];
        }
        return [true, ""];
    };
    return Scheduler;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Scheduler;
//# sourceMappingURL=Scheduler.js.map