import {
    IGenderCauseEffectRef,
    getCauseEffectRefForData,
    getCauseEffectDataForRiskFactors,
} from './gender-cause-effect-ref';
import { Data, updateDataWithData } from '../data';

export interface IWithDataFunction {
    withData: (data: Data, ...otherArgs: any[]) => number;
}

function getWithDataFunction(
    genderCauseEffectRef: IGenderCauseEffectRef,
    riskFactors: string[],
    func: (data: Data, ...otherArgs: any[]) => number,
): IWithDataFunction {
    return {
        withData: (data, otherArgs) => {
            const causeEffectRef = getCauseEffectRefForData(
                genderCauseEffectRef,
                data,
            );

            const causeEffectRefData = getCauseEffectDataForRiskFactors(
                riskFactors,
                causeEffectRef,
            );

            return func(
                updateDataWithData(data, causeEffectRefData),
                otherArgs,
            );
        },
    };
}

export interface IGetCauseEffectFunction {
    getCauseEffect: (
        func: (data: Data, ...otherArgs: any[]) => number,
    ) => IWithDataFunction;
}

function getGetCauseEffectFunction(
    genderCauseEffectRef: IGenderCauseEffectRef,
    riskFactors: string[],
): IGetCauseEffectFunction {
    return {
        getCauseEffect: func => {
            return getWithDataFunction(genderCauseEffectRef, riskFactors, func);
        },
    };
}

export type ForRiskFactorFunction = (
    riskFactor: string,
) => IGetCauseEffectFunction;
export type ForRiskFactorsFunction = (
    riskFactors: string[],
) => IGetCauseEffectFunction;

export function getForRiskFactorFunction(
    genderEffectImpactRef: IGenderCauseEffectRef,
): {
    withRiskFactor: ForRiskFactorFunction;
    withRiskFactors: ForRiskFactorsFunction;
} {
    return {
        withRiskFactor: riskFactor => {
            return getGetCauseEffectFunction(genderEffectImpactRef, [
                riskFactor,
            ]);
        },
        withRiskFactors: riskFactors => {
            return getGetCauseEffectFunction(
                genderEffectImpactRef,
                riskFactors,
            );
        },
    };
}
