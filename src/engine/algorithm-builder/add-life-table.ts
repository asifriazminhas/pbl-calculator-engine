import { GetRisk, curryGetRiskFunction } from './get-risk';
import { GetSurvival, curryGetSurvivalFunction } from './get-survival';
import { ReplaceLifetable, curryReplaceLifeTable } from './replace-life-table';
import { GetLifeExpectancy, curryGetLifeExpectancyFunction } from './get-life-expectancy';
import { BaseLifeTableRow } from '../life-expectancy/life-expectancy';
import { Cox } from '../cox/cox';
import { ToJson, curryToJsonFunction } from './to-json';
import { CoxJson } from '../common/json-types';

export interface AddLifeTable {
    addLifeTable: (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable & ToJson;
}

function addLifeTable(
    cox: Cox,
    lifeTable: Array<BaseLifeTableRow>,
    coxJson: CoxJson,
): GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable & ToJson {
    return {
        getSurvival: curryGetSurvivalFunction(cox),
        getRisk: curryGetRiskFunction(cox),
        getLifeExpectancy: curryGetLifeExpectancyFunction(
            cox,
            lifeTable
        ),
        replaceLifeTable: curryReplaceLifeTable(cox, coxJson),
        toJson: curryToJsonFunction(coxJson)
    }
}

export function curryAddLifeTable(
    cox: Cox,
    coxJson: CoxJson
): (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable & ToJson {
    return (lifeTable) => {
        return addLifeTable(cox, lifeTable, coxJson);
    }
}
