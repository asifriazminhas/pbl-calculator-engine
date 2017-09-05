import { GetSurvivalToTime, getGetSurvivalToTime, GetRiskToTime, getGetRiskToTime, getGetLifeYearsLost, getGetLifeExpectancy, GetHealthAge, getGetHealthAge, getGetSurvivalToAge } from '../algorithm-evaluator';
import { AddLifeTableWithGetHealthAge, curryAddLifeTableFunctionWithGetHealthAge, AddLifeTableEvaluatorFunctions } from './add-life-table';
import { ToJson, curryToJsonFunction } from './to-json';
import { ReferencePopulation } from '../health-age/reference-population';
import { CoxJson } from '../common/json-types';
import { Cox } from '../cox/cox';
import { RefLifeTable } from '../common/life-table';
import { WithDataAndGetHealthAge, curryWithDataAndGetHealthAgeFunction, FullWithData, curryFullWithDataFunction } from '../algorithm-evaluator';
import { AddAlgorithmReturnsGetHealthAge, curryAddAlgorithmReturnsGetHealthAgeFunction, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions,curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';

export type AddRefPopFunction<T extends AddLifeTableWithGetHealthAge | AddLifeTableEvaluatorFunctions, U extends WithDataAndGetHealthAge<{}> | FullWithData<{}>, V extends AddAlgorithmReturnsGetHealthAge | AddAlgorithmWithGetHealthAgeAndLifeTableFunctions> = (
    refPop: ReferencePopulation
) => GetSurvivalToTime & GetRiskToTime & ToJson & GetHealthAge & T & U & V;
export type AddRefPopFunctionWithAddLifeTable = AddRefPopFunction<AddLifeTableWithGetHealthAge, WithDataAndGetHealthAge<{}>, AddAlgorithmReturnsGetHealthAge>;
export type AddRefPopFunctionWithAddLifeTableFunctions = AddRefPopFunction<AddLifeTableEvaluatorFunctions, FullWithData<{}>, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions>;

export interface AddRefPopWithAddLifeTable {
    addRefPop: AddRefPopFunctionWithAddLifeTable;
}

export interface AddRefPopWithAddLifeTableFunctions {
    addRefPop: AddRefPopFunctionWithAddLifeTableFunctions;
}

export function curryAddRefPopWithAddLifeTable(
    cox: Cox,
    coxJson: CoxJson
): AddRefPopFunctionWithAddLifeTable {
    return (refPop) => {
        return Object.assign(
            {},
            getGetRiskToTime(cox),
            getGetSurvivalToTime(cox),
            getGetHealthAge(refPop),
            {
                toJson: curryToJsonFunction(coxJson),
                withData: curryWithDataAndGetHealthAgeFunction({}),
                addLifeTable: curryAddLifeTableFunctionWithGetHealthAge(
                    cox,
                    coxJson,
                    refPop
                ),
                addAlgorithm: curryAddAlgorithmReturnsGetHealthAgeFunction(
                    cox,
                    coxJson,
                    refPop
                )
            }
        )
    }
}

export function curryAddRefPopWithGetLifeExpectancy(
    cox: Cox,
    coxJson: CoxJson,
    refLifeTable: RefLifeTable
): AddRefPopFunctionWithAddLifeTableFunctions {
    return (refPop) => {
        return Object.assign(
            {},
            getGetRiskToTime(cox),
            getGetSurvivalToTime(cox),
            getGetSurvivalToAge(cox, refLifeTable),
            getGetHealthAge(refPop),
            getGetLifeExpectancy(cox, refLifeTable),
            getGetLifeYearsLost(coxJson.causeDeletedRef, refLifeTable),
            {
                toJson: curryToJsonFunction(coxJson),
                withData: curryFullWithDataFunction({}),
                addAlgorithm: curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
                    cox,
                    coxJson,
                    refPop,
                    refLifeTable
                )
            }
        )
    }
}