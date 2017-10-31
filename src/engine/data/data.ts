import { IDatum } from './datum';

export type Data = Array<IDatum>;

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
