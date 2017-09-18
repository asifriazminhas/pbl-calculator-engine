import { GetSurvivalToTime, getGetSurvivalToTime, GetRiskToTime, getGetRiskToTime, getGetLifeYearsLost, getGetLifeExpectancy, GetHealthAge, getGetHealthAge, getGetSurvivalToAge, WithCauseImpactWithCoxFunctions, getWithCauseImpactWithCoxFunctions, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions } from '../algorithm-evaluator';
import { AddLifeTableWithGetHealthAge, getAddLifeTableWithGetHealthAge, AddLifeTableEvaluatorFunctions } from './add-life-table';
import { ToJson, getToJson } from './to-json';
import { ReferencePopulation } from '../health-age/reference-population';
import { CoxJson } from '../common/json-types';
import { Cox } from '../cox/cox';
import { RefLifeTable } from '../common/life-table';
import { WithDataAndCoxFunctionsAndAddRefPopFunctions, getWithDataAndCoxFunctionsAndAddRefPopFunctions, CompleteWithData, getCompleteWithData } from '../algorithm-evaluator';
import { AddAlgorithmReturnsGetHealthAge, curryAddAlgorithmReturnsGetHealthAgeFunction, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions,curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';

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
    coxJson: CoxJson
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
                    refPop
                ),
                getWithCauseImpactWithCoxFunctions(
                    coxJson,
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
    refLifeTable: RefLifeTable
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
                getGetLifeYearsLost(coxJson.causeDeletedRef, refLifeTable),
                getToJson(coxJson),
                getCompleteWithData({}, {}, cox, refPop, refLifeTable),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    coxJson,
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