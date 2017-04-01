/**
 * Created by alexgoddijn on 22/01/2017.
 */

import {Log} from "../Util";
import {Course, Room} from "./IInsightFacade";
import {isNullOrUndefined} from "util";
import CourseParser from "./CourseParser";
import RoomParser from "./RoomParser";
var JSZip = require("jszip");

interface IZipParser {
    parse(zipBin: string, id: string): Promise<Course[]>;
}

export default class ZipParser implements IZipParser {

    constructor() {
        Log.trace("ZipParser::init()");
    }

    public parse(zipBin: string, id: string): Promise<Course[] | Room[]>{
        var zip = new JSZip();

        return new Promise(function(fulfill, reject) {
            // Options for decoding
            let options = {
                base64: true
            };

            // Load the zip data
            zip.loadAsync(zipBin, options).then(function(data: any) {
                // Iterate through all the files
                // ask for a promise of course list or room list for each file
                // wait until all promises are fulfilled
                let subPromiseList: Promise<string>[] = new Array<Promise<string>>();

                // Check if given file is for courses or rooms
                if (data.files["index.htm"]) {
                    if(!(id === "rooms")) reject({message: "ID incorrect for given dataset"});
                    var rParse: RoomParser = new RoomParser();
                    rParse.parse(data, id).then(function(rooms: Room[]) {
                        fulfill(rooms);
                    }).catch(function(err) {
                        reject(err);
                    });
                } else {
                    if(!(id === "courses")) reject({message: "ID incorrect for given dataset"});

                    // For courses only
                    for (let filename in data.files) {
                        let file = data.file(filename);
                        if (!isNullOrUndefined(file)) {
                            // Each file reading is an asynchronous call
                            subPromiseList.push(file.async("string"));
                        }
                    }

                    var cParse: CourseParser = new CourseParser();
                    cParse.parse(subPromiseList, id).then(function (courses: Course[]) {
                        Log.info("Successfully parsed courselist");
                        fulfill(courses);
                    }).catch(function (err: any) {
                        Log.error("Error ar ZipParser.parse() [CourseParser.parse()]");
                        reject(err);
                    });
                }

            }).catch(function(err: any) {
                reject(err);
            });
        });
    }

}