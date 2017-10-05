import { GetSurvivalToTimeWithCauseImpact, getGetSurvivalToTimeWithCauseImpact } from './cause-impact-get-survival-to-time';
import { GetRiskToTimeWithCauseImpact, getGetRiskToTimeWithCauseImpact } from './cause-impact-get-risk-to-time';
import { GetLifeExpectancyWithCauseImpact, getGetLifeExpectancyWithCauseImpact } from './cause-impact-get-life-expectancy';
import { RefLifeTable } from '../../life-table';
import { CauseImpactRefTypes } from '../../cause-impact';
import { ModelTypes, JsonModelTypes } from '../../model';

export type WithCauseImpactFunction<T> = (...riskFactor: string[]) => T;

export interface WithCauseImpactWithCoxFunctions {
    withCauseImpact: WithCauseImpactFunction<GetSurvivalToTimeWithCauseImpact & GetRiskToTimeWithCauseImpact>;
}

export function getWithCauseImpactWithCoxFunctions(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes,
): WithCauseImpactWithCoxFunctions {
    return {
        withCauseImpact: (...riskFactors: string[]) => {
            return Object.assign(
                {},
                getGetSurvivalToTimeWithCauseImpact(
                    model,
                    modelJson,
                    riskFactors,
                    causeImpactRef
                ),
                getGetRiskToTimeWithCauseImpact(
                    model,
                    modelJson,
                    riskFactors,
                    causeImpactRef
                )
            )
        }
    }
}

export interface WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction {
    withCauseImpact: WithCauseImpactFunction<GetSurvivalToTimeWithCauseImpact & GetRiskToTimeWithCauseImpact & GetLifeExpectancyWithCauseImpact>;
}

export function getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99,
    causeImpactRef?: CauseImpactRefTypes,
): WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction {
    return {
        withCauseImpact: (...riskFactors: string[]) => {
            return Object.assign(
                {},
                getGetSurvivalToTimeWithCauseImpact(
                    model,
                    modelJson,
                    riskFactors,
                    causeImpactRef
                ),
                getGetRiskToTimeWithCauseImpact(
                    model,
                    modelJson,
                    riskFactors,
                    causeImpactRef
                ),
                getGetLifeExpectancyWithCauseImpact(
                    riskFactors,
                    refLifeTable,
                    model,
                    modelJson,
                    useExFromLifeTableFromAge,causeImpactRef,

                )
            )
        }
    }
}