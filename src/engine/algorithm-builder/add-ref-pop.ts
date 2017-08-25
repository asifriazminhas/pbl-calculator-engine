import { GetSurvivalToTime, curryGetSurvivalToTimeFunction } from './get-survival-to-time';
import { GetRisk, curryGetRiskFunction } from './get-risk';
import { AddLifeTableWithGetHealthAge, curryAddLifeTableFunctionWithGetHealthAge, AddLifeTableEvaluatorFunctions } from './add-life-table';
import { curryGetLifeYearsLostFunction } from './get-life-years-lost';
import { curryGetLifeExpectancyFunction } from './get-life-expectancy';
import { ToJson, curryToJsonFunction } from './to-json';
import { ReferencePopulation } from '../health-age/reference-population';
import { GetHealthAge, curryGetHeathAgeFunction } from './get-health-age';
import { CoxJson } from '../common/json-types';
import { Cox } from '../cox/cox';
import { RefLifeTable } from '../life-expectancy/life-expectancy';

export type AddRefPopFunction<T extends AddLifeTableWithGetHealthAge | AddLifeTableEvaluatorFunctions> = (
    refPop: ReferencePopulation
) => GetSurvivalToTime & GetRisk & ToJson & GetHealthAge & T;
export type AddRefPopFunctionWithAddLifeTable = AddRefPopFunction<AddLifeTableWithGetHealthAge>;
export type AddRefPopFunctionWithAddLifeTableFunctions = AddRefPopFunction<AddLifeTableEvaluatorFunctions>;

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
            getRisk: curryGetRiskFunction(cox),
            toJson: curryToJsonFunction(coxJson),
            getHealthAge: curryGetHeathAgeFunction(refPop),
            addLifeTable: curryAddLifeTableFunctionWithGetHealthAge(
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
            getRisk: curryGetRiskFunction(cox),
            toJson: curryToJsonFunction(coxJson),
            getHealthAge: curryGetHeathAgeFunction(refPop),
            getLifeExpectancy: curryGetLifeExpectancyFunction(
                cox,
                refLifeTable
            ),
            getLifeYearsLost: curryGetLifeYearsLostFunction(
                coxJson.causeDeletedRef,
                refLifeTable
            )
        };
    }
}