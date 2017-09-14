import { Cox } from '../cox';
import { GetRiskToTime, getGetRiskToTime, getGetLifeExpectancy, getGetLifeYearsLost, GetHealthAge, getGetHealthAge, getGetSurvivalToAge, GetSurvivalToTime, getGetSurvivalToTime } from '../algorithm-evaluator';
import { AddLifeTableWithAddRefPop, getAddLifeTableWithAddRefPop, AddLifeTableEvaluatorFunctions, AddLifeTableWithGetHealthAge, getAddLifeTableWithGetHealthAge } from './add-life-table';
import { AddRefPopWithAddLifeTable, getAddRefPopWithAddLifeTable, AddRefPopWithAddLifeTableFunctions, getAddRefPopWithAddLifeTableFunctions } from './add-ref-pop';
import { ToJson, getToJson } from './to-json';
import { CoxJson } from '../common/json-types';
import { WithDataAndCoxFunctions, getWithDataAndCoxFunctions, WithDataAndCoxFunctionsAndLifeTableFunctions, getWithDataAndCoxFunctionsAndLifeTableFunctions, WithDataAndCoxFunctionsAndAddRefPopFunctions, getWithDataAndCoxFunctionsAndAddRefPopFunctions, CompleteWithData, getCompleteWithData } from '../algorithm-evaluator';
import { RefLifeTable } from '../common/life-table';
import { ReferencePopulation } from '../health-age';

export type BaseAddAlgorithmFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithAddRefPop & AddRefPopWithAddLifeTable & ToJson & WithDataAndCoxFunctions<{}>;
export interface BaseAddAlgorithm {
    addAlgorithm: BaseAddAlgorithmFunction
}
export function curryBaseAddAlgorithmFunction(
    cox: Cox,
    coxJson: CoxJson
): BaseAddAlgorithmFunction {
    return (addedCox) => {
        addedCox;

        return Object.assign(
            getGetRiskToTime(cox),
            getGetSurvivalToTime(cox),
            getToJson(coxJson),
            getAddLifeTableWithAddRefPop(cox, coxJson),
            getAddRefPopWithAddLifeTable(cox, coxJson),
            getWithDataAndCoxFunctions({}),
        );
    }
}

export type AddAlgorithmReturnsLifeTableFunctionsFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableEvaluatorFunctions & AddRefPopWithAddLifeTableFunctions & ToJson & WithDataAndCoxFunctionsAndLifeTableFunctions<{}>;
export interface AddAlgorithmWithLifeTableFunctions {
    addAlgorithm: AddAlgorithmReturnsLifeTableFunctionsFunction;
}
export function curryAddAlgorithmWithLifeTableFunctionsFunction(
    cox: Cox,
    refLifeTable: RefLifeTable,
    coxJson: CoxJson,
): AddAlgorithmReturnsLifeTableFunctionsFunction {
    return (addedCox) => {
        addedCox;

        return Object.assign(
            getGetRiskToTime(cox),
            getGetSurvivalToTime(cox),
            getGetSurvivalToAge(cox, refLifeTable),
            getGetLifeExpectancy(cox, refLifeTable),
            getGetLifeYearsLost(coxJson.causeDeletedRef, refLifeTable),
            getToJson(coxJson),
            getAddRefPopWithAddLifeTableFunctions(cox, coxJson, refLifeTable),
            getWithDataAndCoxFunctionsAndLifeTableFunctions({})
        )
    }
}

export type AddAlgorithmReturnsGetHealthAgeFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithGetHealthAge & GetHealthAge & WithDataAndCoxFunctionsAndAddRefPopFunctions<{}>;
export interface AddAlgorithmReturnsGetHealthAge {
    addAlgorithm: AddAlgorithmReturnsGetHealthAgeFunction;
}
export function curryAddAlgorithmReturnsGetHealthAgeFunction(
    cox: Cox,
    coxJson: CoxJson,
    refPop: ReferencePopulation
): AddAlgorithmReturnsGetHealthAgeFunction {
    return (addedCox) => {
        addedCox;

        return Object.assign(
            {},
            getGetRiskToTime(cox),
            getGetSurvivalToTime(cox), 
            getGetHealthAge(refPop),
            getToJson(coxJson),
            getAddLifeTableWithGetHealthAge(cox, coxJson, refPop),
            getWithDataAndCoxFunctionsAndAddRefPopFunctions({})
        );
    }
}

export type AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & GetHealthAge & AddLifeTableEvaluatorFunctions & CompleteWithData<{}> & ToJson;
export interface AddAlgorithmWithGetHealthAgeAndLifeTableFunctions {
    addAlgorithm: AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction;
}
export function curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
    cox: Cox,
    coxJson: CoxJson,
    refPop: ReferencePopulation,
    refLifeTable: RefLifeTable
): AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction {
    return () => {
        return Object.assign(
            {},
            getGetRiskToTime(cox),
            getGetSurvivalToAge(cox, refLifeTable),
            getGetSurvivalToTime(cox),
            getGetHealthAge(refPop),
            getGetLifeExpectancy(cox, refLifeTable),
            getGetLifeYearsLost(coxJson.causeDeletedRef, refLifeTable),
            getToJson(coxJson),
            getCompleteWithData({})
        )
    }
}