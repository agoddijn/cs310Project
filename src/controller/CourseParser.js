"use strict";
var Util_1 = require("../Util");
var CourseParser = (function () {
    function CourseParser() {
        Util_1.Log.trace("CourseParser::init()");
        this.promiseList = new Array();
    }
    CourseParser.prototype.parse = function (subPromiseList, id) {
        var vm = this;
        vm.subPromiseList = subPromiseList;
        vm.id = id;
        return new Promise(function (fulfill, reject) {
            Promise.all(vm.subPromiseList).then(function (contents) {
                for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
                    var content = contents_1[_i];
                    var courseDat = JSON.parse(content);
                    vm.promiseList.push(vm.genCourseList(courseDat));
                }
                Promise.all(vm.promiseList).then(function (coursesList) {
                    var toReturn = [];
                    for (var _i = 0, coursesList_1 = coursesList; _i < coursesList_1.length; _i++) {
                        var courses = coursesList_1[_i];
                        toReturn = toReturn.concat(courses);
                    }
                    fulfill(toReturn);
                }).catch(function (err) {
                    Util_1.Log.error("Error in CourseParser.parse() [genCourseList()]");
                    Util_1.Log.error(err);
                    reject(err);
                });
            }).catch(function (err) {
                Util_1.Log.error("Error in CourseParser.parse() [file.aync()]");
                Util_1.Log.error(err);
                reject(err);
            });
        });
    };
    CourseParser.prototype.genCourseList = function (courseDat) {
        var vm = this;
        return new Promise(function (fulfill, reject) {
            var toReturn = [];
            for (var _i = 0, _a = courseDat.result; _i < _a.length; _i++) {
                var course = _a[_i];
                try {
                    toReturn.push(vm.genCourse(course));
                }
                catch (err) {
                    Util_1.Log.error("Error in ZipParser.genCourseList() [genCourse()]");
                    Util_1.Log.error(err);
                    reject(err);
                }
            }
            fulfill(toReturn);
        });
    };
    CourseParser.prototype.genCourse = function (courseObj) {
        var vm = this;
        var course = {};
        if (courseObj.Section == "overall") {
            course[vm.id + "_year"] = 1900;
        }
        else {
            course[vm.id + "_year"] = Number(courseObj.Year);
        }
        course[vm.id + "_id"] = courseObj.Course;
        course[vm.id + "_dept"] = courseObj.Subject;
        course[vm.id + "_audit"] = courseObj.Audit;
        course[vm.id + "_avg"] = courseObj.Avg;
        course[vm.id + "_title"] = courseObj.Title;
        course[vm.id + "_fail"] = courseObj.Fail;
        course[vm.id + "_pass"] = courseObj.Pass;
        course[vm.id + "_instructor"] = courseObj.Professor;
        course[vm.id + "_uuid"] = (courseObj.id).toString();
        return course;
    };
    return CourseParser;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CourseParser;
//# sourceMappingURL=CourseParser.js.map