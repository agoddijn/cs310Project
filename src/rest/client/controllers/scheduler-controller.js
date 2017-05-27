app.controller('SchedulerController', ['$http', '$q', function ($http, $q) {
        var vm = this;
        vm.name = "Scheduler";
        vm.courseDept;
        vm.courseId;
        vm.roomName;
        vm.roomDist;
        vm.buildings = [];
        vm.coursesDepts = [];
        vm.coursesIds = [];
        vm.scheduled;
        vm.unscheduled = [];
        vm.fitness = 0;
        vm.peopleScheduled = 0;
        vm.peopleUnscheduled = 0;
        vm.success = false;
        vm.errMsg;
        vm.info;
        vm.status;
        vm.buildingColumns = ["Shortname", "Fullname", "lat", "lon"];
        vm.courseDeptQuery = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": [
                        "courses_dept"
                    ]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_dept"
                ],
                "APPLY": []
            }
        };
        vm.courseIdQuery = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": [
                        "courses_id"
                    ]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_id"
                ],
                "APPLY": []
            }
        };
        vm.buildingNameQuery = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "rooms_fullname",
                    "rooms_lat",
                    "rooms_lon"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": [
                        "rooms_shortname"
                    ]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "rooms_shortname",
                    "rooms_fullname",
                    "rooms_lat",
                    "rooms_lon"
                ],
                "APPLY": []
            }
        };
        vm.scheduleCourseQuery = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_pass",
                    "courses_fail",
                    "courses_year",
                    "courses_uuid"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": [
                        "courses_dept",
                        "courses_id",
                        "courses_year"
                    ]
                },
                "FORM": "TABLE"
            }
        };
        vm.scheduleRoomQuery = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "rooms_number",
                    "rooms_seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": [
                        "rooms_seats",
                        "rooms_shortname",
                        "rooms_number"
                    ]
                },
                "FORM": "TABLE"
            }
        };
        vm.getData = function () {
            vm.getCourseDepts();
            vm.getCourseIds();
            vm.getBuildings();
        };
        vm.getCourseDepts = function () {
            var url = "/query";
            $http.post(url, vm.courseDeptQuery).then(function (res) {
                vm.coursesDepts = res.data.result;
            }).catch(function (err) {
                console.log("Could not get depts");
                console.log(err);
            });
        };
        vm.getCourseIds = function () {
            var url = "/query";
            $http.post(url, vm.courseIdQuery).then(function (res) {
                vm.coursesIds = res.data.result;
            }).catch(function (err) {
                console.log("Could not get ids");
                console.log(err);
            });
        };
        vm.getBuildings = function () {
            var url = "/query";
            $http.post(url, vm.buildingNameQuery).then(function (res) {
                vm.buildings = res.data.result;
            }).catch(function (err) {
                console.log("Could not get buildings");
                console.log(err);
            });
        };
        vm.schedule = function () {
            var url = "/schedule";
            var reqData;
            console.log(vm.courseDept + "; " + vm.courseId + "; " + vm.roomName + "; " + vm.roomDist);
            if (vm.courseDept) {
                if (vm.courseId) {
                    vm.scheduleCourseQuery["WHERE"] = {
                        "AND": [
                            {
                                "IS": {
                                    "courses_dept": vm.courseDept
                                }
                            },
                            {
                                "IS": {
                                    "courses_id": vm.courseId
                                }
                            }
                        ]
                    };
                }
                else {
                    vm.scheduleCourseQuery["WHERE"] = {
                        "IS": {
                            "courses_dept": vm.courseDept
                        }
                    };
                }
            }
            else {
                vm.scheduleCourseQuery["WHERE"] = {
                    "IS": {
                        "courses_id": vm.courseId
                    }
                };
            }
            if (vm.roomDist) {
                vm.scheduleRoomQuery["WHERE"]["AND"] = vm.createDist();
            }
            else {
                vm.scheduleRoomQuery["WHERE"] = {
                    "IS": {
                        "rooms_shortname": vm.roomName
                    }
                };
            }
            reqData = {
                courses: vm.scheduleCourseQuery,
                rooms: vm.scheduleRoomQuery
            };
            $http.post(url, reqData).then(function (res) {
                console.log(res);
                vm.scheduled = res.data.schedule;
                vm.unscheduled = res.data.unscheduled;
                vm.peopleScheduled = res.data.peopleScheduled;
                vm.peopleUnscheduled = res.data.peopleUnscheduled;
                vm.fitness = vm.peopleScheduled / (vm.peopleScheduled + vm.peopleUnscheduled);
                vm.success = true;
                vm.resetQueries();
            }).catch(function (err) {
                vm.success = false;
                vm.status = err.status;
                if (vm.satus != 424) {
                    vm.errMsg = err.data.error;
                }
                else {
                    vm.errMsg = "Missing: " + err.data.missing;
                }
                $('#errModal').modal('show');
                vm.resetQueries();
            });
        };
        vm.resetQueries = function () {
            vm.scheduleRoomQuery["WHERE"] = {};
            vm.scheduleCourseQuery["WHERE"] = {};
        };
        vm.resetError = function () {
            vm.errMsg = "";
            vm.info = "";
            vm.status = "";
        };
        vm.createDist = function () {
            if (!vm.roomDist)
                return null;
            var lat;
            var lon;
            for (var _i = 0, _a = vm.buildings; _i < _a.length; _i++) {
                var building = _a[_i];
                if (building.rooms_shortname === vm.roomName) {
                    lat = building.rooms_lat;
                    lon = building.rooms_lon;
                    break;
                }
            }
            var top = vm.calcNewLat(lat, vm.roomDist);
            var bottom = vm.calcNewLat(lat, -1 * vm.roomDist);
            var left = vm.calcNewLon(lon, lat, -1 * vm.roomDist);
            var right = vm.calcNewLon(lon, lat, vm.roomDist);
            var toReturn = [
                {
                    "LT": {
                        "rooms_lat": top
                    }
                },
                {
                    "GT": {
                        "rooms_lon": left
                    }
                },
                {
                    "GT": {
                        "rooms_lat": bottom
                    }
                },
                {
                    "LT": {
                        "rooms_lon": right
                    }
                }
            ];
            return toReturn;
        };
        vm.calcNewLat = function (lat, dist) {
            var newLat = lat + (((dist / 1000) / 6371) * (180 / Math.PI));
            return newLat;
        };
        vm.calcNewLon = function (lon, lat, dist) {
            var newLon = lon + (((dist / 1000) / 6371) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180));
            return newLon;
        };
        vm.validateAndSchedule = function () {
            vm.resetError();
            // if (!(vm.courseDept || vm.courseId)) {
            //     vm.errMsg = "Need at least one of course dept or course id";
            //     vm.info = "Usage: Entering just a course dept will filter by course dept, just a course id filters by just a course id, " +
            //         "both filters by course department and course id";
            //     $('#errModal').modal('show');
            //     vm.success = false;
            //     return;
            // }
            if (!vm.roomName) {
                vm.errMsg = "Need a room name";
                vm.info = "Usage: Entering a room name will filter by building name\n" +
                    "\tA building name with distance will get all buildings within that distance to the selected building";
                $('#errModal').modal('show');
                vm.success = false;
                return;
            }
            vm.schedule();
        };
        vm.getData();
    }]);
//# sourceMappingURL=scheduler-controller.js.map