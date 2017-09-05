import { GetRiskToTime, curryGetRiskToTimeFunction, GetSurvivalToTime, curryGetSurvivalToTimeFunction, GetLifeExpectancy, curryGetLifeExpectancyFunction, GetLifeYearsLost, curryGetLifeYearsLostFunction, GetHealthAge, curryGetHeathAgeFunction } from '../algorithm-evaluator';
import { RefLifeTable } from '../life-expectancy/life-expectancy';
import { Cox } from '../cox/cox';
import { ToJson, curryToJsonFunction } from './to-json';
import { CoxJson } from '../common/json-types';
import { AddRefPopWithAddLifeTableFunctions, curryAddRefPopWithGetLifeExpectancy } from './add-ref-pop';
import { ReferencePopulation } from '../health-age/reference-population';
import { WithDataAndLifeTableFunctions, curryWithDataAndLifeTableFunctionsFunction, FullWithData, curryFullWithDataFunction } from '../algorithm-evaluator';
import { AddAlgorithmWithLifeTableFunctions, curryAddAlgorithmWithLifeTableFunctionsFunction, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions, curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';

export type AddLifeTableEvaluatorFunctions = GetLifeExpectancy & GetLifeYearsLost;

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
        return {
            getSurvivalToTime: curryGetSurvivalToTimeFunction(cox),
            getRiskToTime: curryGetRiskToTimeFunction(cox),
            getLifeExpectancy: curryGetLifeExpectancyFunction(
                cox,
                lifeTable
            ),
            getLifeYearsLost: curryGetLifeYearsLostFunction(
                coxJson.causeDeletedRef,
                lifeTable
            ),
            toJson: curryToJsonFunction(coxJson),
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
        }
    }
}

export function curryAddLifeTableFunctionWithGetHealthAge(
    cox: Cox,
    coxJson: CoxJson,
    refPop: ReferencePopulation
): AddLifeTableFunctionWithGetHealthAge {
    return (lifeTable) => {
        return {
            getSurvivalToTime: curryGetSurvivalToTimeFunction(cox),
            getRiskToTime: curryGetRiskToTimeFunction(cox),
            getLifeExpectancy: curryGetLifeExpectancyFunction(cox, lifeTable),
            getHealthAge: curryGetHeathAgeFunction(refPop),
            getLifeYearsLost: curryGetLifeYearsLostFunction(
                coxJson.causeDeletedRef,
                lifeTable
            ),
            withData: curryFullWithDataFunction({}),
            toJson: curryToJsonFunction(coxJson),
            addAlgorithm: curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(
                cox,
                coxJson,
                refPop,
                lifeTable
            )
        }
    }
}
