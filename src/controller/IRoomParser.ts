/**
 * Created by alexgoddijn on 14/02/2017.
 */

import {Room} from "./IInsightFacade";

export interface IRoomParser {
    /**
     * Takes data from parsed zip file and return an array of rooms
     *
     * @param data The parsed zip data
     * @param id The name of the database to be added
     *
     * Returns a promise that fulfills with a list of rooms indexed in index.htm
     * Returns a promise that rejects if an error occurs
     *
     */
    parse(data: any, id: string): Promise<Room[]>;

    /**
     * Take the index document and parse it to find the names of the indexed rooms
     *
     * @param document The index.htm document to be parsed
     *
     * Returns a promise that fulfills with a list of strings of the room names index
     * Returns a promise that rejects if an error occurs (i.e. Could not find list of indexed rooms
     */
    searchIndexForRooms(document: any): Promise<string[]>;

    /**
     * Takes the html for a building and returns an array of rooms in that building
     *
     * @param buildingHtml A promise of the HTML of the building to be parsed
     * @param shortname The short name of the building
     *
     * Returns a promise that is fulfilled with a list of rooms
     * Returns a promise that is rejected if an error occurs
     */
    genBuilding(buildingHtml: Promise<string>, shortname: string): Promise<Room[]>;

    /**
     * Takes the HTML for a table row and returns a room from the given data excluding any building data
     *
     * @param html The table row HTML to turn into a room
     *
     * Returns a room with table from given table row
     */
    genRoom(trNode: any): Room;

    /**
     * Checks a given node for a given attribute name and value.
     *
     * @param node The node to check
     * @param attrName The atrribute name
     * @param attrValue the value name
     *
     * Returns true if the node has an atrribute of which attrValue is a subtring of its value
     */
    checkNodeAttrs(node: any, attrName: string, attrValue: string): boolean;
}