import { GetRisk, curryGetRiskFunction } from './get-risk';
import { GetSurvivalToTime, curryGetSurvivalToTimeFunction } from './get-survival-to-time';
import { GetLifeExpectancy, curryGetLifeExpectancyFunction } from './get-life-expectancy';
import { GetLifeYearsLost, curryGetLifeYearsLostFunction } from './get-life-years-lost';
import { RefLifeTable } from '../life-expectancy/life-expectancy';
import { Cox } from '../cox/cox';
import { ToJson, curryToJsonFunction } from './to-json';
import { CoxJson } from '../common/json-types';
import { AddRefPopWithAddLifeTableFunctions, curryAddRefPopWithGetLifeExpectancy } from './add-ref-pop';
import { GetHealthAge, curryGetHeathAgeFunction } from './get-health-age';
import { ReferencePopulation } from '../health-age/reference-population';

export type AddLifeTableEvaluatorFunctions = GetLifeExpectancy & GetLifeYearsLost;

export type AddLifeTableFunction<T extends AddRefPopWithAddLifeTableFunctions | GetHealthAge> = (lifeTable: RefLifeTable) => GetSurvivalToTime & GetRisk & AddLifeTableEvaluatorFunctions & ToJson & T;

export type AddLifeTableFunctionWithAddRefPop = AddLifeTableFunction<AddRefPopWithAddLifeTableFunctions>;
export type AddLifeTableFunctionWithGetHealthAge = AddLifeTableFunction<GetHealthAge>;

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
            getRisk: curryGetRiskFunction(cox),
            getLifeExpectancy: curryGetLifeExpectancyFunction(
                cox,
                lifeTable
            ),
            getLifeYearsLost: curryGetLifeYearsLostFunction(
                coxJson.causeDeletedRef,
                lifeTable
            ),
            toJson: curryToJsonFunction(coxJson),
            addRefPop: curryAddRefPopWithGetLifeExpectancy(
                cox,
                coxJson,
                lifeTable
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
            getRisk: curryGetRiskFunction(cox),
            getLifeExpectancy: curryGetLifeExpectancyFunction(cox, lifeTable),
            getHealthAge: curryGetHeathAgeFunction(refPop),
            getLifeYearsLost: curryGetLifeYearsLostFunction(
                coxJson.causeDeletedRef,
                lifeTable
            ),
            toJson: curryToJsonFunction(coxJson)
        }
    }
}
