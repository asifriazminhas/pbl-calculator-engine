import { GetSurvivalToTimeWithCauseImpact, getGetSurvivalToTimeWithCauseImpact } from './cause-impact-get-survival-to-time';
import { GetRiskToTimeWithCauseImpact, getGetRiskToTimeWithCauseImpact } from './cause-impact-get-risk-to-time';
import { GetLifeExpectancyWithCauseImpact, getGetLifeExpectancyWithCauseImpact } from './cause-impact-get-life-expectancy';
import { CoxJson } from '../../common/json-types';
import { Cox } from '../../cox';
import { RefLifeTable } from '../../common/life-table';

export type WithCauseImpactFunction<T> = (riskFactor: string) => T;

export interface WithCauseImpactWithCoxFunctions {
    withCauseImpact: WithCauseImpactFunction<GetSurvivalToTimeWithCauseImpact & GetRiskToTimeWithCauseImpact>;
}

export function getWithCauseImpactWithCoxFunctions(
    coxJson: CoxJson,
    coxAlgorithm: Cox
): WithCauseImpactWithCoxFunctions {
    return {
        withCauseImpact: (riskFactor) => {
            return Object.assign(
                {},
                getGetSurvivalToTimeWithCauseImpact(
                    coxJson,
                    coxAlgorithm,
                    riskFactor
                ),
                getGetRiskToTimeWithCauseImpact(
                    coxJson,
                    coxAlgorithm,
                    riskFactor
                )
            )
        }
    }
}

export interface WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction {
    withCauseImpact: WithCauseImpactFunction<GetSurvivalToTimeWithCauseImpact & GetRiskToTimeWithCauseImpact & GetLifeExpectancyWithCauseImpact>;
}

export function getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
    coxJson: CoxJson,
    coxAlgorithm: Cox,
    refLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99
): WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction {
    return {
        withCauseImpact: (riskFactor) => {
            return Object.assign(
                {},
                getGetSurvivalToTimeWithCauseImpact(
                    coxJson, 
                    coxAlgorithm,
                    riskFactor
                ),
                getGetRiskToTimeWithCauseImpact(
                    coxJson, 
                    coxAlgorithm,
                    riskFactor
                ),
                getGetLifeExpectancyWithCauseImpact(
                    riskFactor,
                    refLifeTable,
                    coxAlgorithm,
                    coxJson,
                    useExFromLifeTableFromAge
                )
            )
        }
    }
}