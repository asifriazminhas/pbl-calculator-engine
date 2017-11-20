import { Data, findDatumWithName } from '../data';
import { NoCauseEffectRefFound } from '../errors';

export interface IGenderSpecificCauseEffectRef {
    [index: string]: Data;
}

export interface IGenderCauseEffectRef {
    [index: string]: IGenderSpecificCauseEffectRef;
    male: IGenderSpecificCauseEffectRef;
    female: IGenderSpecificCauseEffectRef;
}

export function getCauseEffectRefForData(
    genderCauseEffectRef: IGenderCauseEffectRef,
    data: Data,
): IGenderSpecificCauseEffectRef {
    const sexDatum = findDatumWithName('sex', data);

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
    riskFactors: string[],
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
