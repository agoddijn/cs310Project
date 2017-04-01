/**
 * Created by alexgoddijn on 17/02/2017.
 */

import {QueryRequest, Course, Room, InsightResponse} from "./IInsightFacade";

export interface IQueryGenerator {
    /**
     * Check validity of a query.
     *
     * @param query  The query to be checked.
     *
     * @returns A promise that fulfills with the id of the dataset to be loaded
     * @returns Rejects with an error if error occurs
     *
     */
    checkQuery(query: QueryRequest): Promise<string>;

    /**
     * Checks if the given id's in the query have been added.
     *
     * @param query  The query to be checked.
     *
     * @returns A promise that fulfills with a list of missing ids (except those in order)
     * @returns Rejects with an error if error occurs or empty array if no ids missing
     *
     */
    checkId(query: QueryRequest): Promise<string[]>;

    /**
     * Filter a list of courses given a query.
     *
     * @param list  The data to be filtered.
     * @param query The query to filter against
     *
     * @returns A promise that fulfills with a filtered, sorted, and pruned array of courses
     *  pruned means data that is not in columns is removed
     * @returns Rejects with an error if error occurs
     *
     */
    filter(list: Course[] | Room[], query: QueryRequest): Promise<Array<{}>>

    /**
     * Groups all objects of a certain type into one, using info from group and maxSeats
     *
     * @param list List of objects to be grouped
     * @param query The query to group by
     *
     * Returns a promise that fulfills with a list of objects that are grouped and have appropriate information
     * Returns a promise that rejects if an error occurs
     */
    group(list: Course[] | Room[], query: QueryRequest): Array<{}>

    /**
     * Sort a list of courses or rooms based on a certain key
     *
     * @param items The items to be sorted
     * @param options The key to be filtered by
     *
     * Returns a Promise that fulfills with a list of Course or Room sorted by the key in options
     * Returns a Promise that rejects if an error occurs
     */
    sort(items: Course[] | Room[], options: any): Promise<Course[] | Room[]>

    /**
     * Strip the list of rooms or courses of all unecessery data (anything not in columns)
     *
     * @param courses
     * @param columns
     *
     * Returns a Promise that fulfills with an array of Rooms or Courses that have all keys not in columns removed
     * Returns a Promise that rejects if an error occurs
     */
    columns(courses: Course[] | Room[], columns: string[]): Promise<Array<{}>>
}