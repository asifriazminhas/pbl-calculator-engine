import {
    IGenderCauseEffectRef,
    getCauseEffectRefForData,
    getCauseEffectDataForRiskFactors,
} from './gender-cause-effect-ref';
import { Data, updateDataWithData } from '../data';
import { CovariateGroup } from '../data-field/covariate/covariate-group';

export interface IWithDataFunction {
    withData: (data: Data, ...otherArgs: any[]) => number;
}

function getWithDataFunction(
    genderCauseEffectRef: IGenderCauseEffectRef,
    riskFactors: CovariateGroup[],
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
    riskFactors: CovariateGroup[],
): IGetCauseEffectFunction {
    return {
        getCauseEffect: func => {
            return getWithDataFunction(genderCauseEffectRef, riskFactors, func);
        },
    };
}

export type ForRiskFactorFunction = (
    riskFactor: CovariateGroup,
) => IGetCauseEffectFunction;
export type ForRiskFactorsFunction = (
    riskFactors: CovariateGroup[],
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
