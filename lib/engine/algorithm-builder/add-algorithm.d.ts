import { Cox } from '../cox';
import { GetSurvivalToTime } from './get-survival-to-time';
import { GetRisk } from './get-risk';
import { AddLifeTableWithAddRefPop, AddLifeTableEvaluatorFunctions, AddLifeTableWithGetHealthAge } from './add-life-table';
import { AddRefPopWithAddLifeTable, AddRefPopWithAddLifeTableFunctions } from './add-ref-pop';
import { ToJson } from './to-json';
import { CoxJson } from '../common/json-types';
import { BaseWithData, WithDataAndLifeTableFunctions, WithDataAndGetHealthAge, FullWithData } from '../algorithm-evaluator';
import { RefLifeTable } from '../life-expectancy';
import { GetHealthAge } from './get-health-age';
import { ReferencePopulation } from '../health-age';
export declare type BaseAddAlgorithmFunction = (addedCox: Cox) => GetSurvivalToTime & GetRisk & AddLifeTableWithAddRefPop & AddRefPopWithAddLifeTable & ToJson & BaseWithData<{}>;
export interface BaseAddAlgorithm {
    addAlgorithm: BaseAddAlgorithmFunction;
}
export declare function curryBaseAddAlgorithmFunction(cox: Cox, coxJson: CoxJson): BaseAddAlgorithmFunction;
export declare type AddAlgorithmReturnsLifeTableFunctionsFunction = (addedCox: Cox) => GetSurvivalToTime & GetRisk & AddLifeTableEvaluatorFunctions & AddRefPopWithAddLifeTableFunctions & ToJson & WithDataAndLifeTableFunctions<{}>;
export interface AddAlgorithmWithLifeTableFunctions {
    addAlgorithm: AddAlgorithmReturnsLifeTableFunctionsFunction;
}
export declare function curryAddAlgorithmWithLifeTableFunctionsFunction(cox: Cox, refLifeTable: RefLifeTable, coxJson: CoxJson): AddAlgorithmReturnsLifeTableFunctionsFunction;
export declare type AddAlgorithmReturnsGetHealthAgeFunction = (addedCox: Cox) => GetSurvivalToTime & GetRisk & AddLifeTableWithGetHealthAge & GetHealthAge & WithDataAndGetHealthAge<{}>;
export interface AddAlgorithmReturnsGetHealthAge {
    addAlgorithm: AddAlgorithmReturnsGetHealthAgeFunction;
}
export declare function curryAddAlgorithmReturnsGetHealthAgeFunction(cox: Cox, coxJson: CoxJson, refPop: ReferencePopulation): AddAlgorithmReturnsGetHealthAgeFunction;
export declare type AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction = (addedCox: Cox) => GetSurvivalToTime & GetRisk & GetHealthAge & AddLifeTableEvaluatorFunctions & FullWithData<{}> & ToJson;
export interface AddAlgorithmWithGetHealthAgeAndLifeTableFunctions {
    addAlgorithm: AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction;
}
export declare function curryAddAlgorithmWithGetHealthAgeAndLifeTableFunctions(cox: Cox, coxJson: CoxJson, refPop: ReferencePopulation, refLifeTable: RefLifeTable): AddAlgorithmWithGetHealthAgeAndLifeTableFunctionsFunction;
