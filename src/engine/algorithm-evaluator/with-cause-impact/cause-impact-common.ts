import { Data } from '../../common/data';
import { CoxJson } from '../../common/json-types';

export function getDataForCauseImpactForRiskFactor(
    coxJson: CoxJson,
    riskFactor: string,
    data: Data,
): Data {
    const dataForRiskFactor = coxJson.causeDeletedRef[riskFactor];

    return data
        .filter((datum) => {
            return dataForRiskFactor
                .find((datumForRiskFactor: any) => {
                    return datumForRiskFactor.name === datum.name;
                }) === undefined ? false : true;
        })
        .concat(
            dataForRiskFactor
        );
}