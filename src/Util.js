"use strict";
var Log = (function () {
    function Log() {
    }
    Log.trace = function (msg) {
        console.log("<T> " + new Date().toLocaleString() + ": " + msg);
    };
    Log.info = function (msg) {
        console.log("<I> " + new Date().toLocaleString() + ": " + msg);
    };
    Log.warn = function (msg) {
        console.error("<W> " + new Date().toLocaleString() + ": " + msg);
    };
    Log.error = function (msg) {
        console.error("<E> " + new Date().toLocaleString() + ": " + msg);
    };
    Log.test = function (msg) {
        console.log("<X> " + new Date().toLocaleString() + ": " + msg);
    };
    return Log;
}());
exports.Log = Log;
exports.validCourseKeys = [
    "_id", "_dept", "_avg", "_instructor", "_title", "_pass", "_fail", "_audit", "_uuid", "_year"
];
exports.validRoomKeys = [
    "_fullname", "_shortname", "_number", "_name", "_address", "_lat", "_lon", "_seats", "_type", "_furniture", "_href"
];
exports.numKeys = [
    "_avg", "_pass", "_fail", "_audit", "_year", "_lat", "_lon", "_seats"
];
exports.geoLocApiUrl = "http://skaha.cs.ubc.ca:11316/api/v1/team199/";
//# sourceMappingURL=Util.js.map