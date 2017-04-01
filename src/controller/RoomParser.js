"use strict";
var Util_1 = require("../Util");
var parse5 = require('parse5');
var http = require("http");
var RoomParser = (function () {
    function RoomParser() {
        Util_1.Log.trace("RoomParser::init()");
    }
    RoomParser.prototype.parse = function (data, id) {
        var vm = this;
        vm.data = data;
        vm.id = id;
        var promiseList = new Array();
        return new Promise(function (fulfill, reject) {
            data.files["index.htm"].async("string").then(function (html) {
                var document = parse5.parse(html);
                vm.searchIndexForRooms(document).then(function (buildings) {
                    for (var _i = 0, buildings_1 = buildings; _i < buildings_1.length; _i++) {
                        var building = buildings_1[_i];
                        var buildingPath = "campus/discover/buildings-and-classrooms/" + building;
                        promiseList.push(vm.genBuilding(data.file(buildingPath).async("string"), building));
                    }
                    Promise.all(promiseList).then(function (roomsList) {
                        var toReturn = [];
                        for (var _i = 0, roomsList_1 = roomsList; _i < roomsList_1.length; _i++) {
                            var rooms = roomsList_1[_i];
                            toReturn = toReturn.concat(rooms);
                        }
                        fulfill(toReturn);
                    }).catch(function (err) {
                        Util_1.Log.error("Error in RoomParser.parse() [RoomParser.genBuilding()]");
                        reject(err);
                    });
                }).catch(function (err) {
                    Util_1.Log.error("Error in RoomParser.parse() [RoomParser.searchIndexForRooms()]");
                    reject(err);
                });
            }).catch(function (err) {
                Util_1.Log.error("Error in RoomParser.parse() [JSZip.async() or parse5.parse()]");
                reject(err);
            });
        });
    };
    RoomParser.prototype.searchIndexForRooms = function (document) {
        var vm = this;
        return new Promise(function (fulfill, reject) {
            var toCheck = new Array();
            var toReturn = new Array();
            toCheck.push(document);
            while (!(toCheck.length == 0)) {
                var cur = toCheck.pop();
                if (cur["childNodes"]) {
                    for (var _i = 0, _a = cur["childNodes"]; _i < _a.length; _i++) {
                        var node = _a[_i];
                        var nodeName = node["nodeName"];
                        if (nodeName === "html") {
                            toCheck.push(node);
                        }
                        else if (nodeName === "body") {
                            toCheck.push(node);
                        }
                        else if (nodeName === "div" &&
                            (vm.checkNodeAttrs(node, "class", "full-width-container") ||
                                vm.checkNodeAttrs(node, "id", "main") ||
                                vm.checkNodeAttrs(node, "id", "content") ||
                                vm.checkNodeAttrs(node, "class", "view-buildings-and-classrooms") ||
                                vm.checkNodeAttrs(node, "class", "view-content"))) {
                            toCheck.push(node);
                        }
                        else if (nodeName === "section" &&
                            (vm.checkNodeAttrs(node, "id", "block-system-main"))) {
                            toCheck.push(node);
                        }
                        else if (nodeName === "table" &&
                            (vm.checkNodeAttrs(node, "class", "views-table"))) {
                            toCheck.push(node);
                        }
                        else if (nodeName === "tbody") {
                            toCheck.push(node);
                        }
                        else if (nodeName === "tr") {
                            toCheck.push(node);
                        }
                        else if (nodeName === "td" &&
                            (vm.checkNodeAttrs(node, "class", "views-field-field-building-code"))) {
                            var buildingName = node["childNodes"][0]["value"];
                            buildingName = buildingName.trim();
                            toReturn.push(buildingName);
                        }
                    }
                }
            }
            if (toReturn.length == 0)
                reject("Error in searchIndexForRoom, could not find rooms");
            fulfill(toReturn);
        });
    };
    RoomParser.prototype.genBuilding = function (buildingHtml, shortname) {
        var vm = this;
        return new Promise(function (fulfill, reject) {
            var fullname, address, lat, lon;
            var toReturn = new Array();
            buildingHtml.then(function (html) {
                var building = parse5.parse(html);
                var toCheck = new Array();
                toCheck.push(building);
                while (!(toCheck.length == 0)) {
                    var cur = toCheck.pop();
                    if (cur["childNodes"]) {
                        for (var _i = 0, _a = cur["childNodes"]; _i < _a.length; _i++) {
                            var node = _a[_i];
                            var nodeName = node["nodeName"];
                            if (nodeName === "html") {
                                toCheck.push(node);
                            }
                            else if (nodeName === "body") {
                                toCheck.push(node);
                            }
                            else if (nodeName === "div" &&
                                (vm.checkNodeAttrs(node, "class", "full-width-container") ||
                                    vm.checkNodeAttrs(node, "id", "main") ||
                                    vm.checkNodeAttrs(node, "id", "content") ||
                                    vm.checkNodeAttrs(node, "class", "view-buildings-and-classrooms") ||
                                    vm.checkNodeAttrs(node, "class", "view-content") ||
                                    vm.checkNodeAttrs(node, "class", "view-footer") ||
                                    vm.checkNodeAttrs(node, "class", "views-row") ||
                                    vm.checkNodeAttrs(node, "id", "buildings-wrapper"))) {
                                toCheck.push(node);
                            }
                            else if (nodeName === "div" &&
                                (vm.checkNodeAttrs(node, "id", "building-info"))) {
                                fullname = node["childNodes"][1]["childNodes"][0]["childNodes"][0]["value"];
                                address = node["childNodes"][3]["childNodes"][0]["childNodes"][0]["value"];
                            }
                            else if (nodeName === "section" &&
                                (vm.checkNodeAttrs(node, "id", "block-system-main"))) {
                                toCheck.push(node);
                            }
                            else if (nodeName === "table" &&
                                (vm.checkNodeAttrs(node, "class", "views-table"))) {
                                toCheck.push(node);
                            }
                            else if (nodeName === "tbody") {
                                toCheck.push(node);
                            }
                            else if (nodeName === "tr") {
                                toReturn.push(vm.genRoom(node));
                            }
                        }
                    }
                }
                http.get(Util_1.geoLocApiUrl + address, function (response) {
                    var res = '';
                    response.on('data', function (chunk) {
                        res += chunk;
                    });
                    response.on('end', function () {
                        var data = JSON.parse(res);
                        if (data["error"])
                            Util_1.Log.error("Could not get lat & lon");
                        for (var _i = 0, toReturn_1 = toReturn; _i < toReturn_1.length; _i++) {
                            var room = toReturn_1[_i];
                            room[vm.id + "_fullname"] = fullname;
                            room[vm.id + "_shortname"] = shortname;
                            room[vm.id + "_name"] = shortname + "_" + room[vm.id + "_number"];
                            room[vm.id + "_address"] = address;
                            if (data["error"]) {
                                room[vm.id + "_lat"] = 0;
                                room[vm.id + "_lon"] = 0;
                            }
                            else {
                                room[vm.id + "_lat"] = data["lat"];
                                room[vm.id + "_lon"] = data["lon"];
                            }
                        }
                        fulfill(toReturn);
                    });
                });
            }).catch(function (err) {
                Util_1.Log.error("Error in RoomParser.parse() [JSZip.async()]");
                reject(err);
            });
        });
    };
    RoomParser.prototype.genRoom = function (trNode) {
        var vm = this;
        var room = {};
        room[vm.id + "_number"] = trNode["childNodes"][1]["childNodes"][1]["childNodes"][0]["value"];
        room[vm.id + "_href"] = trNode["childNodes"][1]["childNodes"][1]["attrs"][0]["value"];
        room[vm.id + "_seats"] = Number((trNode["childNodes"][3]["childNodes"][0]["value"]).trim());
        room[vm.id + "_furniture"] = (trNode["childNodes"][5]["childNodes"][0]["value"]).trim();
        room[vm.id + "_type"] = (trNode["childNodes"][7]["childNodes"][0]["value"]).trim();
        return room;
    };
    RoomParser.prototype.checkNodeAttrs = function (node, attrName, attrValue) {
        if (node["attrs"]) {
            var attrs = node["attrs"];
            for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
                var attr = attrs_1[_i];
                if (attr["name"] === attrName && attr["value"].indexOf(attrValue) >= 0) {
                    return true;
                }
            }
        }
        return false;
    };
    return RoomParser;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoomParser;
//# sourceMappingURL=RoomParser.js.map