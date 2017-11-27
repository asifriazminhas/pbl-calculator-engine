import { IDatum } from './datum';
import { throwErrorIfUndefined } from '../undefined/undefined';
import { NoDatumFoundError } from '../errors';

export type Data = IDatum[];

export function updateDataWithData(data: Data, dataUpdate: Data): Data {
    return data
        .filter(datum => {
            return dataUpdate.find((datumForRiskFactor: any) => {
                return datumForRiskFactor.name === datum.name;
            })
                ? false
                : true;
        })
        .concat(dataUpdate);
}

/**
 * Returns the IDatum object whose name field is the same as the name argument.
 * Throws a NoDatumFoundError if no IDatum object is found
 *
 * @export
 * @param {string} name
 * @param {Data} data
 * @returns {IDatum}
 */
export function findDatumWithName(name: string, data: Data): IDatum {
    return throwErrorIfUndefined(
        data.find(datum => datum.name === name),
        new NoDatumFoundError(name),
    );
}

export function updateDataWithDatum(data: Data, datumUpdate: IDatum): Data {
    return updateDataWithData(data, [datumUpdate]);
}
