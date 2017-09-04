import { Cox } from '../cox';
import { GetSurvivalToTime, curryGetSurvivalToTimeFunction } from './get-survival-to-time';
import { GetRisk, curryGetRiskFunction } from './get-risk';
import { AddLifeTableWithAddRefPop, curryAddLifeTableFunctionWithAddRefPop, AddLifeTableEvaluatorFunctions, AddLifeTableWithGetHealthAge, curryAddLifeTableFunctionWithGetHealthAge } from './add-life-table';
import { curryGetLifeExpectancyFunction } from './get-life-expectancy';
import { curryGetLifeYearsLostFunction } from './get-life-years-lost';
import { AddRefPopWithAddLifeTable, curryAddRefPopWithAddLifeTable, AddRefPopWithAddLifeTableFunctions, curryAddRefPopWithGetLifeExpectancy } from './add-ref-pop';
import { ToJson, curryToJsonFunction } from './to-json';
import { CoxJson } from '../common/json-types';
import { BaseWithData, curryBaseWithDataFunction, WithDataAndLifeTableFunctions, curryWithDataAndLifeTableFunctionsFunction, WithDataAndGetHealthAge, curryWithDataAndGetHealthAgeFunction, FullWithData, curryFullWithDataFunction } from '../algorithm-evaluator';
import { RefLifeTable } from '../life-expectancy';
import { GetHealthAge, curryGetHeathAgeFunction } from './get-health-age';
import { ReferencePopulation } from '../health-age';

export type BaseAddAlgorithmFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRisk & AddLifeTableWithAddRefPop & AddRefPopWithAddLifeTable & ToJson & BaseWithData<{}>;
export interface BaseAddAlgorithm {
    addAlgorithm: BaseAddAlgorithmFunction
}
export function curryBaseAddAlgorithmFunction(
    cox: Cox,
    coxJson: CoxJson
): BaseAddAlgorithmFunction {
    return (addedCox) => {
        addedCox;

        return {
            getSurvivalToTime: curryGetSurvivalToTimeFunction(
                cox
            ),
            getRisk: curryGetRiskFunction(
                cox
            ),
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
    }
}

export type AddAlgorithmReturnsLifeTableFunctionsFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRisk & AddLifeTableEvaluatorFunctions & AddRefPopWithAddLifeTableFunctions & ToJson & WithDataAndLifeTableFunctions<{}>;
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

        return {
            getSurvivalToTime: curryGetSurvivalToTimeFunction(
                cox
            ),
            getRisk: curryGetRiskFunction(
                cox
            ),
            getLifeExpectancy: curryGetLifeExpectancyFunction(
                cox,
                refLifeTable
            ),
            getLifeYearsLost: curryGetLifeYearsLostFunction(
                coxJson.causeDeletedRef,
                refLifeTable
            ),
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
    }
}

export type AddAlgorithmReturnsGetHealthAgeFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRisk & AddLifeTableWithGetHealthAge & GetHealthAge & WithDataAndGetHealthAge<{}>;
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

        return {
            getSurvivalToTime: curryGetSurvivalToTimeFunction(cox),
            getRisk: curryGetRiskFunction(cox),
            addLifeTable: curryAddLifeTableFunctionWithGetHealthAge(
                cox,
                coxJson,
                refPop
            ),
            getHealthAge: curryGetHeathAgeFunction(
                refPop
            ),
            toJson: curryToJsonFunction(coxJson),
            withData: curryWithDataAndGetHealthAgeFunction({})
        }
    }
}

export type AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRisk & GetHealthAge & AddLifeTableEvaluatorFunctions & FullWithData<{}> & ToJson;
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
        return {
            getSurvivalToTime: curryGetSurvivalToTimeFunction(cox),
            getRisk: curryGetRiskFunction(cox),
            getHealthAge: curryGetHeathAgeFunction(refPop),
            getLifeExpectancy: curryGetLifeExpectancyFunction(
                cox,
                refLifeTable
            ),
            getLifeYearsLost: curryGetLifeYearsLostFunction(
                coxJson.causeDeletedRef,
                refLifeTable
            ),
            toJson: curryToJsonFunction(coxJson),
            withData: curryFullWithDataFunction({})
        }
    }
}