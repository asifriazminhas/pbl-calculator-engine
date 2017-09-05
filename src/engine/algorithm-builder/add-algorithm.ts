import { Cox } from '../cox';
import { GetRiskToTime, getGetRiskToTime, getGetLifeExpectancy, getGetLifeYearsLost, GetHealthAge, getGetHealthAge, getGetSurvivalToAge, GetSurvivalToTime, getGetSurvivalToTime } from '../algorithm-evaluator';
import { AddLifeTableWithAddRefPop, curryAddLifeTableFunctionWithAddRefPop, AddLifeTableEvaluatorFunctions, AddLifeTableWithGetHealthAge, curryAddLifeTableFunctionWithGetHealthAge } from './add-life-table';
import { AddRefPopWithAddLifeTable, curryAddRefPopWithAddLifeTable, AddRefPopWithAddLifeTableFunctions, curryAddRefPopWithGetLifeExpectancy } from './add-ref-pop';
import { ToJson, curryToJsonFunction } from './to-json';
import { CoxJson } from '../common/json-types';
import { BaseWithData, curryBaseWithDataFunction, WithDataAndLifeTableFunctions, curryWithDataAndLifeTableFunctionsFunction, WithDataAndGetHealthAge, curryWithDataAndGetHealthAgeFunction, FullWithData, curryFullWithDataFunction } from '../algorithm-evaluator';
import { RefLifeTable } from '../common/life-table';
import { ReferencePopulation } from '../health-age';

export type BaseAddAlgorithmFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithAddRefPop & AddRefPopWithAddLifeTable & ToJson & BaseWithData<{}>;
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
            {
                addLifeTable: curryAddLifeTableFunctionWithAddRefPop(
                    cox,
                    coxJson
                ),
                addRefPop: curryAddRefPopWithAddLifeTable(
                    cox,
                    coxJson
                ),
                toJson: curryToJsonFunction(
                    coxJson
                ),
                withData: curryBaseWithDataFunction(
                    {}
                )
            }
        );
    }
}

export type AddAlgorithmReturnsLifeTableFunctionsFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableEvaluatorFunctions & AddRefPopWithAddLifeTableFunctions & ToJson & WithDataAndLifeTableFunctions<{}>;
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
            {
                addRefPop: curryAddRefPopWithGetLifeExpectancy(
                    cox,
                    coxJson,
                    refLifeTable
                ),
                toJson: curryToJsonFunction(
                    coxJson
                ),
                withData: curryWithDataAndLifeTableFunctionsFunction(
                    {}
                )
            }
        )
    }
}

export type AddAlgorithmReturnsGetHealthAgeFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithGetHealthAge & GetHealthAge & WithDataAndGetHealthAge<{}>;
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
            {
                addLifeTable: curryAddLifeTableFunctionWithGetHealthAge(
                    cox,
                    coxJson,
                    refPop
                ),
                toJson: curryToJsonFunction(coxJson),
                withData: curryWithDataAndGetHealthAgeFunction({})
            }
        );
    }
}

export type AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & GetHealthAge & AddLifeTableEvaluatorFunctions & FullWithData<{}> & ToJson;
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
            {
                toJson: curryToJsonFunction(coxJson),
                withData: curryFullWithDataFunction({})
            }
        )
    }
}