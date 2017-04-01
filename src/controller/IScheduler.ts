import {QueryRequest} from "./IInsightFacade";
/**
 * Created by alexgoddijn on 22/03/2017.
 */

export interface ScheduleBlock {
    room_shortname: string;
    room_num: number;
    room_size: number;
    course_dept: string;
    course_id: number;
    section_num: number;
    section_size: number;
    day: string;
    start_time: number;
    end_time: number;
}

export interface Time {
    day: string;
    start_time: number;
    end_time: number;
}

export interface RoomSchedule {
    room_shortname: string;
    room_num: number;
    available: Array<Time>;
}

export interface IScheduler {

    /**
     * Get all the necessary course info for scheduling
     * Should return an array with course dept and course num, number of sections, and size
     *
     * @param courses
     */
    getInfoCourses(courses: Array<any>): Promise<Array<any>>;

    /**
     * Schedule the courses into the rooms
     * Return format: Array of tuples
     *  [room_shortname, room_num, course_dept, course_id, section_num, day, startime, endtime]
     *
     * @param courses The courses to be scheduled
     * @param rooms The rooms to schedule courses into
     */
    schedule(courses: Array<any>, rooms: Array<any>): Promise<[Array<ScheduleBlock>, Array<any>, number, number]>;

    /**
     * Validate a schedule query
     *
     * @param courseQuery
     * @param roomQuery
     */
    validateScheduleQueries(courseQuery: QueryRequest, roomQuery: QueryRequest): [boolean, string];

}