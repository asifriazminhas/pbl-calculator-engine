import { GetRiskToTime, getGetRiskToTime, GetSurvivalToTime, getGetSurvivalToAge, GetLifeExpectancy, getGetLifeExpectancy, GetLifeYearsLost, getGetLifeYearsLost, GetHealthAge, getGetHealthAge, GetSurvivalToAge, getGetSurvivalToTime, WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction, getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions } from '../algorithm-evaluator';
import { RefLifeTable } from '../common/life-table';
import { Cox } from '../cox/cox';
import { ToJson, getToJson } from './to-json';
import { CoxJson } from '../common/json-types';
import { AddRefPopWithAddLifeTableFunctions, getAddRefPopWithAddLifeTableFunctions } from './add-ref-pop';
import { ReferencePopulation } from '../health-age/reference-population';
import { WithDataAndCoxFunctionsAndLifeTableFunctions, getWithDataAndCoxFunctionsAndLifeTableFunctions, CompleteWithData, getCompleteWithData } from '../algorithm-evaluator';
import { AddAlgorithmWithLifeTableFunctions, curryAddAlgorithmWithLifeTableFunctionsFunction, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions, curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';

export type AddLifeTableEvaluatorFunctions = GetLifeExpectancy & GetLifeYearsLost & GetSurvivalToAge;

export type AddLifeTableFunction<T extends AddRefPopWithAddLifeTableFunctions | GetHealthAge, U extends WithDataAndCoxFunctionsAndLifeTableFunctions<{}> | CompleteWithData<{}>, V extends AddAlgorithmWithLifeTableFunctions | AddAlgorithmWithGetHealthAgeAndLifeTableFunctions> = (lifeTable: RefLifeTable) => GetSurvivalToTime & GetRiskToTime & AddLifeTableEvaluatorFunctions & WithCauseImpactWithCoxFunctionsAndLifeExpectancyFunction & ToJson & T & U & V;

export interface AddLifeTableWithAddRefPop {
    addLifeTable: AddLifeTableFunction<AddRefPopWithAddLifeTableFunctions, WithDataAndCoxFunctionsAndLifeTableFunctions<{}>, AddAlgorithmWithLifeTableFunctions>;
}
export interface AddLifeTableWithGetHealthAge {
    addLifeTable: AddLifeTableFunction<GetHealthAge, CompleteWithData<{}>, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions>;
}

export function getAddLifeTableWithAddRefPop(
    cox: Cox,
    coxJson: CoxJson
): AddLifeTableWithAddRefPop {
    return {
        addLifeTable: (lifeTable) => {
            return Object.assign(
                {},
                getGetRiskToTime(cox),
                getGetSurvivalToTime(cox),
                getGetSurvivalToAge(cox, lifeTable),
                getGetLifeExpectancy(cox, lifeTable),
                getGetLifeYearsLost(coxJson.causeDeletedRef, lifeTable),
                getToJson(coxJson),
                getAddRefPopWithAddLifeTableFunctions(cox, coxJson, lifeTable),
                getWithDataAndCoxFunctionsAndLifeTableFunctions({}, {}, cox),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    coxJson,
                    cox,
                    lifeTable
                ),
                {
                    addAlgorithm: curryAddAlgorithmWithLifeTableFunctionsFunction(
                        cox,
                        lifeTable,
                        coxJson
                    )
                })
        }
    }
}

export function getAddLifeTableWithGetHealthAge(
    cox: Cox,
    coxJson: CoxJson,
    refPop: ReferencePopulation
): AddLifeTableWithGetHealthAge {
    return {
        addLifeTable: (lifeTable) => {
            return Object.assign(
                {},
                getGetRiskToTime(cox),
                getGetSurvivalToAge(cox, lifeTable),
                getGetSurvivalToTime(cox),
                getGetHealthAge(refPop, cox),
                getGetLifeExpectancy(cox, lifeTable),
                getGetLifeYearsLost(coxJson.causeDeletedRef, lifeTable),
                getToJson(coxJson),
                getCompleteWithData({}, {}, cox),
                getWithCauseImpactWithCoxFunctionsAndLifeExpectancyFunctions(
                    coxJson,
                    cox,
                    lifeTable
                ),
                {
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
}
 
