import { GetSurvivalToTime, getGetSurvivalToTime, GetRiskToTime, getGetRiskToTime, getGetLifeYearsLost, getGetLifeExpectancy, GetHealthAge, getGetHealthAge, getGetSurvivalToAge, WithCauseImpactWithCoxFunctions, getWithCauseImpactWithCoxFunctions, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions } from '../algorithm-evaluator';
import { AddLifeTableWithGetHealthAge, getAddLifeTableWithGetHealthAge, AddLifeTableEvaluatorFunctions } from './add-life-table';
import { ToJson, getToJson } from './to-json';
import { ReferencePopulation } from '../health-age/reference-population';
import { CoxJson } from '../common/json-types';
import { Cox } from '../cox/cox';
import { RefLifeTable } from '../common/life-table';
import { WithDataAndCoxFunctionsAndAddRefPopFunctions, getWithDataAndCoxFunctionsAndAddRefPopFunctions, CompleteWithData, getCompleteWithData } from '../algorithm-evaluator';
import { AddAlgorithmReturnsGetHealthAge, curryAddAlgorithmReturnsGetHealthAgeFunction, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions,curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';
import { CauseImpactRef } from '../cause-impact';

export type AddRefPopFunction<T extends AddLifeTableWithGetHealthAge | AddLifeTableEvaluatorFunctions, U extends WithDataAndCoxFunctionsAndAddRefPopFunctions<{}> | CompleteWithData<{}>, V extends AddAlgorithmReturnsGetHealthAge | AddAlgorithmWithGetHealthAgeAndLifeTableFunctions,
W extends WithCauseImpactWithCoxFunctions | WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction> = (
    refPop: ReferencePopulation
) => GetSurvivalToTime & GetRiskToTime & ToJson & GetHealthAge & T & U & V & W;

export interface AddRefPopWithAddLifeTable {
    addRefPop: AddRefPopFunction<AddLifeTableWithGetHealthAge, WithDataAndCoxFunctionsAndAddRefPopFunctions<{}>, AddAlgorithmReturnsGetHealthAge, WithCauseImpactWithCoxFunctions>;
}

export interface AddRefPopWithAddLifeTableFunctions {
    addRefPop: AddRefPopFunction<AddLifeTableEvaluatorFunctions, CompleteWithData<{}>, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction>;
}

export function getAddRefPopWithAddLifeTable(
    cox: Cox,
    coxJson: CoxJson,
    causeImpactRef: CauseImpactRef = coxJson.causeDeletedRef
): AddRefPopWithAddLifeTable {
    return {
        addRefPop: (refPop) => {
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
                {
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
    refLifeTable: RefLifeTable,
    causeImpactRef: CauseImpactRef = coxJson.causeDeletedRef
): AddRefPopWithAddLifeTableFunctions {
    return {
        addRefPop: (refPop) => {
            return Object.assign(
                {},
                getGetRiskToTime(cox),
                getGetSurvivalToTime(cox),
                getGetSurvivalToAge(cox, refLifeTable),
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
                    causeImpactRef
                ),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    causeImpactRef,
                    cox,
                    refLifeTable
                ),
                {
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