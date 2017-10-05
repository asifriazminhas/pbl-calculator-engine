import { GetRiskToTime, getGetRiskToTime, getGetLifeExpectancy, getGetLifeYearsLost, GetHealthAge, getGetHealthAge, getGetSurvivalToAge, GetSurvivalToTime, getGetSurvivalToTime } from '../algorithm-evaluator';
import { AddLifeTableWithAddRefPop, getAddLifeTableWithAddRefPop, AddLifeTableEvaluatorFunctions, AddLifeTableWithGetHealthAge, getAddLifeTableWithGetHealthAge } from './add-life-table';
import { AddRefPopWithAddLifeTable, getAddRefPopWithAddLifeTable, AddRefPopWithAddLifeTableFunctions, getAddRefPopWithAddLifeTableFunctions } from './add-ref-pop';
import { ToJson, getToJson } from './to-json';
import { WithDataAndCoxFunctions, getWithDataAndCoxFunctions, WithDataAndCoxFunctionsAndLifeTableFunctions, getWithDataAndCoxFunctionsAndLifeTableFunctions, WithDataAndCoxFunctionsAndAddRefPopFunctions, getWithDataAndCoxFunctionsAndAddRefPopFunctions, CompleteWithData, getCompleteWithData, WithCauseImpactWithCoxFunctions, getWithCauseImpactWithCoxFunctions, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions } from '../algorithm-evaluator';
import { RefLifeTable } from '../life-table';
import { ReferencePopulation } from '../health-age';
import { CauseImpactRefTypes } from '../cause-impact';
import { BaseReplaceCauseImpactRef, getBaseReplaceCauseImpactRef, ReplaceCauseImpactRefWithLifeTableFunctions, getReplaceCauseImpactRefWithLifeTableFunctions, ReplaceCauseImpactRefWithAddRefPopFunctions, getReplaceCauseImpactRefWithAddRefPopFunctions, FullReplaceCauseImpactRef, getFullReplaceCauseImpactRef } from './replace-cause-impact-ref';
import { ModelTypes, JsonModelTypes } from '../model';

export type BaseAddAlgorithmFunction = (
    addedModel: ModelTypes
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithAddRefPop & AddRefPopWithAddLifeTable & ToJson & WithDataAndCoxFunctions<{}> & WithCauseImpactWithCoxFunctions & BaseReplaceCauseImpactRef;
export interface BaseAddAlgorithm {
    addAlgorithm: BaseAddAlgorithmFunction
}
export function getBaseAddAlgorithmFunction(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes
): BaseAddAlgorithm {
    return {
        addAlgorithm: (addedModel) => {
            addedModel;

            return Object.assign(
                getGetRiskToTime(model),
                getGetSurvivalToTime(model),
                getToJson(modelJson),
                getAddLifeTableWithAddRefPop(model, modelJson, causeImpactRef),
                getAddRefPopWithAddLifeTable(model, modelJson, causeImpactRef),
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
                getBaseReplaceCauseImpactRef(model, modelJson)
            );
        }
    }
}

export type AddAlgorithmReturnsLifeTableFunctionsFunction = (
    addedModel: ModelTypes
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableEvaluatorFunctions & AddRefPopWithAddLifeTableFunctions & ToJson & WithDataAndCoxFunctionsAndLifeTableFunctions<{}> & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & ReplaceCauseImpactRefWithLifeTableFunctions;
export interface AddAlgorithmWithLifeTableFunctions {
    addAlgorithm: AddAlgorithmReturnsLifeTableFunctionsFunction;
}
export function getAddAlgorithmWithLifeTableFunctions(
    model: ModelTypes,
    refLifeTable: RefLifeTable,
    modelJson: JsonModelTypes,
    causeImpactRef?: CauseImpactRefTypes,
    useExFromLifeTableFromAge: number = 99
): AddAlgorithmWithLifeTableFunctions {
    return {
        addAlgorithm: (addedModel) => {
            addedModel;

            return Object.assign(
                getGetRiskToTime(model),
                getGetSurvivalToTime(model),
                getGetSurvivalToAge(model, refLifeTable),
                getGetLifeExpectancy(model, refLifeTable),
                getGetLifeYearsLost(model, modelJson, refLifeTable, causeImpactRef),
                getToJson(modelJson),
                getAddRefPopWithAddLifeTableFunctions(
                    model, modelJson, refLifeTable, causeImpactRef),
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
                getReplaceCauseImpactRefWithLifeTableFunctions(
                    model,
                    refLifeTable,
                    modelJson,
                    useExFromLifeTableFromAge
                )
            )
        }
    }
}

export type AddAlgorithmReturnsGetHealthAgeFunction = (
    addedModel: ModelTypes
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithGetHealthAge & GetHealthAge & WithDataAndCoxFunctionsAndAddRefPopFunctions<{}> & WithCauseImpactWithCoxFunctions & ReplaceCauseImpactRefWithAddRefPopFunctions;
export interface AddAlgorithmReturnsGetHealthAge {
    addAlgorithm: AddAlgorithmReturnsGetHealthAgeFunction;
}
export function getAddAlgorithmReturnsGetHealthAgeFunction(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refPop: ReferencePopulation,
    causeImpactRef?: CauseImpactRefTypes
): AddAlgorithmReturnsGetHealthAge {
    return {
        addAlgorithm: (addedCox) => {
            addedCox;

            return Object.assign(
                {},
                getGetRiskToTime(model),
                getGetSurvivalToTime(model), 
                getGetHealthAge(refPop, model),
                getToJson(modelJson),
                getAddLifeTableWithGetHealthAge(model, modelJson, refPop),
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
                )
            );
        }
    }
}

export type AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction = (
    addedModel: ModelTypes
) => GetSurvivalToTime & GetRiskToTime & GetHealthAge & AddLifeTableEvaluatorFunctions & CompleteWithData<{}> & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & ToJson & FullReplaceCauseImpactRef;
export interface AddAlgorithmWithGetHealthAgeAndLifeTableFunctions {
    addAlgorithm: AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction;
}
export function getAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
    model: ModelTypes,
    modelJson: JsonModelTypes,
    refPop: ReferencePopulation,
    refLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99,
    causeImpactRef?: CauseImpactRefTypes
): AddAlgorithmWithGetHealthAgeAndLifeTableFunctions {
    return {
        addAlgorithm: () => {
            return Object.assign(
                {},
                getGetRiskToTime(model),
                getGetSurvivalToAge(model, refLifeTable),
                getGetSurvivalToTime(model),
                getGetHealthAge(refPop, model),
                getGetLifeExpectancy(model, refLifeTable),
                getGetLifeYearsLost(
                    model, modelJson, refLifeTable, causeImpactRef),
                getToJson(modelJson),
                getCompleteWithData(
                    {}, 
                    {}, 
                    model, 
                    modelJson,
                    refPop,
                    refLifeTable,
                    causeImpactRef, 
                    useExFromLifeTableFromAge
                ),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    model, modelJson, refLifeTable
                ),
                getFullReplaceCauseImpactRef(
                    model,
                    modelJson,
                    refLifeTable,
                    refPop,
                    useExFromLifeTableFromAge
                )
            )
        }
    }
}