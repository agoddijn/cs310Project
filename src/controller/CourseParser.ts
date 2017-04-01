/**
 * Created by alexgoddijn on 13/02/2017.
 */

import {Log} from '../Util';
import {Course, zipDat, Result} from "./IInsightFacade";
import {ICourseParser} from "./ICourseParser";

export default class CourseParser implements ICourseParser {

    subPromiseList: Promise<string>[];
    promiseList: Promise<Course[]>[];
    id: string;

    constructor() {
        Log.trace("CourseParser::init()");
        this.promiseList = new Array<Promise<Course[]>>();
    }

    public parse(subPromiseList: Promise<string>[], id: string): Promise<Course[]> {
        var vm = this;
        vm.subPromiseList = subPromiseList;
        vm.id = id;

        return new Promise(function(fulfill, reject){
            // Push all promises generated from unzipped files to promiseList
            Promise.all(vm.subPromiseList).then(function (contents: string[]) {
                for (let content of contents) {
                    let courseDat: zipDat = JSON.parse(content);
                    vm.promiseList.push(vm.genCourseList(courseDat));
                }

                // Concatenate the course lists
                Promise.all(vm.promiseList).then(function (coursesList: Course[][]) {
                    // The variable to fulfill
                    let toReturn: Course[] = [];
                    for (let courses of coursesList) {
                        toReturn = toReturn.concat(courses);
                    }
                    fulfill(toReturn);
                }).catch(function (err: any) {
                    // Log error if it occurs
                    Log.error("Error in CourseParser.parse() [genCourseList()]");
                    Log.error(err);
                    reject(err);
                });

            }).catch(function (err: any) {
                // Log error if it occurs
                Log.error("Error in CourseParser.parse() [file.aync()]");
                Log.error(err);
                reject(err);
            });
        });
    }


    public genCourseList(courseDat: zipDat): Promise<Course[]> {

        var vm = this;

        return new Promise(function(fulfill, reject) {
            let toReturn: Course[] = [];
            for (let course of courseDat.result) {
                try {
                    // Create the course and push it to the course array
                    toReturn.push(vm.genCourse(course));
                } catch(err) {
                    Log.error("Error in ZipParser.genCourseList() [genCourse()]");
                    Log.error(err);
                    reject(err);
                }
            }
            fulfill(toReturn);
        });
    }

    public genCourse(courseObj: Result): Course {
        var vm = this;
        var course: Course = {};
        if (courseObj.Section == "overall") {
            course[vm.id + "_year"] = 1900;
        } else {
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
    }

}