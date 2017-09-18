import { GetSurvivalToTimeWithCauseImpact, getGetSurvivalToTimeWithCauseImpact } from './cause-impact-get-survival-to-time';
import { GetRiskToTimeWithCauseImpact, getGetRiskToTimeWithCauseImpact } from './cause-impact-get-risk-to-time';
import { GetLifeExpectancyWithCauseImpact, getGetLifeExpectancyWithCauseImpact } from './cause-impact-get-life-expectancy';
import { Cox } from '../../cox';
import { RefLifeTable } from '../../common/life-table';
import { CauseImpactRef } from '../../cause-impact';

export type WithCauseImpactFunction<T> = (riskFactor: string) => T;

export interface WithCauseImpactWithCoxFunctions {
    withCauseImpact: WithCauseImpactFunction<GetSurvivalToTimeWithCauseImpact & GetRiskToTimeWithCauseImpact>;
}

export function getWithCauseImpactWithCoxFunctions(
    causeImpactRef: CauseImpactRef,
    coxAlgorithm: Cox
): WithCauseImpactWithCoxFunctions {
    return {
        withCauseImpact: (riskFactor) => {
            return Object.assign(
                {},
                getGetSurvivalToTimeWithCauseImpact(
                    causeImpactRef,
                    coxAlgorithm,
                    riskFactor
                ),
                getGetRiskToTimeWithCauseImpact(
                    causeImpactRef,
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
    causeImpactRef: CauseImpactRef,
    coxAlgorithm: Cox,
    refLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99
): WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction {
    return {
        withCauseImpact: (riskFactor) => {
            return Object.assign(
                {},
                getGetSurvivalToTimeWithCauseImpact(
                    causeImpactRef, 
                    coxAlgorithm,
                    riskFactor
                ),
                getGetRiskToTimeWithCauseImpact(
                    causeImpactRef, 
                    coxAlgorithm,
                    riskFactor
                ),
                getGetLifeExpectancyWithCauseImpact(
                    causeImpactRef,
                    riskFactor,
                    refLifeTable,
                    coxAlgorithm,
                    useExFromLifeTableFromAge
                )
            )
        }
    }
}