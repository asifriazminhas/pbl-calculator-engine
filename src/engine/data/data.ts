import { IDatum } from './datum';
import { throwErrorIfUndefined } from '../undefined/undefined';

export type Data = IDatum[];

export function updateDataWithData(data: Data, dataUpdate: Data): Data {
    return data
        .filter(datum => {
            return dataUpdate.find((datumForRiskFactor: any) => {
                return datumForRiskFactor.name === datum.name;
            }) === undefined
                ? false
                : true;
        })
        .concat(dataUpdate);
}

export function findDatumWithName(name: string, data: Data): IDatum {
    return throwErrorIfUndefined(
        data.find(datum => datum.name === name),
        new NoDatumFoundError(name),
    );
}

export function updataDataWithDatum(data: Data, datumUpdate: IDatum): Data {
    return updateDataWithData(data, [datumUpdate]);
}
