import { Cox } from '../cox';
import { GetRiskToTime, getGetRiskToTime, getGetLifeExpectancy, getGetLifeYearsLost, GetHealthAge, getGetHealthAge, getGetSurvivalToAge, GetSurvivalToTime, getGetSurvivalToTime } from '../algorithm-evaluator';
import { AddLifeTableWithAddRefPop, getAddLifeTableWithAddRefPop, AddLifeTableEvaluatorFunctions, AddLifeTableWithGetHealthAge, getAddLifeTableWithGetHealthAge } from './add-life-table';
import { AddRefPopWithAddLifeTable, getAddRefPopWithAddLifeTable, AddRefPopWithAddLifeTableFunctions, getAddRefPopWithAddLifeTableFunctions } from './add-ref-pop';
import { ToJson, getToJson } from './to-json';
import { CoxJson } from '../common/json-types';
import { WithDataAndCoxFunctions, getWithDataAndCoxFunctions, WithDataAndCoxFunctionsAndLifeTableFunctions, getWithDataAndCoxFunctionsAndLifeTableFunctions, WithDataAndCoxFunctionsAndAddRefPopFunctions, getWithDataAndCoxFunctionsAndAddRefPopFunctions, CompleteWithData, getCompleteWithData, WithCauseImpactWithCoxFunctions, getWithCauseImpactWithCoxFunctions, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions } from '../algorithm-evaluator';
import { RefLifeTable } from '../life-table';
import { ReferencePopulation } from '../health-age';
import { CauseImpactRef } from '../cause-impact';
import { BaseReplaceCauseImpactRef, getBaseReplaceCauseImpactRef, ReplaceCauseImpactRefWithLifeTableFunctions, getReplaceCauseImpactRefWithLifeTableFunctions, ReplaceCauseImpactRefWithAddRefPopFunctions, getReplaceCauseImpactRefWithAddRefPopFunctions, FullReplaceCauseImpactRef, getFullReplaceCauseImpactRef } from './replace-cause-impact-ref';

export type BaseAddAlgorithmFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithAddRefPop & AddRefPopWithAddLifeTable & ToJson & WithDataAndCoxFunctions<{}> & WithCauseImpactWithCoxFunctions & BaseReplaceCauseImpactRef;
export interface BaseAddAlgorithm {
    addAlgorithm: BaseAddAlgorithmFunction
}
export function getBaseAddAlgorithmFunction(
    cox: Cox,
    coxJson: CoxJson,
    causeImpactRef: CauseImpactRef = coxJson.causeDeletedRef
): BaseAddAlgorithm {
    return {
        addAlgorithm: (addedCox) => {
            addedCox;

            return Object.assign(
                getGetRiskToTime(cox),
                getGetSurvivalToTime(cox),
                getToJson(coxJson),
                getAddLifeTableWithAddRefPop(cox, coxJson),
                getAddRefPopWithAddLifeTable(cox, coxJson),
                getWithDataAndCoxFunctions(
                    {}, 
                    {}, 
                    cox,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctions(
                    coxJson.causeDeletedRef, 
                    cox
                ),
                getBaseReplaceCauseImpactRef(cox, coxJson)
            );
        }
    }
}

export type AddAlgorithmReturnsLifeTableFunctionsFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableEvaluatorFunctions & AddRefPopWithAddLifeTableFunctions & ToJson & WithDataAndCoxFunctionsAndLifeTableFunctions<{}> & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & ReplaceCauseImpactRefWithLifeTableFunctions;
export interface AddAlgorithmWithLifeTableFunctions {
    addAlgorithm: AddAlgorithmReturnsLifeTableFunctionsFunction;
}
export function getAddAlgorithmWithLifeTableFunctions(
    cox: Cox,
    refLifeTable: RefLifeTable,
    coxJson: CoxJson,
    causeImpactRef: CauseImpactRef = coxJson.causeDeletedRef,
    useExFromLifeTableFromAge: number = 99
): AddAlgorithmWithLifeTableFunctions {
    return {
        addAlgorithm: (addedCox) => {
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
                ),
                getReplaceCauseImpactRefWithLifeTableFunctions(
                    cox,
                    refLifeTable,
                    coxJson
                )
            )
        }
    }
}

export type AddAlgorithmReturnsGetHealthAgeFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & AddLifeTableWithGetHealthAge & GetHealthAge & WithDataAndCoxFunctionsAndAddRefPopFunctions<{}> & WithCauseImpactWithCoxFunctions & ReplaceCauseImpactRefWithAddRefPopFunctions;
export interface AddAlgorithmReturnsGetHealthAge {
    addAlgorithm: AddAlgorithmReturnsGetHealthAgeFunction;
}
export function getAddAlgorithmReturnsGetHealthAgeFunction(
    cox: Cox,
    coxJson: CoxJson,
    refPop: ReferencePopulation,
    causeImpactRef: CauseImpactRef = coxJson.causeDeletedRef
): AddAlgorithmReturnsGetHealthAge {
    return {
        addAlgorithm: (addedCox) => {
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
                    refPop,
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctions(
                    coxJson.causeDeletedRef, 
                    cox
                ),
                getReplaceCauseImpactRefWithAddRefPopFunctions(
                    cox,
                    coxJson,
                    refPop
                )
            );
        }
    }
}

export type AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction = (
    addedCox: Cox
) => GetSurvivalToTime & GetRiskToTime & GetHealthAge & AddLifeTableEvaluatorFunctions & CompleteWithData<{}> & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & ToJson & FullReplaceCauseImpactRef;
export interface AddAlgorithmWithGetHealthAgeAndLifeTableFunctions {
    addAlgorithm: AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction;
}
export function getAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
    cox: Cox,
    coxJson: CoxJson,
    refPop: ReferencePopulation,
    refLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99,
    causeImpactRef: CauseImpactRef = coxJson.causeDeletedRef
): AddAlgorithmWithGetHealthAgeAndLifeTableFunctions {
    return {
        addAlgorithm: () => {
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
                ),
                getFullReplaceCauseImpactRef(
                    cox,
                    coxJson,
                    refLifeTable,
                    refPop,
                    useExFromLifeTableFromAge
                )
            )
        }
    }
}