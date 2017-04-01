/**
 * Created by alexgoddijn on 23/01/2017.
 */

import {Course} from "./IInsightFacade";
import {Log} from "../Util";
var fs = require("fs");
var rootPath = "./cache/";

export default class FileSystem {

    /**
     * Write a dataset to the cache with given filename.
     *
     * @param filename  The name of the database to be saved
     * @param data The course data to be saved.
     *
     * The promise should return a boolean
     *
     * Returns true if database was successfully written
     * Return false otherwise
     *
     */
    public static write(filename: string, data: Course[]): Promise<boolean> {
        return new Promise(function(fulfill, reject) {
            filename = rootPath + filename;
            try {
                // Create directory
                if(!fs.existsSync(rootPath)) fs.mkdirSync(rootPath);
                fs.writeFileSync(filename, JSON.stringify(data));
                fulfill(true);
            } catch (err) {
                Log.error("Error in FileSystem [writeFileSync()]");
                Log.error(err);
                reject(err);
            }
        })
    }

    /**
     * Read a dataset with given filename from the cache.
     *
     * @param filename The name of the database to be read
     *
     * The promise should return a list of courses
     *
     * Returns courses if file was successfully read
     * Returns error if read failed
     *
     */
    public static read(filename: string): Promise<Course[]> {
        return new Promise(function(fulfill, reject) {
            try {
                filename = rootPath + filename;
                var file = JSON.parse(fs.readFileSync(filename));
                fulfill(file);
            } catch (err) {
                Log.error("Error in FileSystem.read() [JSON.parse() or fs.readFileSync()]");
                Log.error(err);
                reject(err);
            }
        })
    }

    /**
     * Check if a database with given filename exists in the cache.
     *
     * @param filename  The name of the database to be checked
     *
     * The promise should return a boolean
     *
     * Returns true if database exists
     * Return false otherwise
     *
     */
    public static check(filename: string): Promise<boolean> {
        return new Promise(function(fulfill, reject) {
            try {
                let exists: boolean = fs.existsSync(rootPath + filename);
                fulfill(exists);
            } catch (err) {
                Log.error("Error in FileSystem [existsSync()]");
                Log.error(err);
                reject(err);
            }
        });
    }

    /**
     * Check if all files with given filenames exist.
     *
     * @param filenames  The names of the files to be checked
     *
     * The promise should return a list of strings
     *
     * Returns a list of all the filenames that were not found in the cache
     * Return empty list if all files were found
     * Return error if error occurred
     *
     */
    public static checkFiles(filenames: string[]): Promise<string[]> {
        return new Promise(function(fulfill, reject) {
            var missing: string[] = new Array<string>();
            var promises: Promise<boolean>[] = new Array<Promise<boolean>>();
            for (let filename of filenames) {
                promises.push(FileSystem.check(filename));
            }
            Promise.all(promises).then(function(exists: boolean[]) {
                for (let i = 0; i < exists.length; i++) {
                    if(!exists[i]) missing.push(filenames[i]);
                }
                fulfill(missing);
            }).catch(function(err: any) {
                Log.error(err.message);
                reject(err);
            });
        })
    }

    /**
     * Remove a dataset with given filename from the cache.
     *
     * @param filename  The name of the database to be removed
     *
     * The promise should return a boolean
     *
     * Returns true if database was successfully removed
     * Return error otherwise
     *
     */
    public static remove(filename: string): Promise<boolean> {
        return new Promise(function(fulfill, reject) {
            try {
                fs.unlinkSync(rootPath + filename);
                fulfill(true);
            } catch (err) {
                Log.error("Error in FileSystem [rmdirSync()]");
                Log.error(err);
                reject(err);
            }
        })
    }

}