"use strict";
var Util_1 = require("../Util");
var util_1 = require("util");
var CourseParser_1 = require("./CourseParser");
var RoomParser_1 = require("./RoomParser");
var JSZip = require("jszip");
var ZipParser = (function () {
    function ZipParser() {
        Util_1.Log.trace("ZipParser::init()");
    }
    ZipParser.prototype.parse = function (zipBin, id) {
        var zip = new JSZip();
        return new Promise(function (fulfill, reject) {
            var options = {
                base64: true
            };
            zip.loadAsync(zipBin, options).then(function (data) {
                var subPromiseList = new Array();
                if (data.files["index.htm"]) {
                    if (!(id === "rooms"))
                        reject({ message: "ID incorrect for given dataset" });
                    var rParse = new RoomParser_1.default();
                    rParse.parse(data, id).then(function (rooms) {
                        fulfill(rooms);
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    if (!(id === "courses"))
                        reject({ message: "ID incorrect for given dataset" });
                    for (var filename in data.files) {
                        var file = data.file(filename);
                        if (!util_1.isNullOrUndefined(file)) {
                            subPromiseList.push(file.async("string"));
                        }
                    }
                    var cParse = new CourseParser_1.default();
                    cParse.parse(subPromiseList, id).then(function (courses) {
                        Util_1.Log.info("Successfully parsed courselist");
                        fulfill(courses);
                    }).catch(function (err) {
                        Util_1.Log.error("Error ar ZipParser.parse() [CourseParser.parse()]");
                        reject(err);
                    });
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    return ZipParser;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZipParser;
//# sourceMappingURL=ZipParser.js.map