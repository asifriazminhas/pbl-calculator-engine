import { IDatum } from './datum';
export declare type Data = IDatum[];
export declare function updateDataWithData(data: Data, dataUpdate: Data): Data;
/**
 * Returns the IDatum object whose name field is the same as the name argument.
 * Throws a NoDatumFoundError if no IDatum object is found
 *
 * @export
 * @param {string} name
 * @param {Data} data
 * @returns {IDatum}
 */
export declare function findDatumWithName(name: string, data: Data): IDatum;
export declare function updateDataWithDatum(data: Data, datumUpdate: IDatum): Data;
export declare function isEqual(dataOne: Data, dataTwo: Data): boolean;
