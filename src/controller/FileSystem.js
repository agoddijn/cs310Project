"use strict";
var Util_1 = require("../Util");
var fs = require("fs");
var rootPath = "./cache/";
var FileSystem = (function () {
    function FileSystem() {
    }
    FileSystem.write = function (filename, data) {
        return new Promise(function (fulfill, reject) {
            filename = rootPath + filename;
            try {
                if (!fs.existsSync(rootPath))
                    fs.mkdirSync(rootPath);
                fs.writeFileSync(filename, JSON.stringify(data));
                fulfill(true);
            }
            catch (err) {
                Util_1.Log.error("Error in FileSystem [writeFileSync()]");
                Util_1.Log.error(err);
                reject(err);
            }
        });
    };
    FileSystem.read = function (filename) {
        return new Promise(function (fulfill, reject) {
            try {
                filename = rootPath + filename;
                var file = JSON.parse(fs.readFileSync(filename));
                fulfill(file);
            }
            catch (err) {
                Util_1.Log.error("Error in FileSystem.read() [JSON.parse() or fs.readFileSync()]");
                Util_1.Log.error(err);
                reject(err);
            }
        });
    };
    FileSystem.check = function (filename) {
        return new Promise(function (fulfill, reject) {
            try {
                var exists = fs.existsSync(rootPath + filename);
                fulfill(exists);
            }
            catch (err) {
                Util_1.Log.error("Error in FileSystem [existsSync()]");
                Util_1.Log.error(err);
                reject(err);
            }
        });
    };
    FileSystem.checkFiles = function (filenames) {
        return new Promise(function (fulfill, reject) {
            var missing = new Array();
            var promises = new Array();
            for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
                var filename = filenames_1[_i];
                promises.push(FileSystem.check(filename));
            }
            Promise.all(promises).then(function (exists) {
                for (var i = 0; i < exists.length; i++) {
                    if (!exists[i])
                        missing.push(filenames[i]);
                }
                fulfill(missing);
            }).catch(function (err) {
                Util_1.Log.error(err.message);
                reject(err);
            });
        });
    };
    FileSystem.remove = function (filename) {
        return new Promise(function (fulfill, reject) {
            try {
                fs.unlinkSync(rootPath + filename);
                fulfill(true);
            }
            catch (err) {
                Util_1.Log.error("Error in FileSystem [rmdirSync()]");
                Util_1.Log.error(err);
                reject(err);
            }
        });
    };
    return FileSystem;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileSystem;
//# sourceMappingURL=FileSystem.js.map