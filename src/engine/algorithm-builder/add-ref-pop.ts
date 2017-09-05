import { GetSurvivalToTime, curryGetSurvivalToTimeFunction, GetRiskToTime, curryGetRiskToTimeFunction, curryGetLifeYearsLostFunction, curryGetLifeExpectancyFunction, GetHealthAge, curryGetHeathAgeFunction } from '../algorithm-evaluator';
import { AddLifeTableWithGetHealthAge, curryAddLifeTableFunctionWithGetHealthAge, AddLifeTableEvaluatorFunctions } from './add-life-table';
import { ToJson, curryToJsonFunction } from './to-json';
import { ReferencePopulation } from '../health-age/reference-population';
import { CoxJson } from '../common/json-types';
import { Cox } from '../cox/cox';
import { RefLifeTable } from '../life-expectancy/life-expectancy';
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
        return {
            getSurvivalToTime: curryGetSurvivalToTimeFunction(cox),
            getRiskToTime: curryGetRiskToTimeFunction(cox),
            toJson: curryToJsonFunction(coxJson),
            getHealthAge: curryGetHeathAgeFunction(refPop),
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
    }
}

export function curryAddRefPopWithGetLifeExpectancy(
    cox: Cox,
    coxJson: CoxJson,
    refLifeTable: RefLifeTable
): AddRefPopFunctionWithAddLifeTableFunctions {
    return (refPop) => {
        return {
            getSurvivalToTime: curryGetSurvivalToTimeFunction(cox),
            getRiskToTime: curryGetRiskToTimeFunction(cox),
            toJson: curryToJsonFunction(coxJson),
            getHealthAge: curryGetHeathAgeFunction(refPop),
            getLifeExpectancy: curryGetLifeExpectancyFunction(
                cox,
                refLifeTable
            ),
            withData: curryFullWithDataFunction({}),
            getLifeYearsLost: curryGetLifeYearsLostFunction(
                coxJson.causeDeletedRef,
                refLifeTable
            ),
            addAlgorithm: curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
                cox,
                coxJson,
                refPop,
                refLifeTable
            )
        };
    }
}