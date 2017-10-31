import { Data } from '../data';

export interface CauseImpactRef {
    [index: string]: Data;
}

export interface GenderSpecificCauseImpactRef {
    male: CauseImpactRef;
    female: CauseImpactRef;
}

export type CauseImpactRefTypes = CauseImpactRef | GenderSpecificCauseImpactRef;

export function getCauseImpactRefForData(
    causeImpactRef: CauseImpactRefTypes,
    data: Data
): CauseImpactRef {
    const sexDatum = data
        .find(datum => datum.name === 'sex');
    
    if(!sexDatum) {
        throw new Error(`No sex datum found`);
    }

    if((causeImpactRef as GenderSpecificCauseImpactRef).male) {
        const causeImpactRefFound = (causeImpactRef as GenderSpecificCauseImpactRef)[sexDatum.coefficent as keyof GenderSpecificCauseImpactRef];

        if(!causeImpactRefFound) {
            throw new Error(`No cause impact ref found for sex coefficen ${sexDatum.coefficent}`)
        }

        return causeImpactRefFound;
    } else {
        return causeImpactRef as CauseImpactRef;
    }
}