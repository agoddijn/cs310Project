/**
 * Collection of logging methods. Useful for making the output easier to read and understand.
 *
 * @param msg
 */
/* tslint:disable:no-console */
export class Log {

    public static trace(msg: string) {
        console.log("<T> " + new Date().toLocaleString() + ": " + msg);
    }

    public static info(msg: string) {
        console.log("<I> " + new Date().toLocaleString() + ": " + msg);
    }

    public static warn(msg: string) {
        console.error("<W> " + new Date().toLocaleString() + ": " + msg);
    }

    public static error(msg: string) {
        console.error("<E> " + new Date().toLocaleString() + ": " + msg);
    }

    public static test(msg: string) {
        console.log("<X> " + new Date().toLocaleString() + ": " + msg);
    }
}

export const validCourseKeys: string[] = [
    "_id", "_dept", "_avg", "_instructor", "_title", "_pass", "_fail", "_audit", "_uuid", "_year"
];

export const validRoomKeys: string[] = [
    "_fullname", "_shortname", "_number", "_name", "_address", "_lat", "_lon", "_seats", "_type", "_furniture", "_href"
];

export const numKeys: string[] = [
    "_avg", "_pass", "_fail", "_audit", "_year", "_lat", "_lon", "_seats"
];

export const geoLocApiUrl: string = "http://skaha.cs.ubc.ca:11316/api/v1/team199/";
