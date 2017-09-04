import { GetSurvivalToTime } from './get-survival-to-time';
import { GetRisk } from './get-risk';
import { AddLifeTableWithGetHealthAge, AddLifeTableEvaluatorFunctions } from './add-life-table';
import { ToJson } from './to-json';
import { ReferencePopulation } from '../health-age/reference-population';
import { GetHealthAge } from './get-health-age';
import { CoxJson } from '../common/json-types';
import { Cox } from '../cox/cox';
import { RefLifeTable } from '../life-expectancy/life-expectancy';
import { WithDataAndGetHealthAge, FullWithData } from '../algorithm-evaluator';
import { AddAlgorithmReturnsGetHealthAge, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';
export declare type AddRefPopFunction<T extends AddLifeTableWithGetHealthAge | AddLifeTableEvaluatorFunctions, U extends WithDataAndGetHealthAge<{}> | FullWithData<{}>, V extends AddAlgorithmReturnsGetHealthAge | AddAlgorithmWithGetHealthAgeAndLifeTableFunctions> = (refPop: ReferencePopulation) => GetSurvivalToTime & GetRisk & ToJson & GetHealthAge & T & U & V;
export declare type AddRefPopFunctionWithAddLifeTable = AddRefPopFunction<AddLifeTableWithGetHealthAge, WithDataAndGetHealthAge<{}>, AddAlgorithmReturnsGetHealthAge>;
export declare type AddRefPopFunctionWithAddLifeTableFunctions = AddRefPopFunction<AddLifeTableEvaluatorFunctions, FullWithData<{}>, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions>;
export interface AddRefPopWithAddLifeTable {
    addRefPop: AddRefPopFunctionWithAddLifeTable;
}
export interface AddRefPopWithAddLifeTableFunctions {
    addRefPop: AddRefPopFunctionWithAddLifeTableFunctions;
}
export declare function curryAddRefPopWithAddLifeTable(cox: Cox, coxJson: CoxJson): AddRefPopFunctionWithAddLifeTable;
export declare function curryAddRefPopWithGetLifeExpectancy(cox: Cox, coxJson: CoxJson, refLifeTable: RefLifeTable): AddRefPopFunctionWithAddLifeTableFunctions;
