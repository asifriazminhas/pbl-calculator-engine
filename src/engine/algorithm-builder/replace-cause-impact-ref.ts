import { GetSurvivalToTime, getGetSurvivalToTime, GetRiskToTime, getGetRiskToTime, WithDataAndCoxFunctions, getWithDataAndCoxFunctions, WithCauseImpactWithCoxFunctions, getWithCauseImpactWithCoxFunctions, getGetLifeExpectancy, getGetSurvivalToAge, getGetLifeYearsLost, WithDataAndCoxFunctionsAndLifeTableFunctions, getWithDataAndCoxFunctionsAndLifeTableFunctions, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions, GetHealthAge, getGetHealthAge, WithDataAndCoxFunctionsAndAddRefPopFunctions, getWithDataAndCoxFunctionsAndAddRefPopFunctions, CompleteWithData, getCompleteWithData } from '../algorithm-evaluator';
import { AddLifeTableWithAddRefPop, getAddLifeTableWithAddRefPop, AddLifeTableEvaluatorFunctions, AddLifeTableWithGetHealthAge, getAddLifeTableWithGetHealthAge } from './add-life-table';
import { AddRefPopWithAddLifeTable, getAddRefPopWithAddLifeTable, AddRefPopWithAddLifeTableFunctions, getAddRefPopWithAddLifeTableFunctions } from './add-ref-pop';
import { ToJson, getToJson } from './to-json';
import { BaseAddAlgorithm, getBaseAddAlgorithmFunction, AddAlgorithmWithLifeTableFunctions, getAddAlgorithmWithLifeTableFunctions, AddAlgorithmReturnsGetHealthAge, getAddAlgorithmReturnsGetHealthAgeFunction, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions, getAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';
import { CauseImpactRef } from '../cause-impact';
import { Cox } from '../cox';
import { CoxJson } from '../common/json-types';
import { RefLifeTable } from '../common/life-table';
import { ReferencePopulation } from '../health-age';

export interface BaseReplaceCauseImpactRef {
    replaceCauseImpactRef: (causeImpactRef: CauseImpactRef) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithAddRefPop & AddRefPopWithAddLifeTable & ToJson & BaseAddAlgorithm & WithDataAndCoxFunctions<{}> & WithCauseImpactWithCoxFunctions & BaseReplaceCauseImpactRef
}

export function getBaseReplaceCauseImpactRef(
    cox: Cox,
    coxJson: CoxJson
): BaseReplaceCauseImpactRef {
    return {
        replaceCauseImpactRef: (causeImpactRef) => {
            return Object.assign(
                {},
                getGetSurvivalToTime(cox),
                getGetRiskToTime(cox),
                getWithDataAndCoxFunctions(
                    {},
                    {},
                    cox,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctions(
                    causeImpactRef,
                    cox
                ),
                getAddLifeTableWithAddRefPop(
                    cox,
                    coxJson
                ),
                getAddRefPopWithAddLifeTable(
                    cox,
                    coxJson,
                    causeImpactRef
                ),
                getToJson(coxJson),
                getBaseAddAlgorithmFunction(
                    cox,
                    coxJson,
                    causeImpactRef
                ),
                getBaseReplaceCauseImpactRef(cox, coxJson)
            )
        }
    }
}

export interface ReplaceCauseImpactRefWithLifeTableFunctions {
    replaceCauseImpactRef: (causeImpactRef: CauseImpactRef) => GetSurvivalToTime & GetRiskToTime & AddLifeTableEvaluatorFunctions & WithDataAndCoxFunctionsAndLifeTableFunctions<{}> & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & AddAlgorithmWithLifeTableFunctions & AddRefPopWithAddLifeTableFunctions & ReplaceCauseImpactRefWithLifeTableFunctions & ToJson
}

export function getReplaceCauseImpactRefWithLifeTableFunctions(
    cox: Cox,
    refLifeTable: RefLifeTable,
    coxJson: CoxJson,
    useExFromLifeTableFromAge: number = 99
): ReplaceCauseImpactRefWithLifeTableFunctions {
    return {
        replaceCauseImpactRef: (causeImpactRef) => {
            return Object.assign(
                {},
                getGetSurvivalToTime(cox),
                getGetRiskToTime(cox),
                getGetLifeExpectancy(cox, refLifeTable, useExFromLifeTableFromAge),
                getGetLifeYearsLost(causeImpactRef, refLifeTable, cox),
                getGetSurvivalToAge(cox, refLifeTable, useExFromLifeTableFromAge),
                getWithDataAndCoxFunctionsAndLifeTableFunctions(
                    {}, 
                    {},
                    cox,
                    refLifeTable,
                    causeImpactRef,
                    useExFromLifeTableFromAge
                ),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    causeImpactRef,
                    cox,
                    refLifeTable,
                    useExFromLifeTableFromAge
                ),
                getToJson(coxJson),
                getReplaceCauseImpactRefWithLifeTableFunctions(
                    cox,
                    refLifeTable,
                    coxJson,
                    useExFromLifeTableFromAge
                ),
                getAddRefPopWithAddLifeTableFunctions(
                    cox,
                    coxJson,
                    refLifeTable,
                    causeImpactRef
                ),
                getAddAlgorithmWithLifeTableFunctions(
                    cox,
                    refLifeTable,
                    coxJson,
                    causeImpactRef,
                    useExFromLifeTableFromAge
                )
            )
        }
    }
}

export interface ReplaceCauseImpactRefWithAddRefPopFunctions {
    replaceCauseImpactRef: (causeImpactRef: CauseImpactRef) => GetSurvivalToTime & GetRiskToTime & GetHealthAge & WithDataAndCoxFunctionsAndAddRefPopFunctions<{}> & WithCauseImpactWithCoxFunctions & ToJson & ReplaceCauseImpactRefWithAddRefPopFunctions & AddLifeTableWithGetHealthAge & AddAlgorithmReturnsGetHealthAge
}

export function getReplaceCauseImpactRefWithAddRefPopFunctions(
    cox: Cox,
    coxJson: CoxJson,
    refPop: ReferencePopulation,
): ReplaceCauseImpactRefWithAddRefPopFunctions {
    return {
        replaceCauseImpactRef: (causeImpactRef) => {
            return Object.assign(
                {},
                getGetSurvivalToTime(cox),
                getGetRiskToTime(cox),
                getGetHealthAge(refPop, cox),
                getWithDataAndCoxFunctionsAndAddRefPopFunctions(
                    {},
                    {},
                    cox,
                    refPop,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctions(
                    causeImpactRef,
                    cox
                ),
                getReplaceCauseImpactRefWithAddRefPopFunctions(
                    cox,
                    coxJson,
                    refPop
                ),
                getAddLifeTableWithGetHealthAge(
                    cox,
                    coxJson,
                    refPop,causeImpactRef
                ),
                getAddAlgorithmReturnsGetHealthAgeFunction(
                    cox,
                    coxJson,
                    refPop
                )
            )
        }
    }
}

export interface FullReplaceCauseImpactRef {
    replaceCauseImpactRef: (causeImpactRef: CauseImpactRef) => GetSurvivalToTime & GetRiskToTime & GetHealthAge & AddLifeTableEvaluatorFunctions & CompleteWithData<{}> & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & ToJson & FullReplaceCauseImpactRef & AddAlgorithmWithGetHealthAgeAndLifeTableFunctions
}

export function getFullReplaceCauseImpactRef(
    cox: Cox,
    coxJson: CoxJson,
    refLifeTable: RefLifeTable,
    refPop: ReferencePopulation,
    useExFromLifeTableFromAge: number = 99
): FullReplaceCauseImpactRef {
    return {
        replaceCauseImpactRef: (causeImpactRef) => {
            return Object.assign(
                {},
                getGetSurvivalToTime(cox),
                getGetRiskToTime(cox),
                getGetLifeExpectancy(
                    cox, 
                    refLifeTable, 
                    useExFromLifeTableFromAge
                ),
                getGetSurvivalToAge(
                    cox,
                    refLifeTable,
                    useExFromLifeTableFromAge
                ),
                getGetLifeYearsLost(
                    causeImpactRef,
                    refLifeTable,
                    cox
                ),
                getGetHealthAge(refPop, cox),
                getCompleteWithData(
                    {}, 
                    {}, 
                    cox, 
                    refPop, 
                    refLifeTable,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    causeImpactRef,
                    cox,
                    refLifeTable,
                    useExFromLifeTableFromAge
                ),
                getToJson(coxJson),
                getFullReplaceCauseImpactRef(
                    cox, 
                    coxJson, 
                    refLifeTable, 
                    refPop, 
                    useExFromLifeTableFromAge
                ),
                getAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
                    cox,
                    coxJson,
                    refPop,
                    refLifeTable,
                    useExFromLifeTableFromAge,
                    causeImpactRef
                )
            )
        }
    }
}
