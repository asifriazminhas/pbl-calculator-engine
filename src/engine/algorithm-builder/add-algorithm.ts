import { Cox } from '../cox';
import { GetRiskToTime, getGetRiskToTime, getGetLifeExpectancy, getGetLifeYearsLost, GetHealthAge, getGetHealthAge, getGetSurvivalToAge, GetSurvivalToTime, getGetSurvivalToTime } from '../algorithm-evaluator';
import { AddLifeTableWithAddRefPop, getAddLifeTableWithAddRefPop, AddLifeTableEvaluatorFunctions, AddLifeTableWithGetHealthAge, getAddLifeTableWithGetHealthAge } from './add-life-table';
import { AddRefPopWithAddLifeTable, getAddRefPopWithAddLifeTable, AddRefPopWithAddLifeTableFunctions, getAddRefPopWithAddLifeTableFunctions } from './add-ref-pop';
import { ToJson, getToJson } from './to-json';
import { CoxJson } from '../common/json-types';
import { WithDataAndCoxFunctions, getWithDataAndCoxFunctions, WithDataAndCoxFunctionsAndLifeTableFunctions, getWithDataAndCoxFunctionsAndLifeTableFunctions, WithDataAndCoxFunctionsAndAddRefPopFunctions, getWithDataAndCoxFunctionsAndAddRefPopFunctions, CompleteWithData, getCompleteWithData, WithCauseImpactWithCoxFunctions, getWithCauseImpactWithCoxFunctions, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions } from '../algorithm-evaluator';
import { RefLifeTable } from '../common/life-table';
import { ReferencePopulation } from '../health-age';
import { CauseImpactRef } from '../cause-impact';

export type BaseAddAlgorithmFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithAddRefPop & AddRefPopWithAddLifeTable & ToJson & WithDataAndCoxFunctions<{}> & WithCauseImpactWithCoxFunctions;
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
            getWithDataAndCoxFunctions({}, {}, cox),
            getWithCauseImpactWithCoxFunctions(coxJson.causeDeletedRef, cox)
        );
    }
}

export type AddAlgorithmReturnsLifeTableFunctionsFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableEvaluatorFunctions & AddRefPopWithAddLifeTableFunctions & ToJson & WithDataAndCoxFunctionsAndLifeTableFunctions<{}> & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction;
export interface AddAlgorithmWithLifeTableFunctions {
    addAlgorithm: AddAlgorithmReturnsLifeTableFunctionsFunction;
}
export function curryAddAlgorithmWithLifeTableFunctionsFunction(
    cox: Cox,
    refLifeTable: RefLifeTable,
    coxJson: CoxJson,
    causeImpactRef: CauseImpactRef = coxJson.causeDeletedRef,
    useExFromLifeTableFromAge: number = 99
): AddAlgorithmReturnsLifeTableFunctionsFunction {
    return (addedCox) => {
        addedCox;

        return Object.assign(
            getGetRiskToTime(cox),
            getGetSurvivalToTime(cox),
            getGetSurvivalToAge(cox, refLifeTable),
            getGetLifeExpectancy(cox, refLifeTable),
            getGetLifeYearsLost(coxJson.causeDeletedRef, refLifeTable, cox),
            getToJson(coxJson),
            getAddRefPopWithAddLifeTableFunctions(cox, coxJson, refLifeTable),
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
                refLifeTable
            )
        )
    }
}

export type AddAlgorithmReturnsGetHealthAgeFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithGetHealthAge & GetHealthAge & WithDataAndCoxFunctionsAndAddRefPopFunctions<{}> & WithCauseImpactWithCoxFunctions;
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
            getGetHealthAge(refPop, cox),
            getToJson(coxJson),
            getAddLifeTableWithGetHealthAge(cox, coxJson, refPop),
            getWithDataAndCoxFunctionsAndAddRefPopFunctions(
                {}, 
                {}, 
                cox, 
                refPop
            ),
            getWithCauseImpactWithCoxFunctions(coxJson.causeDeletedRef, cox)
        );
    }
}

export type AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & GetHealthAge & AddLifeTableEvaluatorFunctions & CompleteWithData<{}> & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & ToJson;
export interface AddAlgorithmWithGetHealthAgeAndLifeTableFunctions {
    addAlgorithm: AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction;
}
export function curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
    cox: Cox,
    coxJson: CoxJson,
    refPop: ReferencePopulation,
    refLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99,
    causeImpactRef: CauseImpactRef = coxJson.causeDeletedRef
): AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction {
    return () => {
        return Object.assign(
            {},
            getGetRiskToTime(cox),
            getGetSurvivalToAge(cox, refLifeTable),
            getGetSurvivalToTime(cox),
            getGetHealthAge(refPop, cox),
            getGetLifeExpectancy(cox, refLifeTable),
            getGetLifeYearsLost(coxJson.causeDeletedRef, refLifeTable, cox),
            getToJson(coxJson),
            getCompleteWithData(
                {}, 
                {}, 
                cox, 
                refPop,
                refLifeTable,
                causeImpactRef, 
                useExFromLifeTableFromAge
            ),
            getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                causeImpactRef,
                cox,
                refLifeTable
            )
        )
    }
}