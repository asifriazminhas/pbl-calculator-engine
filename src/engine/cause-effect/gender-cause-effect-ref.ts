import { Data, findDatumWithName } from '../data';
import { NoCauseEffectRefFound } from '../errors';
import { RiskFactor } from '../../risk-factors';

export type IGenderSpecificCauseEffectRef = { [K in RiskFactor]: Data };

export interface IGenderCauseEffectRef {
    [index: string]: IGenderSpecificCauseEffectRef;
    male: IGenderSpecificCauseEffectRef;
    female: IGenderSpecificCauseEffectRef;
}

export function getCauseEffectRefForData(
    genderCauseEffectRef: IGenderCauseEffectRef,
    data: Data,
): IGenderSpecificCauseEffectRef {
    const sexDatum = findDatumWithName('DHH_SEX', data);

    const causeEffectRefFound =
        genderCauseEffectRef[
            sexDatum.coefficent as keyof IGenderCauseEffectRef
        ];

    if (!causeEffectRefFound) {
        throw new NoCauseEffectRefFound(sexDatum.coefficent as string);
    }

    return causeEffectRefFound;
}

export function getCauseEffectDataForRiskFactors(
    riskFactors: RiskFactor[],
    causeEffectRef: IGenderSpecificCauseEffectRef,
): Data {
    return riskFactors
        .map(riskFactor => {
            return causeEffectRef[riskFactor];
        })
        .reduce((currentCauseEffectRefData, causeEffectRefData) => {
            return currentCauseEffectRefData.concat(causeEffectRefData);
        }, []);
}
