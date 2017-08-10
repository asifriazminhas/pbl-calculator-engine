import { GetRisk, curryGetRiskFunction } from './get-risk';
import { GetSurvival, curryGetSurvivalFunction } from './get-survival';
import { ReplaceLifetable, curryReplaceLifeTable } from './replace-life-table';
import { GetLifeExpectancy, curryGetLifeExpectancyFunction } from './get-life-expectancy';
import { BaseLifeTableRow } from '../life-expectancy/life-expectancy';
import { Cox } from '../cox/cox';

export interface AddLifeTable {
    addLifeTable: (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable;
}

function addLifeTable(
    cox: Cox,
    lifeTable: Array<BaseLifeTableRow>
): GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable {
    return {
        getSurvival: curryGetSurvivalFunction(cox),
        getRisk: curryGetRiskFunction(cox),
        getLifeExpectancy: curryGetLifeExpectancyFunction(
            cox,
            lifeTable
        ),
        replaceLifeTable: curryReplaceLifeTable(cox)
    }
}

export function curryAddLifeTable(
    cox: Cox
): (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable {
    return (lifeTable) => {
        return addLifeTable(cox, lifeTable);
    }
}
