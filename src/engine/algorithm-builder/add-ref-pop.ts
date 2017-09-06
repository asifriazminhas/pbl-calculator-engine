import { GetSurvivalToTime, getGetSurvivalToTime, GetRiskToTime, getGetRiskToTime, getGetLifeYearsLost, getGetLifeExpectancy, GetHealthAge, getGetHealthAge, getGetSurvivalToAge } from '../algorithm-evaluator';
import { AddLifeTableWithGetHealthAge, getAddLifeTableWithGetHealthAge, AddLifeTableEvaluatorFunctions } from './add-life-table';
import { ToJson, getToJson } from './to-json';
import { ReferencePopulation } from '../health-age/reference-population';
import { CoxJson } from '../common/json-types';
import { Cox } from '../cox/cox';
import { RefLifeTable } from '../common/life-table';
import { WithDataAndGetHealthAge, curryWithDataAndGetHealthAgeFunction, FullWithData, curryFullWithDataFunction } from '../algorithm-evaluator';
import { AddAlgorithmReturnsGetHealthAge, curryAddAlgorithmReturnsGetHealthAgeFunction, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions,curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';

export type AddRefPopFunction<T extends AddLifeTableWithGetHealthAge | AddLifeTableEvaluatorFunctions, U extends WithDataAndGetHealthAge<{}> | FullWithData<{}>, V extends AddAlgorithmReturnsGetHealthAge | AddAlgorithmWithGetHealthAgeAndLifeTableFunctions> = (
    refPop: ReferencePopulation
) => GetSurvivalToTime & GetRiskToTime & ToJson & GetHealthAge & T & U & V;

export interface AddRefPopWithAddLifeTable {
    addRefPop: AddRefPopFunction<AddLifeTableWithGetHealthAge, WithDataAndGetHealthAge<{}>, AddAlgorithmReturnsGetHealthAge>;
}

export interface AddRefPopWithAddLifeTableFunctions {
    addRefPop: AddRefPopFunction<AddLifeTableEvaluatorFunctions, FullWithData<{}>, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions>;
}

export function getAddRefPopWithAddLifeTable(
    cox: Cox,
    coxJson: CoxJson
): AddRefPopWithAddLifeTable {
    return {
        addRefPop: (refPop) => {
            return Object.assign(
                {},
                getGetRiskToTime(cox),
                getGetSurvivalToTime(cox),
                getGetHealthAge(refPop),
                getToJson(coxJson),
                getAddLifeTableWithGetHealthAge(cox, coxJson, refPop),
                {
                    withData: curryWithDataAndGetHealthAgeFunction({}),
                    addAlgorithm: curryAddAlgorithmReturnsGetHealthAgeFunction(
                        cox,
                        coxJson,
                        refPop
                    )
                }
            )
        }
    }
}

export function getAddRefPopWithAddLifeTableFunctions(
    cox: Cox,
    coxJson: CoxJson,
    refLifeTable: RefLifeTable
): AddRefPopWithAddLifeTableFunctions {
    return {
        addRefPop: (refPop) => {
            return Object.assign(
                {},
                getGetRiskToTime(cox),
                getGetSurvivalToTime(cox),
                getGetSurvivalToAge(cox, refLifeTable),
                getGetHealthAge(refPop),
                getGetLifeExpectancy(cox, refLifeTable),
                getGetLifeYearsLost(coxJson.causeDeletedRef, refLifeTable),
                getToJson(coxJson),
                {
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
}