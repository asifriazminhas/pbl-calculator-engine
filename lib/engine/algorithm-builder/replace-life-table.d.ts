import { GetSurvival } from './get-survival';
import { GetRisk } from './get-risk';
import { GetLifeExpectancy } from './get-life-expectancy';
import { BaseLifeTableRow } from '../life-expectancy/life-expectancy';
import { Cox } from '../cox/cox';
import { ToJson } from './to-json';
import { CoxJson } from '../common/json-types';
export interface ReplaceLifetable {
    replaceLifeTable: (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable & ToJson;
}
export declare function curryReplaceLifeTable(cox: Cox, coxJson: CoxJson): (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable & ToJson;
