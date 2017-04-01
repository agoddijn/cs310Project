app.controller('QueryController', ['$http', '$location', function ($http, $location) {
        var vm = this;
        vm.data = {};
        vm.selectedKey = [];
        vm.selectedVal = [];
        vm.selectedRel = [];
        vm.selectedCol = [];
        vm.selectedOrder = [];
        vm.selectedGroup = [];
        vm.selectedApply = [];
        vm.selectedApplyToken = [];
        vm.selectedApplyName = [];
        vm.filterFields = [0];
        vm.filterFieldNum = 1;
        vm.orderFields = [0];
        vm.orderFieldNum = 1;
        vm.groupFields = [0];
        vm.groupFieldNum = 1;
        vm.applyFields = [0];
        vm.applyFieldNum = 1;
        vm.and = false;
        vm.or = false;
        vm.up = false;
        vm.down = false;
        vm.response = [];
        vm.responseToDisplay = [];
        vm.errMsg;
        vm.info;
        vm.status;
        vm.success;
        vm.totalDisplayed;
        vm.incrementBy = 500;
        vm.loadMoreDisp;
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
        vm.init = function () {
            if ($location.path() === "/courses") {
                vm.name = "Course";
                vm.keys = {
                    Department: "courses_dept",
                    ID: "courses_id",
                    Year: "courses_year",
                    Audit: "courses_audit",
                    Average: "courses_avg",
                    Title: "courses_title",
                    Pass: "courses_pass",
                    Fail: "courses_fail",
                    Instructor: "courses_instructor",
                    UniqueID: "courses_uuid"
                };
                vm.getField("courses_dept");
                vm.getField("courses_id");
                vm.getField("courses_year");
                vm.getField("courses_title");
                vm.getField("courses_instructor");
            }
            else if ($location.path() === "/rooms") {
                vm.name = "Room";
                vm.keys = {
                    Fullname: "rooms_fullname",
                    Shortname: "rooms_shortname",
                    Number: "rooms_number",
                    ID: "rooms_name",
                    Address: "rooms_address",
                    Lat: "rooms_lat",
                    Lon: "rooms_lon",
                    Seats: "rooms_seats",
                    Type: "rooms_type",
                    Furniture: "rooms_furniture",
                    Distance: "dist"
                };
                vm.dist = true;
                vm.buildings = [];
                vm.roomName;
                vm.roomDist;
                vm.getField("rooms_fullname");
                vm.getField("rooms_shortname");
                vm.getField("rooms_number");
                vm.getField("rooms_name");
                vm.getField("rooms_type");
                vm.getField("rooms_furniture");
            }
        };
        vm.getField = function (field) {
            var req = {
                "WHERE": {},
                "OPTIONS": {
                    "COLUMNS": [
                        field
                    ],
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": [
                        field
                    ],
                    "APPLY": []
                }
            };
            var url = "/query";
            $http.post(url, req).then(function (res) {
                vm.data[field] = res.data.result;
            }).catch(function (err) {
                console.log("Could not get " + field);
                console.log(err);
            });
        };
        vm.getRels = function (key) {
            if (key === "Average" || key === "Pass" ||
                key === "Fail" || key === "Audit" || key === "Year" ||
                key === "Lat" || key === "Lon" || key === "Seats") {
                return [">", "<", "=", "≠"];
            }
            else {
                return ["IS", "IS NOT"];
            }
        };
        vm.getApplyToken = function (key) {
            if (key === "Average" || key === "Pass" ||
                key === "Fail" || key === "Audit" || key === "Year" ||
                key === "Lat" || key === "Lon" || key === "Seats") {
                return ["COUNT", "MAX", "MIN", "AVG", "SUM"];
            }
            else {
                return ["COUNT"];
            }
        };
        vm.selectRel = function (rel, index) {
            vm.selectedRel[index] = rel;
        };
        vm.selectApply = function (apply, index) {
            vm.selectedApplyToken[index] = apply;
        };
        vm.addFilter = function () {
            vm.filterFields.push(vm.filterFieldNum);
            vm.filterFieldNum++;
        };
        vm.removeFilter = function () {
            vm.filterFields.pop();
            vm.filterFieldNum--;
        };
        vm.addOrder = function () {
            vm.orderFields.push(vm.orderFieldNum);
            vm.orderFieldNum++;
        };
        vm.removeOrder = function () {
            vm.orderFields.pop();
            vm.orderFieldNum--;
        };
        vm.addGroup = function () {
            vm.groupFields.push(vm.groupFieldNum);
            vm.groupFieldNum++;
        };
        vm.removeGroup = function () {
            vm.groupFields.pop();
            vm.groupFieldNum--;
        };
        vm.addApply = function () {
            vm.applyFields.push(vm.applyFieldNum);
            vm.applyFieldNum++;
        };
        vm.removeApply = function () {
            vm.applyFields.pop();
            vm.applyFieldNum--;
        };
        vm.chooseAndOr = function (andor) {
            if (andor === 'and') {
                vm.and = true;
                vm.or = false;
            }
            else if (andor === 'or') {
                vm.and = false;
                vm.or = true;
            }
        };
        vm.chooseUpDown = function (updown) {
            if (updown === 'up') {
                vm.up = true;
                vm.down = false;
            }
            else if (updown === 'down') {
                vm.up = false;
                vm.down = true;
            }
        };
        vm.setActive = function (value) {
            if (value === 'and' && vm.and) {
                return 'active';
            }
            else if (value === 'or' && vm.or) {
                return 'active';
            }
            else if (value === 'up' && vm.up) {
                return 'active';
            }
            else if (value === 'down' && vm.down) {
                return 'active';
            }
        };
        vm.isColActive = function (col) {
            if (vm.selectedCol.indexOf(col) > -1)
                return "active";
        };
        vm.addCol = function (col) {
            var index = vm.selectedCol.indexOf(col);
            if (index > -1) {
                vm.selectedCol.splice(index, 1);
            }
            else {
                vm.selectedCol.push(col);
            }
        };
        vm.chooseDir = function () {
            if (vm.up) {
                return "UP";
            }
            else if (vm.down) {
                return "DOWN";
            }
        };
        vm.query = function () {
            vm.totalDisplayed = 500;
            var req = {};
            if (vm.selectedGroup.length != 0) {
                if (vm.selectedApply.length != 0) {
                    req["TRANSFORMATIONS"] = {
                        "GROUP": vm.constructGroup(),
                        "APPLY": vm.constructApply()
                    };
                }
                else {
                    req["TRANSFORMATIONS"] = {
                        "GROUP": vm.constructGroup(),
                        "APPLY": []
                    };
                }
            }
            if (vm.selectedKey && vm.selectedKey.length && vm.selectedKey.length > 0) {
                if (vm.filterFieldNum == 1) {
                    req["WHERE"] = vm.constructQuery();
                }
                else if (vm.and) {
                    req["WHERE"] = {
                        "AND": vm.constructQuery()
                    };
                }
                else if (vm.or) {
                    req["WHERE"] = {
                        "OR": vm.constructQuery()
                    };
                }
            }
            else {
                if(vm.showDist) {
                    req["WHERE"] = vm.constructQuery()[0];
                } else {
                    req["WHERE"] = {};
                }
            }
            if (!(vm.up) && !(vm.down)) {
                req["OPTIONS"] = {
                    "COLUMNS": vm.constructCols(),
                    "FORM": "TABLE"
                };
            }
            else {
                if (vm.orderFieldsNum == 1) {
                    req["OPTIONS"] = {
                        "COLUMNS": vm.constructCols(),
                        "ORDER": vm.constructOrder(),
                        "FORM": "TABLE"
                    };
                }
                else {
                    req["OPTIONS"] = {
                        "COLUMNS": vm.constructCols(),
                        "ORDER": {
                            "dir": vm.chooseDir(),
                            "keys": vm.constructOrder()
                        },
                        "FORM": "TABLE"
                    };
                }
            }
            console.log("Requesting");
            console.log(req);
            var url = "/query";
            $http.post(url, req).then(function (res) {
                console.log("Response recieved");
                vm.response = res.data.result;
                console.log(res);
                if (vm.response.length == 0 ) {
                    vm.success = false;
                    vm.status = 0;
                    vm.errMsg = "No results found!";
                    vm.loadMoreDisp = false;
                    $('#errModal').modal('show');
                }
                else if (vm.response.length > vm.totalDisplayed) {
                    vm.responseToDisplay = vm.response.slice(0, vm.totalDisplayed);
                    vm.loadMoreDisp = true;
                    vm.success = true;
                }
                else {
                    vm.responseToDisplay = vm.response;
                    vm.success = true;
                }

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
            });
        };
        vm.constructQuery = function () {
            var relMap = {
                ">": "GT",
                "<": "LT",
                "=": "EQ",
                "IS": "IS"
            };
            var toReturn = [];
            console.log(vm.showDist);
            if (vm.showDist) {
                console.log("Adding dist");
                var toPush = {};
                var distCalc = vm.createDist();
                toPush["AND"] = distCalc;
                toReturn.push(toPush);
            }
            for (var i = 0; i < vm.filterFieldNum && vm.selectedKey.length > 0 ; i++) {
                var key = vm.keys[vm.selectedKey[i]];
                var val = vm.selectedVal[i];
                var toPush = {};
                if (vm.selectedRel[i] === "IS NOT") {
                    toPush["NOT"] = {
                        "IS": {}
                    };
                    toPush["NOT"]["IS"][key] = val;
                }
                else if (vm.selectedRel[i] === "≠") {
                    toPush["NOT"] = {
                        "EQ": {}
                    };
                    toPush["NOT"]["EQ"][key] = Number(val);
                }
                else {
                    var rel = relMap[vm.selectedRel[i]];
                    if (rel === "IS") {
                        toPush[rel] = {};
                        toPush[rel][key] = val;
                    }
                    else {
                        toPush[rel] = {};
                        toPush[rel][key] = Number(val);
                    }
                }
                if (vm.filterFieldNum == 1)
                    return toPush;
                toReturn.push(toPush);

            }
            return toReturn;
        };
        vm.constructCols = function () {
            console.log(vm.selectedCol);
            var toReturn = [];
            for (var i = 0; i < vm.selectedCol.length; i++) {
                if (vm.keys[vm.selectedCol[i]]) {
                    toReturn.push(vm.keys[vm.selectedCol[i]]);
                }
                else {
                    toReturn.push(vm.selectedCol[i]);
                }
            }
            return toReturn;
        };
        vm.constructOrder = function () {
            var toReturn = [];
            for (var i = 0; i < vm.orderFieldNum; i++) {
                if (vm.keys[vm.selectedOrder[i]]) {
                    toReturn.push(vm.keys[vm.selectedOrder[i]]);
                }
                else {
                    toReturn.push(vm.selectedOrder[i]);
                }
            }
            return toReturn;
        };
        vm.constructGroup = function () {
            var toReturn = [];
            for (var i = 0; i < vm.groupFieldNum; i++) {
                var toPush = vm.keys[vm.selectedGroup[i]];
                toReturn.push(toPush);
            }
            return toReturn;
        };
        vm.constructApply = function () {
            var toReturn = [];
            for (var i = 0; i < vm.applyFieldNum; i++) {
                var apply = vm.keys[vm.selectedApply[i]];
                var appName = vm.selectedApplyName[i].toString();
                var token = vm.selectedApplyToken[i];
                var toPush = {};
                toPush[appName] = {};
                toPush[appName][token] = apply;
                toReturn.push(toPush);
            }
            return toReturn;
        };
        vm.resetError = function () {
            vm.errMsg = "";
            vm.info = "";
            vm.status = "";
        };
        vm.loadMore = function () {
            if (vm.response.length > (vm.totalDisplayed + vm.incrementBy)) {
                vm.responseToDisplay = vm.responseToDisplay.concat(vm.response.slice(vm.totalDisplayed, vm.totalDisplayed + vm.incrementBy));
                vm.totalDisplayed += vm.incrementBy;
            }
            else {
                vm.loadMoreDisp = false;
                vm.responseToDisplay = vm.response;
            }
        };
        vm.resetQuery = function () {
            vm.selectedKey = [];
            vm.selectedVal = [];
            vm.selectedRel = [];
            vm.selectedCol = [];
            vm.selectedOrder = [];
            vm.selectedGroup = [];
            vm.selectedApply = [];
            vm.selectedApplyToken = [];
            vm.selectedApplyName = [];
            vm.filterFields = [0];
            vm.filterFieldNum = 1;
            vm.orderFields = [0];
            vm.orderFieldNum = 1;
            vm.groupFields = [0];
            vm.groupFieldNum = 1;
            vm.applyFields = [0];
            vm.applyFieldNum = 1;
            vm.and = false;
            vm.or = false;
            vm.up = false;
            vm.down = false;
            vm.showDist = false;
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
        vm.getBuildings = function () {
            var url = "/query";
            $http.post(url, vm.buildingNameQuery).then(function (res) {
                vm.buildings = res.data.result;
            }).catch(function (err) {
                console.log("Could not get buildings");
                console.log(err);
            });
        };
        vm.addDist = function () {
            vm.showDist = true;
        };
        vm.init();
        vm.getBuildings();
    }]);
//# sourceMappingURL=query-controller.js.map