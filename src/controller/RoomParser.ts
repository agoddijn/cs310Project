/**
 * Created by alexgoddijn on 13/02/2017.
 */

import {Log, geoLocApiUrl} from '../Util';
import {Room} from "./IInsightFacade";
import {IRoomParser} from './IRoomParser';
var parse5 = require('parse5');
var http = require("http");

export default class RoomParser implements IRoomParser {

    data: any;
    id: string;

    constructor() {
        Log.trace("RoomParser::init()");
    }

    public parse(data: any, id: string): Promise<Room[]> {

        var vm = this;

        vm.data = data;
        vm.id = id;
        var promiseList: Promise<Room[]>[] = new Array<Promise<Room[]>>();

        return new Promise(function(fulfill, reject){
            data.files["index.htm"].async("string").then(function(html: string) {

                let document: any = parse5.parse(html);
                vm.searchIndexForRooms(document).then(function(buildings: string[]) {

                    for (let building of buildings) {
                        let buildingPath: string = "campus/discover/buildings-and-classrooms/" + building;
                        promiseList.push(vm.genBuilding(data.file(buildingPath).async("string"), building));
                    }

                    Promise.all(promiseList).then(function(roomsList: Room[][]) {
                        let toReturn: Room[] = [];
                        for (let rooms of roomsList) {
                            toReturn = toReturn.concat(rooms);
                        }
                        fulfill(toReturn);

                    }).catch(function(err: any) {
                        Log.error("Error in RoomParser.parse() [RoomParser.genBuilding()]");
                        reject(err);
                    });

                }).catch(function(err: any) {
                    Log.error("Error in RoomParser.parse() [RoomParser.searchIndexForRooms()]");
                    reject(err);
                })

            }).catch(function(err: any) {
                Log.error("Error in RoomParser.parse() [JSZip.async() or parse5.parse()]");
                reject(err);
            });
        });
    }

    public searchIndexForRooms(document: any): Promise<string[]> {

        var vm = this;

        return new Promise(function(fulfill, reject) {
            var toCheck = new Array();
            var toReturn = new Array<string>();
            toCheck.push(document);
            // Strategy, BFS of tree using specific nodeNames to find relevant data
            while(!(toCheck.length == 0)) {
                let cur = toCheck.pop();
                if(cur["childNodes"]) {
                    for(let node of cur["childNodes"]) {
                        let nodeName = node["nodeName"];
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
                            let buildingName: string = node["childNodes"][0]["value"];
                            buildingName = buildingName.trim();
                            toReturn.push(buildingName);
                        }
                    }
                }
            }
            if (toReturn.length == 0) reject("Error in searchIndexForRoom, could not find rooms");
            fulfill(toReturn);
        });
    }

    public genBuilding(buildingHtml: Promise<string>, shortname: string): Promise<Room[]> {

        var vm = this;

        return new Promise(function(fulfill, reject) {

            var fullname: string, address: string, lat: number, lon: number;
            var toReturn: Room[] = new Array<Room>();

            buildingHtml.then(function(html: string) {
                let building = parse5.parse(html);
                var toCheck = new Array();
                toCheck.push(building);
                while(!(toCheck.length == 0)) {
                    let cur = toCheck.pop();
                    if (cur["childNodes"]) {
                        for (let node of cur["childNodes"]) {
                            let nodeName = node["nodeName"];
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

                http.get(geoLocApiUrl + address, function(response: any) {
                    var res: string = '';

                    response.on('data', function(chunk: string) {
                        res += chunk;
                    })

                    response.on('end', function() {
                        var data = JSON.parse(res);
                        if(data["error"]) Log.error("Could not get lat & lon");
                        for (let room of toReturn) {
                            room[vm.id + "_fullname"] = fullname;
                            room[vm.id + "_shortname"] = shortname;
                            room[vm.id + "_name"] = shortname + "_" + room[vm.id + "_number"];
                            room[vm.id + "_address"] = address;
                            if(data["error"]) {
                                room[vm.id + "_lat"] = 0;
                                room[vm.id + "_lon"] = 0;
                            } else {
                                room[vm.id + "_lat"] = data["lat"];
                                room[vm.id + "_lon"] = data["lon"];
                            }
                        }
                        fulfill(toReturn);
                    })
                });

            }).catch(function(err: any){
                Log.error("Error in RoomParser.parse() [JSZip.async()]");
                reject(err);
            })
        })
    }

    public genRoom(trNode: any): Room {
        var vm = this;
        var room: Room = {};

        room[vm.id + "_number"] = trNode["childNodes"][1]["childNodes"][1]["childNodes"][0]["value"];
        room[vm.id + "_href"] = trNode["childNodes"][1]["childNodes"][1]["attrs"][0]["value"];
        room[vm.id + "_seats"] = Number((trNode["childNodes"][3]["childNodes"][0]["value"]).trim());
        room[vm.id + "_furniture"] = (trNode["childNodes"][5]["childNodes"][0]["value"]).trim();
        room[vm.id + "_type"]  = (trNode["childNodes"][7]["childNodes"][0]["value"]).trim();

        return room;
    }

    public checkNodeAttrs(node: any, attrName: string, attrValue: string): boolean {
        if(node["attrs"]) {
            let attrs: any = node["attrs"];
            for(let attr of attrs) {
                if (attr["name"] === attrName && attr["value"].indexOf(attrValue) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
}