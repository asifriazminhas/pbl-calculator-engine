import { GetRisk, curryGetRiskFunction } from './get-risk';
import { GetSurvival, curryGetSurvivalFunction } from './get-survival';
import { AddLifeTable, curryAddLifeTable } from './add-life-table';
import { CoxJson } from '../common/json-types';
import { parseCoxJsonToCox } from '../json-parser/cox';

export interface BuildFromAlgorithmJson {
    buildFromAlgorithmJson: (algorithmJson: CoxJson) => GetSurvival & GetRisk & AddLifeTable;
}

export function buildFromAlgorithmJson(
    algorithmJson: CoxJson
): GetSurvival & GetRisk & AddLifeTable {
    const cox = parseCoxJsonToCox(algorithmJson);

    return {
        getSurvival: curryGetSurvivalFunction(cox),
        getRisk: curryGetRiskFunction(cox),
        addLifeTable: curryAddLifeTable(cox)
    }
}