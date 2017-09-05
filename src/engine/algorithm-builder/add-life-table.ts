import { GetRiskToTime, getGetRiskToTime, GetSurvivalToTime, getGetSurvivalToAge, GetLifeExpectancy, getGetLifeExpectancy, GetLifeYearsLost, getGetLifeYearsLost, GetHealthAge, getGetHealthAge, GetSurvivalToAge, getGetSurvivalToTime } from '../algorithm-evaluator';
import { RefLifeTable } from '../common/life-table';
import { Cox } from '../cox/cox';
import { ToJson, getToJson } from './to-json';
import { CoxJson } from '../common/json-types';
import { AddRefPopWithAddLifeTableFunctions, curryAddRefPopWithGetLifeExpectancy } from './add-ref-pop';
import { ReferencePopulation } from '../health-age/reference-population';
import { WithDataAndLifeTableFunctions, curryWithDataAndLifeTableFunctionsFunction, FullWithData, curryFullWithDataFunction } from '../algorithm-evaluator';
import { AddAlgorithmWithLifeTableFunctions, curryAddAlgorithmWithLifeTableFunctionsFunction, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions, curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';

export type AddLifeTableEvaluatorFunctions = GetLifeExpectancy & GetLifeYearsLost & GetSurvivalToAge;

export type AddLifeTableFunction<T extends AddRefPopWithAddLifeTableFunctions | GetHealthAge, U extends WithDataAndLifeTableFunctions<{}> | FullWithData<{}>, V extends AddAlgorithmWithLifeTableFunctions | AddAlgorithmWithGetHealthAgeAndLifeTableFunctions> = (lifeTable: RefLifeTable) => GetSurvivalToTime & GetRiskToTime & AddLifeTableEvaluatorFunctions & ToJson & T & U & V;

export type AddLifeTableFunctionWithAddRefPop = AddLifeTableFunction<AddRefPopWithAddLifeTableFunctions, WithDataAndLifeTableFunctions<{}>, AddAlgorithmWithLifeTableFunctions>;
export type AddLifeTableFunctionWithGetHealthAge = AddLifeTableFunction<GetHealthAge, FullWithData<{}>, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions>;

export interface AddLifeTableWithAddRefPop {
    addLifeTable: AddLifeTableFunctionWithAddRefPop;
}
export interface AddLifeTableWithGetHealthAge {
    addLifeTable: AddLifeTableFunctionWithGetHealthAge;
}

export function curryAddLifeTableFunctionWithAddRefPop(
    cox: Cox,
    coxJson: CoxJson
): AddLifeTableFunctionWithAddRefPop {
    return (lifeTable) => {
        return Object.assign(
            {},
            getGetRiskToTime(cox),
            getGetSurvivalToTime(cox),
            getGetSurvivalToAge(cox, lifeTable),
            getGetLifeExpectancy(cox, lifeTable),
            getGetLifeYearsLost(coxJson.causeDeletedRef, lifeTable),
            getToJson(coxJson),
            {
                withData: curryWithDataAndLifeTableFunctionsFunction({}),
                addRefPop: curryAddRefPopWithGetLifeExpectancy(
                    cox,
                    coxJson,
                    lifeTable
                ),
                addAlgorithm: curryAddAlgorithmWithLifeTableFunctionsFunction(
                    cox,
                    lifeTable,
                    coxJson
                )
            })
    }
}

export function curryAddLifeTableFunctionWithGetHealthAge(
    cox: Cox,
    coxJson: CoxJson,
    refPop: ReferencePopulation
): AddLifeTableFunctionWithGetHealthAge {
    return (lifeTable) => {
        return Object.assign(
            {},
            getGetRiskToTime(cox),
            getGetSurvivalToAge(cox, lifeTable),
            getGetSurvivalToTime(cox),
            getGetHealthAge(refPop),
            getGetLifeExpectancy(cox, lifeTable),
            getGetLifeYearsLost(coxJson.causeDeletedRef, lifeTable),
            getToJson(coxJson),
            {
                withData: curryFullWithDataFunction({}),
                addAlgorithm: curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
                    cox,
                    coxJson,
                    refPop,
                    lifeTable
                )
            }
        )
    }
}
