import { Data, findDatumWithName } from '../data';
import { NoCauseImpactRefFound } from '../errors';

export interface GenderSpecificCauseImpactRef {
    [index: string]: Data;
}

export interface GenderCauseImpactRef {
    [index: string]: GenderSpecificCauseImpactRef;
    male: GenderSpecificCauseImpactRef;
    female: GenderSpecificCauseImpactRef;
}

export function getCauseImpactRefForData(
    genderCauseImpactRef: GenderCauseImpactRef,
    data: Data,
): GenderSpecificCauseImpactRef {
    const sexDatum = findDatumWithName('sex', data);

    const causeImpactRefFound =
        genderCauseImpactRef[sexDatum.coefficent as keyof GenderCauseImpactRef];

    if (!causeImpactRefFound) {
        throw new NoCauseImpactRefFound(sexDatum.coefficent as string);
    }

    return causeImpactRefFound;
}

export function getCauseImpactDataForRiskFactors(
    riskFactors: string[],
    causeImpactRef: GenderSpecificCauseImpactRef,
): Data {
    return riskFactors
        .map(riskFactor => {
            return causeImpactRef[riskFactor];
        })
        .reduce((currentCauseImpactRefData, causeImpactRefData) => {
            return currentCauseImpactRefData.concat(causeImpactRefData);
        }, []);
}
