import { GetRisk } from './get-risk';
import { GetSurvival } from './get-survival';
import { ReplaceLifetable } from './replace-life-table';
import { GetLifeExpectancy } from './get-life-expectancy';
import { BaseLifeTableRow } from '../life-expectancy/life-expectancy';
import { Cox } from '../cox/cox';
import { ToJson } from './to-json';
import { CoxJson } from '../common/json-types';
export interface AddLifeTable {
    addLifeTable: (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable & ToJson;
}
export declare function curryAddLifeTable(cox: Cox, coxJson: CoxJson): (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable & ToJson;
