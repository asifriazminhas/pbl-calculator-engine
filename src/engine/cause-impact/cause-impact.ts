import {
    GenderCauseImpactRef,
    getCauseImpactRefForData,
    getCauseImpactDataForRiskFactors,
} from './gender-cause-impact-ref';
import { Data, updateDataWithData } from '../data';

export interface IWithDataFunction {
    withData: (data: Data, ...otherArgs: any[]) => number;
}

function getWithDataFunction(
    genderCauseImpactRef: GenderCauseImpactRef,
    riskFactors: string[],
    func: (data: Data, ...otherArgs: any[]) => number,
): IWithDataFunction {
    return {
        withData: (data, otherArgs) => {
            const causeImpactRef = getCauseImpactRefForData(
                genderCauseImpactRef,
                data,
            );

            const causeImpactRefData = getCauseImpactDataForRiskFactors(
                riskFactors,
                causeImpactRef,
            );

            return func(
                updateDataWithData(data, causeImpactRefData),
                otherArgs,
            );
        },
    };
}

export interface IGetCauseImpactFunction {
    getCauseImpact: (
        func: (data: Data, ...otherArgs: any[]) => number,
    ) => IWithDataFunction;
}

function getGetCauseImpactFunction(
    genderCauseImpactRef: GenderCauseImpactRef,
    riskFactors: string[],
): IGetCauseImpactFunction {
    return {
        getCauseImpact: func => {
            return getWithDataFunction(genderCauseImpactRef, riskFactors, func);
        },
    };
}

export type ForRiskFactorFunction = (
    riskFactor: string,
) => IGetCauseImpactFunction;
export type ForRiskFactorsFunction = (
    riskFactors: string[],
) => IGetCauseImpactFunction;

export function getForRiskFactorFunction(
    genderCauseImpactRef: GenderCauseImpactRef,
): {
    withRiskFactor: ForRiskFactorFunction;
    withRiskFactors: ForRiskFactorsFunction;
} {
    return {
        withRiskFactor: riskFactor => {
            return getGetCauseImpactFunction(genderCauseImpactRef, [
                riskFactor,
            ]);
        },
        withRiskFactors: riskFactors => {
            return getGetCauseImpactFunction(genderCauseImpactRef, riskFactors);
        },
    };
}
