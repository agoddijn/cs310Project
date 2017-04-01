/**
 * Created by alexgoddijn on 27/01/2017.
 */

import {Log, validCourseKeys, validRoomKeys, numKeys} from '../Util';
import {Course, QueryRequest, Body, Room, InsightResponse} from './IInsightFacade';
import {IQueryGenerator} from "./IQueryGenerator";
import FileSystem from "./FileSystem";
import {isNullOrUndefined} from "util";


export default class QueryGenerator implements IQueryGenerator {

    courseQuery: boolean;
    roomQuery: boolean;
    newValidKeys: string[];

    constructor() {
        Log.trace("QueryGenerator::init()");
    }

    public checkQuery(query: QueryRequest): Promise<string> {
        var vm = this;

        return new Promise(function(fulfill, reject) {

            if (!(Object.prototype.toString.call(query) === '[object Object]')) reject({code: 400, body: {error: "Invalid Query: query is not an object"}});

            let res: [boolean, string];
            let hasTransformations = false;

            // Check Basic Transformations format
            if (query["TRANSFORMATIONS"]) {
                hasTransformations = true;
                res = vm.checkTransformationsBasic(query["TRANSFORMATIONS"]);
                if (!res[0]) reject({code: 400, body: {error: "Invalid query: " + res[1]}});
                vm.newValidKeys = vm.collectNewKeys(query["TRANSFORMATIONS"], reject);
                for (let keys of vm.newValidKeys) {
                    if (keys.includes("_")) reject({code: 400, body: {error: "Invalid query: _ not allowed in apply keys"}});
                }
            }

            // Check basic Options format
            if (query["OPTIONS"]) {
                res = vm.checkOptionsBasic(query["OPTIONS"]);
                if (!res[0]) reject({code: 400, body: {error: "Invalid query: " + res[1]}});
            } else reject({code: 400, body: {error: "Invalid query: no options found"}});

            // Check GROUP keys not in APPLY
            if (hasTransformations) {
                res = vm.checkGroupKeysNotInApply(query["TRANSFORMATIONS"]["GROUP"]);
                if(!res[0]) reject({code: 400, body: {error: "Invalid query: " + res[1]}});
            }

            // Check ID's
            vm.checkId(query).then(function(ids: string[]) {
                FileSystem.checkFiles(ids).then(function(missing: string[]) {
                    if (missing.length == 0) {

                        // Check multiple datasets
                        if (ids.indexOf("rooms") >= 0 && ids.indexOf("courses") >= 0) {
                            reject({code: 400, body: {error: "Invalid query: Querying multiple datasets"}});
                        }

                        // Check columns
                        if (hasTransformations) {
                            res = vm.checkColumns(query["OPTIONS"]["COLUMNS"], query["TRANSFORMATIONS"]);
                        } else {
                            res = vm.checkColumns(query["OPTIONS"]["COLUMNS"], null);
                        }
                        if(!res[0]) reject({code: 400, body: {error: "Invalid query: " + res[1]}});

                        // Check Where
                        res = vm.checkBody(query["WHERE"]);
                        if(!res[0]) reject({code: 400, body: {error: "Invalid query: " + res[1]}});

                        // Check apply tokens
                        if (hasTransformations) {
                            res = vm.checkApply(query["TRANSFORMATIONS"]["APPLY"]);
                            if (!res[0]) reject({code: 400, body: {error: "Invalid query: " + res[1]}});
                        }

                        // Check Query Body
                        if (query["WHERE"]) {
                            res = vm.checkBody(query["WHERE"]);
                            if (!res[0]) reject({code: 400, body: {error: "Invalid query: " + res[1]}});
                        } else reject({code: 400, body: {error: "Invalid query: where is missing"}});

                        fulfill(ids[0]);

                    } else {
                        Log.error("Missing " + JSON.stringify(missing));
                        reject({code: 424, body: {missing: missing}});
                    }

                }).catch(function(err: any) {
                    Log.error(err.message);
                    reject({code: 400, body: {error: "Could not check files"}});
                });

            }).catch(function(err: any) {
                Log.error(err.message);
                reject({code: 400, body: {error: "Could not check id"}});
            });
        });
    }

    /*
     * <---------------------- CheckQuery helper functions ----------------------------->
     */

    /**
     * Check validity of a query body.
     *
     * @param body  The query to be checked.
     *
     * @returns A promise that fulfills with true if query body is valid, false otherwise
     * @returns Rejects with an error if error occurs
     *
     */
    public checkBody(body: Body): [boolean, string] {
        var vm = this;
        if (!(Object.prototype.toString.call(body) === '[object Object]')) return [false, "body is not an object"];
        for (let key in body) {
            if (key === "AND" || key === "OR") {
                let res: [boolean, string] = vm.checkLogicComparison(body[key]);
                if (!res[0]) return res;
            }
            else if (key === "GT" || key === "LT" || key === "EQ") {
                let res: [boolean, string] = vm.checkMComparison(body[key]);
                if (!res[0]) return res;
            }
            else if (key === "IS") {
                let res: [boolean, string] = vm.checkSComparison(body[key]);
                if (!res[0]) return res;
            }
            else if (key === "NOT") {
                let res: [boolean, string] = vm.checkNegation(body[key]);
                if (!res[0]) return res;
            }
            else return [false, "token not supported"];
        }
        return [true, ""];
    }

    /**
     * Check validity of a query logic comparison.
     *
     * @param lcomp  The query to be checked.
     *
     * @returns A promise that fulfills with true if query logic comparator is valid, false otherwise
     * @returns Rejects with an error if error occurs
     *
     */
    public checkLogicComparison(lcomp: any): [boolean, string] {
        var vm = this;
        if (!(Object.prototype.toString.call(lcomp) === '[object Array]')) return [false, "logic comparison is not object"];
        if (lcomp.length == 0) return [false, "logic comparison is empty"];
        for (let filter of lcomp) {
            let res: [boolean, string] = vm.checkBody(filter);
            if(!res[0]) return res;
        }
        return [true, ""];
    }

    /**
     * Check validity of a query m comparison.
     *
     * @param mcomp  The query to be checked.
     *
     * @returns A promise that fulfills with true if query m comparator is valid, false otherwise
     * @returns Rejects with an error if error occurs
     *
     */
    public checkMComparison(mcomp: any): [boolean, string] {
        var vm = this;
        if (Object.keys(mcomp).length > 1) return [false, "more than one key in m comparison"];
        for (let key in mcomp) {
            if (!vm.isNum(key)) return [false, "m comparator should have number key"];
            let res: [boolean, string] = vm.checkKey(key);
            if(!res[0]) return res;
            if(!(Object.prototype.toString.call(mcomp[key]) === '[object Number]')) return [false, "m comparison key is not a number"];
            res = vm.checkValueType(key, mcomp[key]);
            if(!res[0]) return res;
        }
        return [true, ""];
    }

    /**
     * Check validity of a query string comparison.
     *
     * @param scomp  The query to be checked.
     *
     * @returns A promise that fulfills with true if query string comparator is valid, false otherwise
     * @returns Rejects with an error if error occurs
     *
     */
    public checkSComparison(scomp: any): [boolean, string] {
        var vm = this;
        if (Object.keys(scomp).length > 1) return [false, "scomp has more than one key"];
        for (let key in scomp) {
            if(vm.isNum(key)) return [false, "s comparator should have stirng key"];
            let res: [boolean, string] = vm.checkKey(key);
            if(!res[0]) return res;
            if(!(typeof scomp[key] === "string")) return [false, "scomp key is not a string"];
            res = vm.checkValueType(key, scomp[key]);
            if(!res[0]) return res;
        }
        return [true, ""];
    }

    /**
     * Check validity of a query negation.
     *
     * @param neg  The query to be checked.
     *
     * @returns A promise that fulfills with true if query string comparator is valid, false otherwise
     * @returns Rejects with an error if error occurs
     *
     */
    public checkNegation(neg: any): [boolean, string] {
        var vm = this;
        if (!(Object.prototype.toString.call(neg) === '[object Object]')) return [false, "negation is not an object"];
        return vm.checkBody(neg);
    }

    /**
     * Check validity of a course key.
     *
     * @param key  The key to be checked.
     *
     * @returns A promise that fulfills with true if key is valid, false otherwise
     * @returns Rejects with an error if error occurs
     *
     */
    public checkCourseKey(key: string): [boolean, string] {
        for(let validKey of validCourseKeys) {
            if (key.indexOf(validKey) >= 0)  return [true, ""];
        }
        return [false, key + " is not a valid course key"];
    }

    /**
     * Check validity of a room key.
     *
     * @param key  The key to be checked.
     *
     * @returns A promise that fulfills with true if key is valid, false otherwise
     * @returns Rejects with an error if error occurs
     *
     */
    public checkRoomKey(key: string): [boolean, string] {
        for(let validKey of validRoomKeys) {
            if (key.indexOf(validKey) >= 0) return [true,""];
        }
        return [false, key + " is not a valid room key"];
    }

    /**
     * Checks the key, if it is a valid key for the query type
     *
     * @param key
     * @returns {boolean}
     */
    public checkKey(key: string): [boolean, string] {
        var vm = this;
        if (key.substring(0, key.indexOf("_")) === "courses") vm.courseQuery = true;
        if (key.substring(0, key.indexOf("_")) === "rooms") vm.roomQuery = true;
        if (vm.courseQuery && vm.roomQuery) return [false, "cannot query two databases"];
        if (!isNullOrUndefined(vm.newValidKeys)) {
            for (let validNewKey of vm.newValidKeys) {
                if (key === validNewKey) return [true, ""];
            }
        }
        if (vm.roomQuery && key.substring(0, key.indexOf("_")) === "rooms") {
            return vm.checkRoomKey(key);
        } else if (vm.courseQuery && key.substring(0, key.indexOf("_")) === "courses") {
            return vm.checkCourseKey(key);
        } else {
            return [true, ""];
        }
    }

    /**
     * Check the value to see if it is of valid type for given key
     *
     * @param key Key who'se value is to be checked
     * @param value The value to be tested
     *
     * @returns true if value is of correct type, false otherwise
     */
    public checkValueType(key: string, value: any): [boolean, string] {
        var vm = this;
        if (vm.isNum(key) && !(Object.prototype.toString.call(value) === '[object Number]')) return [false, key + " does not match type of value"];
        return [true, ""];
    }

    /**
     * Check basic options format
     *
     * @param options
     * @returns {any}
     */
    public checkOptionsBasic(options: any): [boolean, string] {
        var vm = this;
        let res: [boolean, string];
        if (!("COLUMNS" in options)) return [false, "columns is missing"];
        if (!(Object.prototype.toString.call(options["COLUMNS"]) === '[object Array]')) return [false, "columns is not an array"];
        if (!(options["COLUMNS"].length > 0)) return [false, "columns is empty"];
        if (!("FORM" in options)) return [false, "forms is missing"];
        res = vm.checkForm(options["FORM"]);
        if(!res[0]) return res;
        if (options["ORDER"]) {
            res = vm.checkOrder(options["ORDER"], options["COLUMNS"]);
            if(!res[0]) return res;
        }
        return [true, ""];
    }


    /**
     * Check validity of the columns.
     *
     * @param columns  The columns to be checked.
     *
     * @returns A promise that fulfills with true if column keys are valid, false otherwise
     * @returns Rejects with an error if error occurs
     *
     */
    public checkColumns(columns: any, transformations: any): [boolean, string] {
        var vm = this;
        for (let key of columns) {
            let res: [boolean, string] = vm.checkKey(key);
            if (!res[0]) return res;
            if (!isNullOrUndefined(transformations)) {
                // Check if key is in either APPLY or GROUP
                let inApplyorGroup: boolean = false;
                for (let newKey of vm.newValidKeys) {
                    if (key === newKey) inApplyorGroup = true;
                }
                if (transformations["GROUP"]) {
                    for (let groupKey of transformations["GROUP"]) {
                        if (key === groupKey) inApplyorGroup = true;
                    }
                } else {

                }

                if (!inApplyorGroup) return [false, "columns key must be in apply or group"];
            }
        }
        return [true, ""];
    }

    /**
     * Check validity of a query order.
     *
     * @param order  The order key to be checked.
     * @param columns The list of column keys
     *
     * @returns A promise that fulfills with true if order key is in columns, false otherwise
     * @returns Rejects with an error if error occurs
     *
     */
    public checkOrder(order: any, columns: string[]): [boolean, string] {
        var vm = this;
        if (typeof(order) === 'string') {
            for (let column of columns) {
                if (order === column)  return [true, ""];
            }
            return [false, "order is not in column"];
        } else if ((Object.prototype.toString.call(order) === '[object Object]')) {
            if (!order["dir"]) return [false, "dir is missing"];
            if (!order["keys"]) return [false, "keys are missing"];
            let res: [boolean, string] = vm.checkDir(order["dir"]);
            if (!res[0]) return res;
            res = vm.checkOrderKeys(order["keys"], columns);
            if (!res[0]) return res;
            return [true, ""];
        } else return [false, "order no correct format"];
    }

    /**
     * Check validity of direction
     *
     * @param dir Direction to check
     * @returns {any} True if valid, false otherwise
     */
    public checkDir(dir: string): [boolean, string] {
        if (!(typeof(dir) === 'string')) return [false, "direction not a string"];
        if (!(dir === "UP" || dir === "DOWN")) return [false, "direction not valid"];
        return [true, ""];
    }

    /**
     * Check validity of order keys
     *
     * @param keys order keys to check
     * @returns {any} True if valid, false otherwise
     */
    public checkOrderKeys(keys: any, columns: any): [boolean, string] {
        var vm = this;
        if (!(Object.prototype.toString.call(keys) === '[object Array]')) return [false, "keys is not an array"];
        if (keys.length == 0) return [false, "keys is empty"];
        var res: [boolean, string];
        for (let key of keys) {
            res = vm.checkKey(key);
            if (!res[0]) return res;
            if (columns.indexOf(key) < 0) return [false, "Order key must be in columns"];
        }
        return [true, ""];
    }

    /**
     * Check validity of a form key.
     *
     * @param form  The key to be checked.
     *
     * @returns A promise that fulfills with true if key is TABLE, false otherwise
     * @returns Rejects with an error if error occurs
     *
     */
    public checkForm(form: string): [boolean, string] {
        let valid = form === "TABLE";
        if (valid) return [true, ""];
        return [false, "form value is not table"];
    }


    /**
     * Check some basic transformations properties
     *
     * @param transformations
     * @returns {any}
     */
    public checkTransformationsBasic(transformations: any): [boolean, string] {
        if (!("GROUP" in transformations)) return [false, "group is missing from transformations"];
        if (!("APPLY" in transformations)) return [false, "apply is missing from transformations"];
        let group = transformations["GROUP"];
        if (!(Object.prototype.toString.call(group) === '[object Array]')) return [false, "group is not an array"];
        if (!(group.length > 0)) return [false, "group is empty"];
        return [true, ""];
    }


    /**
     * Checks that group keys are not in apply
     *
     * @param group
     * @returns {any}
     */
    public checkGroupKeysNotInApply(group: any): [boolean, string] {
        var vm = this;
        for (let groupKey of group) {
            for (let applyKey of vm.newValidKeys) {
                if (groupKey === applyKey) return [false, "Group key cannot be applyKey"];
            }
        }
        return [true, ""];
    }

    /**
     * Check if apply is valid
     *
     * @param apply The apply to be validated
     * @returns {boolean} True if valiud, false otherwise
     */
    public checkApply(apply: any): [boolean, string] {
        var vm = this;
        if (!(Object.prototype.toString.call(apply) === '[object Array]')) return [false, "apply is not an array"];
        for (let applyKey of apply) {
            let res: [boolean, string] = vm.checkApplyKey(applyKey);
            if (!res[0]) return res;
        }
        return [true, ""];
    }

    /**
     * Check if applyKey is valid
     *
     * @param applyKey the applyKey to be validated
     * @returns {boolean} True if valid, false otherwise
     */
    public checkApplyKey(applyKey: any): [boolean, string] {
        var vm = this;
        if (!(Object.prototype.toString.call(applyKey) === '[object Object]')) return [false, "applykey is not an object"];
        //made changes for uranium
        if(!(Object.keys(applyKey).length == 1)) return [false, "apply key is malformed"]
        for (let key in applyKey) {
            if (!(typeof key === "string")) return [false, "applykey key is not a string"];
            if (key.includes("_")) return [false, "applyKey cannot contain _"];
        }
        let res: [boolean, string];
        for (let applyTokenKey in applyKey) {
            let applyToken = applyKey[applyTokenKey];
            res = vm.checkApplyToken(applyToken);
            if (!res[0]) return res;
        }
        return [true, ""];
    }

    /**
     * Check if applytoken is valid
     *
     * @param applyToken The applyToken to be validated
     * @returns {boolean} True if valid, false otherwise
     */
    public checkApplyToken(applyToken: any): [boolean, string] {
        var vm = this;
        if (!(Object.prototype.toString.call(applyToken) === '[object Object]')) return [false, "apply token is not an object"];
        let res: [boolean, string];
        if(!(Object.keys(applyToken).length == 1)) return [false, "apply token is malformed"];
        for (let key in applyToken) {
            if (!((key === "MAX") || (key === "MIN") ||
                (key === "AVG") || (key === "COUNT") || (key === "SUM"))) return [false, "apply token value is not valid"];
            res = vm.checkApplyTokenType(applyToken);
            if(!res[0]) return res;
        }
        return [true, ""];
    }

    /**
     * Check if types of applyTokens are correct
     *
     * @param applyToken applytoken to check
     * @returns {any} true if valid, false otherwise
     */
    public checkApplyTokenType(applyToken: any): [boolean, string] {
        var vm = this;
        for (let key in applyToken) {
            if (key === "MAX" || key === "MIN" || key === "AVG" || key === "SUM") {
                for (let keyValKey in applyToken) {
                    let keyVal = applyToken[keyValKey];
                    if (!vm.isNum(keyVal)) return [false, "incorrect type for applyToken"];
                }
            }
        }
        return [true, ""];
    }

    /**
     * Get the unique new keys defined in transformations
     *
     * @param transformations The place from which to collect keys
     * @return a string array of unique keys
     */
    public collectNewKeys(transformations: any, reject: any): string[] {
        var toReturn: string[] = [];
        if (transformations["APPLY"]) {
            for (let applyObj of transformations["APPLY"]) {
                for (let applyKey in applyObj) {
                    if (toReturn.indexOf(applyKey) >= 0) reject({code: 400, body: {error: "Duplicate apply keys"}});
                    toReturn.push(applyKey);
                }
            }
        }
        return toReturn;
    }

    /*
     * <---------------------- END CheckQuery helper functions ----------------------------->
     */


    public checkId(query: QueryRequest): Promise<string[]> {
        var vm = this;
        return new Promise(function(fulfill, reject) {
            var toReturn : string[] = new Array<string>();
            var toCheck: any = new Array();
            toCheck.push(query["WHERE"]);
            toCheck.push(query["OPTIONS"]);
            toCheck.push(query["TRANSFORMATIONS"]);
            while(!(toCheck.length == 0)) {
                try {
                    let cur = toCheck.pop();
                    if (Object.prototype.toString.call(cur) === '[object Array]') {
                        for (let obj of cur) {
                            toCheck.push(obj);
                        }
                    } else if (Object.prototype.toString.call(cur) === '[object Object]') {
                        for (let key in cur) {
                            let added: boolean = false;
                            if (key === "ORDER") added = true;
                            if(key.includes("_")) {
                                toReturn.push(key.substring(0, key.indexOf("_")));
                                added = true;
                            }
                            if (!added) {
                                toCheck.push(cur[key]);
                            }
                        }
                    } else if (typeof(cur) === "string") {
                        if (vm.checkCourseKey(cur)[0] || vm.checkRoomKey(cur)[0]) {
                            toReturn.push(cur.substring(0, cur.indexOf("_")));
                        }
                    }
                } catch(err) {
                    Log.error("Error in QueryGenerator.checkId()");
                    reject(err);
                }
            }

            fulfill(toReturn);
        });
    }


    public filter(list: Course[] | Room[], query: QueryRequest): Promise<Array<{}>> {
        var vm = this;
        return new Promise(function(fulfill, reject) {
            let filter = query["WHERE"];
            var filtered: Course[] | Room[] = new Array<Course | Room>();

            for (let item of list) {
                if(vm.filterOne(item, filter)) filtered.push(item);
            }

            if(query["TRANSFORMATIONS"]) {
                try {
                    filtered = vm.group(filtered, query);
                } catch (err) {
                    Log.error("Error in QueryGenerator.filter() [group()]");
                    reject(err);
                }
            }

            vm.sort(filtered, query["OPTIONS"]).then(function(sorted: Course[] | Room[]) {

                vm.columns(sorted, query["OPTIONS"]["COLUMNS"]).then(function(toReturn: Array<{}>) {
                    fulfill(toReturn);
                }).catch(function(err: any) {
                    Log.error("Error in QueryGenerator.filter() [QueryGenerator.columns()]");
                    reject(err);
                });

            }).catch(function(err: any) {
                Log.error("Error in QueryGenerator.filter() [QueryGenerator.sort()]");
                reject(err);
            });
        });
    }

    /*
     * <---------------------- Filter helper functions ----------------------------->
     */

    /**
     * Filter a course given a filter object.
     *
     * @param item  The data to be filtered.
     * @param filter The query to filter against
     *
     * @returns
     * @returns Rejects with an error if error occurs
     *
     */
    public filterOne(item: Course | Room, filter: any): boolean {
        var vm = this;
        for (let key in filter) {
            if (key === 'AND') {
                let toReturn = true;
                for (let filt of filter[key]) {
                    let pass = vm.filterOne(item, filt);
                    toReturn = toReturn && pass;
                }
                return toReturn;
            } else if (key === 'OR') {
                let toReturn = false;
                for (let filt of filter[key]) {
                    let pass = vm.filterOne(item, filt);
                    toReturn = toReturn || pass;
                }
                return toReturn;
            } else if (key === 'GT') {
                for (let critKey in filter[key]) {
                    if (item[critKey] <= filter[key][critKey]) return false;
                    return true;
                }
            } else if (key === 'LT') {
                for (let critKey in filter[key]) {
                    if (item[critKey] >= filter[key][critKey]) return false;
                    return true;
                }
            } else if (key === 'EQ') {
                for (let critKey in filter[key]) {
                    if (item[critKey] != filter[key][critKey]) return false;
                    return true;
                }
            } else if (key === 'IS') {
                for (let critKey in filter[key]) {
                    let crit = filter[key][critKey];
                    let comp = item[critKey];
                    if (crit.length == 0) return comp === "";
                    if (crit.length == 1) return comp.indexOf("*") >= 0;
                    if (crit.startsWith("*")) {
                        if (crit.endsWith("*")) {
                            // Wildcard at both ends
                            crit = crit.substring(1, crit.length - 1);
                            return comp.includes(crit);
                        } else {
                            // Wildcard in front
                            crit = crit.substring(1, crit.length);
                            return comp.endsWith(crit);
                        }
                    } else {
                        if (crit.endsWith("*")) {
                            // Wildcard behind
                            crit = crit.substring(0, crit.length - 1);
                            return comp.startsWith(crit);
                        } else {
                            // No wildcard
                            return comp === crit;
                        }
                    }
                }
            } else if (key === 'NOT') {
                let pass = vm.filterOne(item, filter[key]);
                return !pass;
            }
        }
        return true;
    }

    /*
     * <---------------------- END Filter helper functions ----------------------------->
     */


    public sort(items: Course[] | Room[], options: any): Promise<Course[] | Room[]> {
        var vm = this;
        return new Promise(function(fulfill, reject) {
            try {
                if (options["ORDER"]) {
                    let crit = options["ORDER"];
                    if ((Object.prototype.toString.call(crit) === '[object Object]')) {
                        let dirString: string = crit["dir"];
                        let dir: number;
                        if (dirString === "UP") dir = 1;
                        else dir = -1;
                        fulfill(items.sort(vm.propComparator(crit["keys"], dir)));
                    } else {
                        if (vm.isNum(crit)) {
                            fulfill(items.sort(function (a: Course, b: Course) {
                                return a[crit] - b[crit];
                            }));
                        } else {
                            fulfill(items.sort(function (a: Course, b: Course) {
                                if (a[crit] > b[crit]) return 1;
                                if (a[crit] < b[crit]) return -1;
                                return 0;
                            }));
                        }
                    }
                } else {
                    fulfill(items);
                }
            } catch (err) {
                Log.error("Error in QueryGenerator [sort()]");
                Log.error(err.message);
                reject(err);
            }
        });
    }

    /*
     * <---------------------- Sort helper functions ----------------------------->
     */

    /**
     * A property comparator function for sort
     *
     * @param crit The property to be sorted against
     * @param dir The direction of sorting
     * @returns {(a:Course, b:Course)=>(number|number|number|number)}
     */
    public propComparator(crit: Array<string>, dir: number): any {
        let vm = this;
        return function (a: Course, b: Course) {
            for (let c of crit) {
                if (vm.isNum(c)) {
                    let toReturn: number = dir*(a[c] - b[c]);
                    if (toReturn != 0) return toReturn;
                } else {
                    if (a[c] > b[c]) return dir*1;
                    if (a[c] < b[c]) return dir*-1;
                }
            }
            return 0;
        }
    }

    /**
     * Checks if a given key is a number key
     *
     * @param key The key
     * @returns {boolean} true if it is a number key, false otherwise
     */
    public isNum(key: string): boolean {
        var vm = this;
        for(let numKey of numKeys) {
            if (key.indexOf(numKey) >= 0)  return true;
        }
        if (!isNullOrUndefined(vm.newValidKeys)) {
            for (let newKey of vm.newValidKeys) {
                if (key.indexOf(newKey) >= 0) return true;
            }
        }
        return false;
    }

    /*
     * <---------------------- END sort helper functions ----------------------------->
     */

    public columns(courses: Course[] | Room[], columns: string[]): Promise<Array<{}>> {
        return new Promise(function(fulfill, reject) {
            let toReturn: Array<{}> = new Array();
            try {
                for (let course of courses) {
                    var obj: any = {};
                    for (let crit of columns) {
                        obj[crit] = course[crit];
                    }
                    toReturn.push(obj);
                }
                fulfill(toReturn);
            } catch (err) {
                Log.error("Error in QueryGenerator [columns()]");
                Log.error(err.message);
                reject(err);
            }
        });
    }

    public group(list: Course[] | Room[], query: QueryRequest): Array<{}> {
        try {
            let vm = this;
            let grouped: any = {};
            let groupList: Array<string> = query["TRANSFORMATIONS"]["GROUP"];
            // Form [newKey, op, key]
            let applyKeys: Array<[string, string, string]> = vm.getApplyInfo(query["TRANSFORMATIONS"]["APPLY"]);
            let numApplyKeys = applyKeys.length;
            for (let item of list) {
                // Create one groupItem for each combination
                let groupItem = "";
                for (let group of groupList) {
                    groupItem += (item[group] + "~");
                }

                // Check if this combination has been added
                if (!grouped[groupItem]) { // not previously added
                    let toPush: any = {};
                    for (let group of groupList) {
                        toPush[group] = item[group];
                    }
                    grouped[groupItem] = toPush;
                }

                if (numApplyKeys != 0) { // there are applykeys
                    for (let applyItem of applyKeys) {
                        let group: any = grouped[groupItem];
                        if (group[applyItem[0]] || group[applyItem[0] + ';count']) { // applyItem already added
                            if (applyItem[1] === "MAX") {
                                if (item[applyItem[2]] > group[applyItem[0]]) group[applyItem[0]] = item[applyItem[2]];
                            } else if (applyItem[1] === "MIN") {
                                if (item[applyItem[2]] < group[applyItem[0]]) group[applyItem[0]] = item[applyItem[2]];
                            } else if (applyItem[1] === "AVG") {
                                let val: number = 10 * item[applyItem[2]];
                                group[applyItem[0]] += Number(val.toFixed(0));
                                group[applyItem[0] + ";avg"] += 1;
                            } else if (applyItem[1] === "SUM") {
                                group[applyItem[0]] += item[applyItem[2]];
                            } else if (applyItem[1] === "COUNT") {
                                if (!group[applyItem[0]+ ';count'][item[applyItem[2]]]) {
                                    group[applyItem[0] + ';count'][item[applyItem[2]]] = 1;
                                }
                            }
                        } else { // applyItem not added
                            if (applyItem[1] !== "COUNT") {
                                if (applyItem[1] === "AVG") {
                                    let val: number = 10 * item[applyItem[2]];
                                    group[applyItem[0]] = Number(val.toFixed(0));
                                    group[applyItem[0] + ";avg"] = 1;
                                } else {
                                    group[applyItem[0]] = item[applyItem[2]];
                                }
                            } else {
                                group[applyItem[0] + ';count'] = {};
                                group[applyItem[0] + ';count'][item[applyItem[2]]] = 1;
                            }
                        }
                    }
                }

            }

            let toReturn: Array<{}> = vm.applyAveragesAndCount(grouped);

            return toReturn;
        } catch (err) {
            Log.error("Error in QueryGenerator.group()");
            throw err;
        }
    }

    /*
     * <---------------------- Group helper functions ----------------------------->
     */

    /**
     * Applies the average and count for the appropriate keys
     *
     * @param grouped The list of grouped items
     *
     * @modifies grouped
     * @returns an array of the objects in grouped
     */
    public applyAveragesAndCount(grouped: any): Array<{}> {
        let toReturn: Array<{}> = new Array();
        for (let groupKey in grouped) {
            let group = grouped[groupKey];
            for (let key in group) {
                if (key.includes(";avg")) {
                    let avgKey = key.substring(0,key.indexOf(";"));
                    let count = group[key];
                    let avg = group[avgKey];
                    avg = avg / count;
                    avg = avg / 10;
                    avg = Number(avg.toFixed(2));
                    group[avgKey] = avg;
                    delete group[key];
                }
                if (key.includes(";count")) {
                    let countKey = key.substring(0,key.indexOf(";"));
                    let count = Object.keys(group[key]).length;
                    group[countKey] = count;
                    delete group[key];
                }
            }
            toReturn.push(group);
        }
        return toReturn;
    }


    /**
     * Gets all the apply information given the apply query
     *
     * @param apply The apply query
     * @returns {Array<[string,string,string]>} The apply object
     *
     * Apply object returned in form [newKey, operation, key]
     */
    public getApplyInfo(apply: any): Array<[string, string, string]> {
        let toReturn: Array<[string, string, string]> = new Array<[string, string, string]>();
        for (let applyObj of apply) {
            let newKey: string, op: string, key: string;
            for (let val in applyObj) {
                newKey = val;
                for (let obj in applyObj[val]) {
                    op = obj;
                    key = applyObj[val][obj];
                }
            }
            toReturn.push([newKey, op, key]);
        }
        return toReturn;
    }


    /*
     * <---------------------- END sort helper functions ----------------------------->
     */

}