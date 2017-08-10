import { GetSurvival, curryGetSurvivalFunction } from './get-survival';
import { GetRisk, curryGetRiskFunction } from './get-risk';
import { GetLifeExpectancy, curryGetLifeExpectancyFunction } from './get-life-expectancy';
import { BaseLifeTableRow } from '../life-expectancy/life-expectancy';
import { Cox    } from '../cox/cox';

export interface ReplaceLifetable {
    replaceLifeTable: (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable
}

export function curryReplaceLifeTable(
    cox: Cox
): (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable {
    return (lifeTable: Array<BaseLifeTableRow>) => {
        return replaceLifeTable(cox, lifeTable);
    }
}

function replaceLifeTable(
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