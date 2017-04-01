"use strict";
var Util_1 = require("../Util");
var FileSystem_1 = require("./FileSystem");
var util_1 = require("util");
var QueryGenerator = (function () {
    function QueryGenerator() {
        Util_1.Log.trace("QueryGenerator::init()");
    }
    QueryGenerator.prototype.checkQuery = function (query) {
        var vm = this;
        return new Promise(function (fulfill, reject) {
            if (!(Object.prototype.toString.call(query) === '[object Object]'))
                reject({ code: 400, body: { error: "Invalid Query: query is not an object" } });
            var res;
            var hasTransformations = false;
            if (query["TRANSFORMATIONS"]) {
                hasTransformations = true;
                res = vm.checkTransformationsBasic(query["TRANSFORMATIONS"]);
                if (!res[0])
                    reject({ code: 400, body: { error: "Invalid query: " + res[1] } });
                vm.newValidKeys = vm.collectNewKeys(query["TRANSFORMATIONS"], reject);
                for (var _i = 0, _a = vm.newValidKeys; _i < _a.length; _i++) {
                    var keys = _a[_i];
                    if (keys.includes("_"))
                        reject({ code: 400, body: { error: "Invalid query: _ not allowed in apply keys" } });
                }
            }
            if (query["OPTIONS"]) {
                res = vm.checkOptionsBasic(query["OPTIONS"]);
                if (!res[0])
                    reject({ code: 400, body: { error: "Invalid query: " + res[1] } });
            }
            else
                reject({ code: 400, body: { error: "Invalid query: no options found" } });
            if (hasTransformations) {
                res = vm.checkGroupKeysNotInApply(query["TRANSFORMATIONS"]["GROUP"]);
                if (!res[0])
                    reject({ code: 400, body: { error: "Invalid query: " + res[1] } });
            }
            vm.checkId(query).then(function (ids) {
                FileSystem_1.default.checkFiles(ids).then(function (missing) {
                    if (missing.length == 0) {
                        if (ids.indexOf("rooms") >= 0 && ids.indexOf("courses") >= 0) {
                            reject({ code: 400, body: { error: "Invalid query: Querying multiple datasets" } });
                        }
                        if (hasTransformations) {
                            res = vm.checkColumns(query["OPTIONS"]["COLUMNS"], query["TRANSFORMATIONS"]);
                        }
                        else {
                            res = vm.checkColumns(query["OPTIONS"]["COLUMNS"], null);
                        }
                        if (!res[0])
                            reject({ code: 400, body: { error: "Invalid query: " + res[1] } });
                        res = vm.checkBody(query["WHERE"]);
                        if (!res[0])
                            reject({ code: 400, body: { error: "Invalid query: " + res[1] } });
                        if (hasTransformations) {
                            res = vm.checkApply(query["TRANSFORMATIONS"]["APPLY"]);
                            if (!res[0])
                                reject({ code: 400, body: { error: "Invalid query: " + res[1] } });
                        }
                        if (query["WHERE"]) {
                            res = vm.checkBody(query["WHERE"]);
                            if (!res[0])
                                reject({ code: 400, body: { error: "Invalid query: " + res[1] } });
                        }
                        else
                            reject({ code: 400, body: { error: "Invalid query: where is missing" } });
                        fulfill(ids[0]);
                    }
                    else {
                        Util_1.Log.error("Missing " + JSON.stringify(missing));
                        reject({ code: 424, body: { missing: missing } });
                    }
                }).catch(function (err) {
                    Util_1.Log.error(err.message);
                    reject({ code: 400, body: { error: "Could not check files" } });
                });
            }).catch(function (err) {
                Util_1.Log.error(err.message);
                reject({ code: 400, body: { error: "Could not check id" } });
            });
        });
    };
    QueryGenerator.prototype.checkBody = function (body) {
        var vm = this;
        if (!(Object.prototype.toString.call(body) === '[object Object]'))
            return [false, "body is not an object"];
        for (var key in body) {
            if (key === "AND" || key === "OR") {
                var res = vm.checkLogicComparison(body[key]);
                if (!res[0])
                    return res;
            }
            else if (key === "GT" || key === "LT" || key === "EQ") {
                var res = vm.checkMComparison(body[key]);
                if (!res[0])
                    return res;
            }
            else if (key === "IS") {
                var res = vm.checkSComparison(body[key]);
                if (!res[0])
                    return res;
            }
            else if (key === "NOT") {
                var res = vm.checkNegation(body[key]);
                if (!res[0])
                    return res;
            }
            else
                return [false, "token not supported"];
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkLogicComparison = function (lcomp) {
        var vm = this;
        if (!(Object.prototype.toString.call(lcomp) === '[object Array]'))
            return [false, "logic comparison is not object"];
        if (lcomp.length == 0)
            return [false, "logic comparison is empty"];
        for (var _i = 0, lcomp_1 = lcomp; _i < lcomp_1.length; _i++) {
            var filter = lcomp_1[_i];
            var res = vm.checkBody(filter);
            if (!res[0])
                return res;
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkMComparison = function (mcomp) {
        var vm = this;
        if (Object.keys(mcomp).length > 1)
            return [false, "more than one key in m comparison"];
        for (var key in mcomp) {
            if (!vm.isNum(key))
                return [false, "m comparator should have number key"];
            var res = vm.checkKey(key);
            if (!res[0])
                return res;
            if (!(Object.prototype.toString.call(mcomp[key]) === '[object Number]'))
                return [false, "m comparison key is not a number"];
            res = vm.checkValueType(key, mcomp[key]);
            if (!res[0])
                return res;
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkSComparison = function (scomp) {
        var vm = this;
        if (Object.keys(scomp).length > 1)
            return [false, "scomp has more than one key"];
        for (var key in scomp) {
            if (vm.isNum(key))
                return [false, "s comparator should have stirng key"];
            var res = vm.checkKey(key);
            if (!res[0])
                return res;
            if (!(typeof scomp[key] === "string"))
                return [false, "scomp key is not a string"];
            res = vm.checkValueType(key, scomp[key]);
            if (!res[0])
                return res;
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkNegation = function (neg) {
        var vm = this;
        if (!(Object.prototype.toString.call(neg) === '[object Object]'))
            return [false, "negation is not an object"];
        return vm.checkBody(neg);
    };
    QueryGenerator.prototype.checkCourseKey = function (key) {
        for (var _i = 0, validCourseKeys_1 = Util_1.validCourseKeys; _i < validCourseKeys_1.length; _i++) {
            var validKey = validCourseKeys_1[_i];
            if (key.indexOf(validKey) >= 0)
                return [true, ""];
        }
        return [false, key + " is not a valid course key"];
    };
    QueryGenerator.prototype.checkRoomKey = function (key) {
        for (var _i = 0, validRoomKeys_1 = Util_1.validRoomKeys; _i < validRoomKeys_1.length; _i++) {
            var validKey = validRoomKeys_1[_i];
            if (key.indexOf(validKey) >= 0)
                return [true, ""];
        }
        return [false, key + " is not a valid room key"];
    };
    QueryGenerator.prototype.checkKey = function (key) {
        var vm = this;
        if (key.substring(0, key.indexOf("_")) === "courses")
            vm.courseQuery = true;
        if (key.substring(0, key.indexOf("_")) === "rooms")
            vm.roomQuery = true;
        if (vm.courseQuery && vm.roomQuery)
            return [false, "cannot query two databases"];
        if (!util_1.isNullOrUndefined(vm.newValidKeys)) {
            for (var _i = 0, _a = vm.newValidKeys; _i < _a.length; _i++) {
                var validNewKey = _a[_i];
                if (key === validNewKey)
                    return [true, ""];
            }
        }
        if (vm.roomQuery && key.substring(0, key.indexOf("_")) === "rooms") {
            return vm.checkRoomKey(key);
        }
        else if (vm.courseQuery && key.substring(0, key.indexOf("_")) === "courses") {
            return vm.checkCourseKey(key);
        }
        else {
            return [true, ""];
        }
    };
    QueryGenerator.prototype.checkValueType = function (key, value) {
        var vm = this;
        if (vm.isNum(key) && !(Object.prototype.toString.call(value) === '[object Number]'))
            return [false, key + " does not match type of value"];
        return [true, ""];
    };
    QueryGenerator.prototype.checkOptionsBasic = function (options) {
        var vm = this;
        var res;
        if (!("COLUMNS" in options))
            return [false, "columns is missing"];
        if (!(Object.prototype.toString.call(options["COLUMNS"]) === '[object Array]'))
            return [false, "columns is not an array"];
        if (!(options["COLUMNS"].length > 0))
            return [false, "columns is empty"];
        if (!("FORM" in options))
            return [false, "forms is missing"];
        res = vm.checkForm(options["FORM"]);
        if (!res[0])
            return res;
        if (options["ORDER"]) {
            res = vm.checkOrder(options["ORDER"], options["COLUMNS"]);
            if (!res[0])
                return res;
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkColumns = function (columns, transformations) {
        var vm = this;
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var key = columns_1[_i];
            var res = vm.checkKey(key);
            if (!res[0])
                return res;
            if (!util_1.isNullOrUndefined(transformations)) {
                var inApplyorGroup = false;
                for (var _a = 0, _b = vm.newValidKeys; _a < _b.length; _a++) {
                    var newKey = _b[_a];
                    if (key === newKey)
                        inApplyorGroup = true;
                }
                if (transformations["GROUP"]) {
                    for (var _c = 0, _d = transformations["GROUP"]; _c < _d.length; _c++) {
                        var groupKey = _d[_c];
                        if (key === groupKey)
                            inApplyorGroup = true;
                    }
                }
                else {
                }
                if (!inApplyorGroup)
                    return [false, "columns key must be in apply or group"];
            }
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkOrder = function (order, columns) {
        var vm = this;
        if (typeof (order) === 'string') {
            for (var _i = 0, columns_2 = columns; _i < columns_2.length; _i++) {
                var column = columns_2[_i];
                if (order === column)
                    return [true, ""];
            }
            return [false, "order is not in column"];
        }
        else if ((Object.prototype.toString.call(order) === '[object Object]')) {
            if (!order["dir"])
                return [false, "dir is missing"];
            if (!order["keys"])
                return [false, "keys are missing"];
            var res = vm.checkDir(order["dir"]);
            if (!res[0])
                return res;
            res = vm.checkOrderKeys(order["keys"], columns);
            if (!res[0])
                return res;
            return [true, ""];
        }
        else
            return [false, "order no correct format"];
    };
    QueryGenerator.prototype.checkDir = function (dir) {
        if (!(typeof (dir) === 'string'))
            return [false, "direction not a string"];
        if (!(dir === "UP" || dir === "DOWN"))
            return [false, "direction not valid"];
        return [true, ""];
    };
    QueryGenerator.prototype.checkOrderKeys = function (keys, columns) {
        var vm = this;
        if (!(Object.prototype.toString.call(keys) === '[object Array]'))
            return [false, "keys is not an array"];
        if (keys.length == 0)
            return [false, "keys is empty"];
        var res;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            res = vm.checkKey(key);
            if (!res[0])
                return res;
            if (columns.indexOf(key) < 0)
                return [false, "Order key must be in columns"];
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkForm = function (form) {
        var valid = form === "TABLE";
        if (valid)
            return [true, ""];
        return [false, "form value is not table"];
    };
    QueryGenerator.prototype.checkTransformationsBasic = function (transformations) {
        if (!("GROUP" in transformations))
            return [false, "group is missing from transformations"];
        if (!("APPLY" in transformations))
            return [false, "apply is missing from transformations"];
        var group = transformations["GROUP"];
        if (!(Object.prototype.toString.call(group) === '[object Array]'))
            return [false, "group is not an array"];
        if (!(group.length > 0))
            return [false, "group is empty"];
        return [true, ""];
    };
    QueryGenerator.prototype.checkGroupKeysNotInApply = function (group) {
        var vm = this;
        for (var _i = 0, group_1 = group; _i < group_1.length; _i++) {
            var groupKey = group_1[_i];
            for (var _a = 0, _b = vm.newValidKeys; _a < _b.length; _a++) {
                var applyKey = _b[_a];
                if (groupKey === applyKey)
                    return [false, "Group key cannot be applyKey"];
            }
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkApply = function (apply) {
        var vm = this;
        if (!(Object.prototype.toString.call(apply) === '[object Array]'))
            return [false, "apply is not an array"];
        for (var _i = 0, apply_1 = apply; _i < apply_1.length; _i++) {
            var applyKey = apply_1[_i];
            var res = vm.checkApplyKey(applyKey);
            if (!res[0])
                return res;
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkApplyKey = function (applyKey) {
        var vm = this;
        if (!(Object.prototype.toString.call(applyKey) === '[object Object]'))
            return [false, "applykey is not an object"];
        if (!(Object.keys(applyKey).length == 1))
            return [false, "apply key is malformed"];
        for (var key in applyKey) {
            if (!(typeof key === "string"))
                return [false, "applykey key is not a string"];
            if (key.includes("_"))
                return [false, "applyKey cannot contain _"];
        }
        var res;
        for (var applyTokenKey in applyKey) {
            var applyToken = applyKey[applyTokenKey];
            res = vm.checkApplyToken(applyToken);
            if (!res[0])
                return res;
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkApplyToken = function (applyToken) {
        var vm = this;
        if (!(Object.prototype.toString.call(applyToken) === '[object Object]'))
            return [false, "apply token is not an object"];
        var res;
        if (!(Object.keys(applyToken).length == 1))
            return [false, "apply token is malformed"];
        for (var key in applyToken) {
            if (!((key === "MAX") || (key === "MIN") ||
                (key === "AVG") || (key === "COUNT") || (key === "SUM")))
                return [false, "apply token value is not valid"];
            res = vm.checkApplyTokenType(applyToken);
            if (!res[0])
                return res;
        }
        return [true, ""];
    };
    QueryGenerator.prototype.checkApplyTokenType = function (applyToken) {
        var vm = this;
        for (var key in applyToken) {
            if (key === "MAX" || key === "MIN" || key === "AVG" || key === "SUM") {
                for (var keyValKey in applyToken) {
                    var keyVal = applyToken[keyValKey];
                    if (!vm.isNum(keyVal))
                        return [false, "incorrect type for applyToken"];
                }
            }
        }
        return [true, ""];
    };
    QueryGenerator.prototype.collectNewKeys = function (transformations, reject) {
        var toReturn = [];
        if (transformations["APPLY"]) {
            for (var _i = 0, _a = transformations["APPLY"]; _i < _a.length; _i++) {
                var applyObj = _a[_i];
                for (var applyKey in applyObj) {
                    if (toReturn.indexOf(applyKey) >= 0)
                        reject({ code: 400, body: { error: "Duplicate apply keys" } });
                    toReturn.push(applyKey);
                }
            }
        }
        return toReturn;
    };
    QueryGenerator.prototype.checkId = function (query) {
        var vm = this;
        return new Promise(function (fulfill, reject) {
            var toReturn = new Array();
            var toCheck = new Array();
            toCheck.push(query["WHERE"]);
            toCheck.push(query["OPTIONS"]);
            toCheck.push(query["TRANSFORMATIONS"]);
            while (!(toCheck.length == 0)) {
                try {
                    var cur = toCheck.pop();
                    if (Object.prototype.toString.call(cur) === '[object Array]') {
                        for (var _i = 0, cur_1 = cur; _i < cur_1.length; _i++) {
                            var obj = cur_1[_i];
                            toCheck.push(obj);
                        }
                    }
                    else if (Object.prototype.toString.call(cur) === '[object Object]') {
                        for (var key in cur) {
                            var added = false;
                            if (key === "ORDER")
                                added = true;
                            if (key.includes("_")) {
                                toReturn.push(key.substring(0, key.indexOf("_")));
                                added = true;
                            }
                            if (!added) {
                                toCheck.push(cur[key]);
                            }
                        }
                    }
                    else if (typeof (cur) === "string") {
                        if (vm.checkCourseKey(cur)[0] || vm.checkRoomKey(cur)[0]) {
                            toReturn.push(cur.substring(0, cur.indexOf("_")));
                        }
                    }
                }
                catch (err) {
                    Util_1.Log.error("Error in QueryGenerator.checkId()");
                    reject(err);
                }
            }
            fulfill(toReturn);
        });
    };
    QueryGenerator.prototype.filter = function (list, query) {
        var vm = this;
        return new Promise(function (fulfill, reject) {
            var filter = query["WHERE"];
            var filtered = new Array();
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var item = list_1[_i];
                if (vm.filterOne(item, filter))
                    filtered.push(item);
            }
            if (query["TRANSFORMATIONS"]) {
                try {
                    filtered = vm.group(filtered, query);
                }
                catch (err) {
                    Util_1.Log.error("Error in QueryGenerator.filter() [group()]");
                    reject(err);
                }
            }
            vm.sort(filtered, query["OPTIONS"]).then(function (sorted) {
                vm.columns(sorted, query["OPTIONS"]["COLUMNS"]).then(function (toReturn) {
                    fulfill(toReturn);
                }).catch(function (err) {
                    Util_1.Log.error("Error in QueryGenerator.filter() [QueryGenerator.columns()]");
                    reject(err);
                });
            }).catch(function (err) {
                Util_1.Log.error("Error in QueryGenerator.filter() [QueryGenerator.sort()]");
                reject(err);
            });
        });
    };
    QueryGenerator.prototype.filterOne = function (item, filter) {
        var vm = this;
        for (var key in filter) {
            if (key === 'AND') {
                var toReturn = true;
                for (var _i = 0, _a = filter[key]; _i < _a.length; _i++) {
                    var filt = _a[_i];
                    var pass = vm.filterOne(item, filt);
                    toReturn = toReturn && pass;
                }
                return toReturn;
            }
            else if (key === 'OR') {
                var toReturn = false;
                for (var _b = 0, _c = filter[key]; _b < _c.length; _b++) {
                    var filt = _c[_b];
                    var pass = vm.filterOne(item, filt);
                    toReturn = toReturn || pass;
                }
                return toReturn;
            }
            else if (key === 'GT') {
                for (var critKey in filter[key]) {
                    if (item[critKey] <= filter[key][critKey])
                        return false;
                    return true;
                }
            }
            else if (key === 'LT') {
                for (var critKey in filter[key]) {
                    if (item[critKey] >= filter[key][critKey])
                        return false;
                    return true;
                }
            }
            else if (key === 'EQ') {
                for (var critKey in filter[key]) {
                    if (item[critKey] != filter[key][critKey])
                        return false;
                    return true;
                }
            }
            else if (key === 'IS') {
                for (var critKey in filter[key]) {
                    var crit = filter[key][critKey];
                    var comp = item[critKey];
                    if (crit.length == 0)
                        return comp === "";
                    if (crit.length == 1)
                        return comp.indexOf("*") >= 0;
                    if (crit.startsWith("*")) {
                        if (crit.endsWith("*")) {
                            crit = crit.substring(1, crit.length - 1);
                            return comp.includes(crit);
                        }
                        else {
                            crit = crit.substring(1, crit.length);
                            return comp.endsWith(crit);
                        }
                    }
                    else {
                        if (crit.endsWith("*")) {
                            crit = crit.substring(0, crit.length - 1);
                            return comp.startsWith(crit);
                        }
                        else {
                            return comp === crit;
                        }
                    }
                }
            }
            else if (key === 'NOT') {
                var pass = vm.filterOne(item, filter[key]);
                return !pass;
            }
        }
        return true;
    };
    QueryGenerator.prototype.sort = function (items, options) {
        var vm = this;
        return new Promise(function (fulfill, reject) {
            try {
                if (options["ORDER"]) {
                    var crit_1 = options["ORDER"];
                    if ((Object.prototype.toString.call(crit_1) === '[object Object]')) {
                        var dirString = crit_1["dir"];
                        var dir = void 0;
                        if (dirString === "UP")
                            dir = 1;
                        else
                            dir = -1;
                        fulfill(items.sort(vm.propComparator(crit_1["keys"], dir)));
                    }
                    else {
                        if (vm.isNum(crit_1)) {
                            fulfill(items.sort(function (a, b) {
                                return a[crit_1] - b[crit_1];
                            }));
                        }
                        else {
                            fulfill(items.sort(function (a, b) {
                                if (a[crit_1] > b[crit_1])
                                    return 1;
                                if (a[crit_1] < b[crit_1])
                                    return -1;
                                return 0;
                            }));
                        }
                    }
                }
                else {
                    fulfill(items);
                }
            }
            catch (err) {
                Util_1.Log.error("Error in QueryGenerator [sort()]");
                Util_1.Log.error(err.message);
                reject(err);
            }
        });
    };
    QueryGenerator.prototype.propComparator = function (crit, dir) {
        var vm = this;
        return function (a, b) {
            for (var _i = 0, crit_2 = crit; _i < crit_2.length; _i++) {
                var c = crit_2[_i];
                if (vm.isNum(c)) {
                    var toReturn = dir * (a[c] - b[c]);
                    if (toReturn != 0)
                        return toReturn;
                }
                else {
                    if (a[c] > b[c])
                        return dir * 1;
                    if (a[c] < b[c])
                        return dir * -1;
                }
            }
            return 0;
        };
    };
    QueryGenerator.prototype.isNum = function (key) {
        var vm = this;
        for (var _i = 0, numKeys_1 = Util_1.numKeys; _i < numKeys_1.length; _i++) {
            var numKey = numKeys_1[_i];
            if (key.indexOf(numKey) >= 0)
                return true;
        }
        if (!util_1.isNullOrUndefined(vm.newValidKeys)) {
            for (var _a = 0, _b = vm.newValidKeys; _a < _b.length; _a++) {
                var newKey = _b[_a];
                if (key.indexOf(newKey) >= 0)
                    return true;
            }
        }
        return false;
    };
    QueryGenerator.prototype.columns = function (courses, columns) {
        return new Promise(function (fulfill, reject) {
            var toReturn = new Array();
            try {
                for (var _i = 0, courses_1 = courses; _i < courses_1.length; _i++) {
                    var course = courses_1[_i];
                    var obj = {};
                    for (var _a = 0, columns_3 = columns; _a < columns_3.length; _a++) {
                        var crit = columns_3[_a];
                        obj[crit] = course[crit];
                    }
                    toReturn.push(obj);
                }
                fulfill(toReturn);
            }
            catch (err) {
                Util_1.Log.error("Error in QueryGenerator [columns()]");
                Util_1.Log.error(err.message);
                reject(err);
            }
        });
    };
    QueryGenerator.prototype.group = function (list, query) {
        try {
            var vm = this;
            var grouped = {};
            var groupList = query["TRANSFORMATIONS"]["GROUP"];
            var applyKeys = vm.getApplyInfo(query["TRANSFORMATIONS"]["APPLY"]);
            var numApplyKeys = applyKeys.length;
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var item = list_2[_i];
                var groupItem = "";
                for (var _a = 0, groupList_1 = groupList; _a < groupList_1.length; _a++) {
                    var group = groupList_1[_a];
                    groupItem += (item[group] + "~");
                }
                if (!grouped[groupItem]) {
                    var toPush = {};
                    for (var _b = 0, groupList_2 = groupList; _b < groupList_2.length; _b++) {
                        var group = groupList_2[_b];
                        toPush[group] = item[group];
                    }
                    grouped[groupItem] = toPush;
                }
                if (numApplyKeys != 0) {
                    for (var _c = 0, applyKeys_1 = applyKeys; _c < applyKeys_1.length; _c++) {
                        var applyItem = applyKeys_1[_c];
                        var group = grouped[groupItem];
                        if (group[applyItem[0]] || group[applyItem[0] + ';count']) {
                            if (applyItem[1] === "MAX") {
                                if (item[applyItem[2]] > group[applyItem[0]])
                                    group[applyItem[0]] = item[applyItem[2]];
                            }
                            else if (applyItem[1] === "MIN") {
                                if (item[applyItem[2]] < group[applyItem[0]])
                                    group[applyItem[0]] = item[applyItem[2]];
                            }
                            else if (applyItem[1] === "AVG") {
                                var val = 10 * item[applyItem[2]];
                                group[applyItem[0]] += Number(val.toFixed(0));
                                group[applyItem[0] + ";avg"] += 1;
                            }
                            else if (applyItem[1] === "SUM") {
                                group[applyItem[0]] += item[applyItem[2]];
                            }
                            else if (applyItem[1] === "COUNT") {
                                if (!group[applyItem[0] + ';count'][item[applyItem[2]]]) {
                                    group[applyItem[0] + ';count'][item[applyItem[2]]] = 1;
                                }
                            }
                        }
                        else {
                            if (applyItem[1] !== "COUNT") {
                                if (applyItem[1] === "AVG") {
                                    var val = 10 * item[applyItem[2]];
                                    group[applyItem[0]] = Number(val.toFixed(0));
                                    group[applyItem[0] + ";avg"] = 1;
                                }
                                else {
                                    group[applyItem[0]] = item[applyItem[2]];
                                }
                            }
                            else {
                                group[applyItem[0] + ';count'] = {};
                                group[applyItem[0] + ';count'][item[applyItem[2]]] = 1;
                            }
                        }
                    }
                }
            }
            var toReturn = vm.applyAveragesAndCount(grouped);
            return toReturn;
        }
        catch (err) {
            Util_1.Log.error("Error in QueryGenerator.group()");
            throw err;
        }
    };
    QueryGenerator.prototype.applyAveragesAndCount = function (grouped) {
        var toReturn = new Array();
        for (var groupKey in grouped) {
            var group = grouped[groupKey];
            for (var key in group) {
                if (key.includes(";avg")) {
                    var avgKey = key.substring(0, key.indexOf(";"));
                    var count = group[key];
                    var avg = group[avgKey];
                    avg = avg / count;
                    avg = avg / 10;
                    avg = Number(avg.toFixed(2));
                    group[avgKey] = avg;
                    delete group[key];
                }
                if (key.includes(";count")) {
                    var countKey = key.substring(0, key.indexOf(";"));
                    var count = Object.keys(group[key]).length;
                    group[countKey] = count;
                    delete group[key];
                }
            }
            toReturn.push(group);
        }
        return toReturn;
    };
    QueryGenerator.prototype.getApplyInfo = function (apply) {
        var toReturn = new Array();
        for (var _i = 0, apply_2 = apply; _i < apply_2.length; _i++) {
            var applyObj = apply_2[_i];
            var newKey = void 0, op = void 0, key = void 0;
            for (var val in applyObj) {
                newKey = val;
                for (var obj in applyObj[val]) {
                    op = obj;
                    key = applyObj[val][obj];
                }
            }
            toReturn.push([newKey, op, key]);
        }
        return toReturn;
    };
    return QueryGenerator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QueryGenerator;
//# sourceMappingURL=QueryGenerator.js.map