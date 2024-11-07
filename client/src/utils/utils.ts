import { EventType } from "../App";


export const parseArrayToObject = (array: EventType[]):{[key in string]: EventType} => {
    return array.reduce((acc: {[key in string]: EventType}, item: EventType) => {
        acc[item.id] = item;
        return acc;
    }, {})
}