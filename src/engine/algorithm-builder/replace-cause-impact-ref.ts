import { GetSurvivalToTime, getGetSurvivalToTime, GetRiskToTime, getGetRiskToTime, WithDataAndCoxFunctions, getWithDataAndCoxFunctions, WithCauseImpactWithCoxFunctions, getWithCauseImpactWithCoxFunctions, getGetLifeExpectancy, getGetSurvivalToAge, getGetLifeYearsLost, WithDataAndCoxFunctionsAndLifeTableFunctions, getWithDataAndCoxFunctionsAndLifeTableFunctions, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions, GetHealthAge, getGetHealthAge, WithDataAndCoxFunctionsAndAddRefPopFunctions, getWithDataAndCoxFunctionsAndAddRefPopFunctions, CompleteWithData, getCompleteWithData } from '../algorithm-evaluator';
import { AddLifeTableWithAddRefPop, getAddLifeTableWithAddRefPop, AddLifeTableEvaluatorFunctions, AddLifeTableWithGetHealthAge, getAddLifeTableWithGetHealthAge } from './add-life-table';
import { AddRefPopWithAddLifeTable, getAddRefPopWithAddLifeTable, AddRefPopWithAddLifeTableFunctions, getAddRefPopWithAddLifeTableFunctions } from './add-ref-pop';
import { ToJson, getToJson } from './to-json';
import { BaseAddAlgorithm, getBaseAddAlgorithmFunction, AddAlgorithmWithLifeTableFunctions, getAddAlgorithmWithLifeTableFunctions, AddAlgorithmReturnsGetHealthAge, getAddAlgorithmReturnsGetHealthAgeFunction, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions, getAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';
import { CauseImpactRefTypes } from '../cause-impact';
import { RefLifeTable } from '../life-table';
import { ReferencePopulation } from '../health-age';
import { ModelTypes, JsonModelTypes } from '../model';

export interface BaseReplaceCauseImpactRef {
    replaceCauseImpactRef: (causeImpactRef: CauseImpactRefTypes) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithAddRefPop & AddRefPopWithAddLifeTable & ToJson & BaseAddAlgorithm & WithDataAndCoxFunctions<{}> & WithCauseImpactWithCoxFunctions & BaseReplaceCauseImpactRef
}

export function getBaseReplaceCauseImpactRef(
    model: ModelTypes,
    modelJson: JsonModelTypes
): BaseReplaceCauseImpactRef {
    return {
        replaceCauseImpactRef: (causeImpactRef) => {
            return Object.assign(
                {},
                getGetSurvivalToTime(model),
                getGetRiskToTime(model),
                getWithDataAndCoxFunctions(
                    {},
                    {},
                    model,
                    modelJson,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctions(
                    model,
                    modelJson,
                    causeImpactRef
                ),
                getAddLifeTableWithAddRefPop(
                    model,
                    modelJson,
                    causeImpactRef
                ),
                getAddRefPopWithAddLifeTable(
                    model,
                    modelJson,
                    causeImpactRef
                ),
                getToJson(modelJson),
                getBaseAddAlgorithmFunction(
                    model,
                    modelJson,
                    causeImpactRef
                ),
                getBaseReplaceCauseImpactRef(model, modelJson)
            )
        }
    }
}

export interface ReplaceCauseImpactRefWithLifeTableFunctions {
    replaceCauseImpactRef: (causeImpactRef: CauseImpactRefTypes) => GetSurvivalToTime & GetRiskToTime & AddLifeTableEvaluatorFunctions & WithDataAndCoxFunctionsAndLifeTableFunctions<{}> & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & AddAlgorithmWithLifeTableFunctions & AddRefPopWithAddLifeTableFunctions & ReplaceCauseImpactRefWithLifeTableFunctions & ToJson
}

export function getReplaceCauseImpactRefWithLifeTableFunctions(
    model: ModelTypes,
    refLifeTable: RefLifeTable,
    modelJson: JsonModelTypes,
    useExFromLifeTableFromAge: number = 99
): ReplaceCauseImpactRefWithLifeTableFunctions {
    return {
        replaceCauseImpactRef: (causeImpactRef) => {
            return Object.assign(
                {},
                getGetSurvivalToTime(model),
                getGetRiskToTime(model),
                getGetLifeExpectancy(model, refLifeTable, useExFromLifeTableFromAge),
                getGetLifeYearsLost(
                    model, modelJson, refLifeTable, causeImpactRef),
                getGetSurvivalToAge(
                    model, refLifeTable, useExFromLifeTableFromAge),
                getWithDataAndCoxFunctionsAndLifeTableFunctions(
                    {}, 
                    {},
                    model,
                    modelJson,
                    refLifeTable,
                    causeImpactRef,
                    useExFromLifeTableFromAge
                ),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    model,
                    modelJson,
                    refLifeTable,
                    useExFromLifeTableFromAge,
                    causeImpactRef
                ),
                getToJson(modelJson),
                getReplaceCauseImpactRefWithLifeTableFunctions(
                    model,
                    refLifeTable,
                    modelJson,
                    useExFromLifeTableFromAge
                ),
                getAddRefPopWithAddLifeTableFunctions(
                    model,
                    modelJson,
                    refLifeTable,
                    causeImpactRef
                ),
                getAddAlgorithmWithLifeTableFunctions(
                    model,
                    refLifeTable,
                    modelJson,
                    causeImpactRef,
                    useExFromLifeTableFromAge
                )
            )
        }
    }
}

export interface ReplaceCauseImpactRefWithAddRefPopFunctions {
    replaceCauseImpactRef: (causeImpactRef: CauseImpactRefTypes) => GetSurvivalToTime & GetRiskToTime & GetHealthAge & WithDataAndCoxFunctionsAndAddRefPopFunctions<{}> & WithCauseImpactWithCoxFunctions & ToJson & ReplaceCauseImpactRefWithAddRefPopFunctions & AddLifeTableWithGetHealthAge & AddAlgorithmReturnsGetHealthAge
}

export function getReplaceCauseImpactRefWithAddRefPopFunctions(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refPop: ReferencePopulation,
): ReplaceCauseImpactRefWithAddRefPopFunctions {
    return {
        replaceCauseImpactRef: (causeImpactRef) => {
            return Object.assign(
                {},
                getGetSurvivalToTime(model),
                getGetRiskToTime(model),
                getGetHealthAge(refPop, model),
                getWithDataAndCoxFunctionsAndAddRefPopFunctions(
                    {},
                    {},
                    model,
                    modelJson,
                    refPop,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctions(
                    model,
                    modelJson,
                    causeImpactRef
                ),
                getReplaceCauseImpactRefWithAddRefPopFunctions(
                    model,
                    modelJson,
                    refPop
                ),
                getAddLifeTableWithGetHealthAge(
                    model,
                    modelJson,
                    refPop,
                    causeImpactRef
                ),
                getAddAlgorithmReturnsGetHealthAgeFunction(
                    model,
                    modelJson,
                    refPop,
                    causeImpactRef
                )
            )
        }
    }
}

export interface FullReplaceCauseImpactRef {
    replaceCauseImpactRef: (causeImpactRef: CauseImpactRefTypes) => GetSurvivalToTime & GetRiskToTime & GetHealthAge & AddLifeTableEvaluatorFunctions & CompleteWithData<{}> & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & ToJson & FullReplaceCauseImpactRef & AddAlgorithmWithGetHealthAgeAndLifeTableFunctions
}

export function getFullReplaceCauseImpactRef(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refLifeTable: RefLifeTable,
    refPop: ReferencePopulation,
    useExFromLifeTableFromAge: number = 99
): FullReplaceCauseImpactRef {
    return {
        replaceCauseImpactRef: (causeImpactRef) => {
            return Object.assign(
                {},
                getGetSurvivalToTime(model),
                getGetRiskToTime(model),
                getGetLifeExpectancy(
                    model, 
                    refLifeTable, 
                    useExFromLifeTableFromAge
                ),
                getGetSurvivalToAge(
                    model,
                    refLifeTable,
                    useExFromLifeTableFromAge
                ),
                getGetLifeYearsLost(
                    model,
                    modelJson,
                    refLifeTable,
                    causeImpactRef
                ),
                getGetHealthAge(refPop, model),
                getCompleteWithData(
                    {}, 
                    {}, 
                    model,
                    modelJson, 
                    refPop, 
                    refLifeTable,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    model,
                    modelJson,
                    refLifeTable,
                    useExFromLifeTableFromAge,
                    causeImpactRef
                ),
                getToJson(modelJson),
                getFullReplaceCauseImpactRef(
                    model, 
                    modelJson, 
                    refLifeTable, 
                    refPop, 
                    useExFromLifeTableFromAge
                ),
                getAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
                    model,
                    modelJson,
                    refPop,
                    refLifeTable,
                    useExFromLifeTableFromAge,
                    causeImpactRef
                )
            )
        }
    }
}
