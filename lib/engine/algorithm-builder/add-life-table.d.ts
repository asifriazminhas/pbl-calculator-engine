import { GetRisk } from './get-risk';
import { GetSurvivalToTime } from './get-survival-to-time';
import { GetLifeExpectancy } from './get-life-expectancy';
import { GetLifeYearsLost } from './get-life-years-lost';
import { RefLifeTable } from '../life-expectancy/life-expectancy';
import { Cox } from '../cox/cox';
import { ToJson } from './to-json';
import { CoxJson } from '../common/json-types';
import { AddRefPopWithAddLifeTableFunctions } from './add-ref-pop';
import { GetHealthAge } from './get-health-age';
import { ReferencePopulation } from '../health-age/reference-population';
import { WithDataAndLifeTableFunctions, FullWithData } from '../algorithm-evaluator';
import { AddAlgorithmWithLifeTableFunctions, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions } from './add-algorithm';
export declare type AddLifeTableEvaluatorFunctions = GetLifeExpectancy & GetLifeYearsLost;
export declare type AddLifeTableFunction<T extends AddRefPopWithAddLifeTableFunctions | GetHealthAge, U extends WithDataAndLifeTableFunctions<{}> | FullWithData<{}>, V extends AddAlgorithmWithLifeTableFunctions | AddAlgorithmWithGetHealthAgeAndLifeTableFunctions> = (lifeTable: RefLifeTable) => GetSurvivalToTime & GetRisk & AddLifeTableEvaluatorFunctions & ToJson & T & U & V;
export declare type AddLifeTableFunctionWithAddRefPop = AddLifeTableFunction<AddRefPopWithAddLifeTableFunctions, WithDataAndLifeTableFunctions<{}>, AddAlgorithmWithLifeTableFunctions>;
export declare type AddLifeTableFunctionWithGetHealthAge = AddLifeTableFunction<GetHealthAge, FullWithData<{}>, AddAlgorithmWithGetHealthAgeAndLifeTableFunctions>;
export interface AddLifeTableWithAddRefPop {
    addLifeTable: AddLifeTableFunctionWithAddRefPop;
}
export interface AddLifeTableWithGetHealthAge {
    addLifeTable: AddLifeTableFunctionWithGetHealthAge;
}
export declare function curryAddLifeTableFunctionWithAddRefPop(cox: Cox, coxJson: CoxJson): AddLifeTableFunctionWithAddRefPop;
export declare function curryAddLifeTableFunctionWithGetHealthAge(cox: Cox, coxJson: CoxJson, refPop: ReferencePopulation): AddLifeTableFunctionWithGetHealthAge;
