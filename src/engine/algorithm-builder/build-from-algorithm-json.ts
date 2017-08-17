import { GetRisk, curryGetRiskFunction } from './get-risk';
import { GetSurvival, curryGetSurvivalFunction } from './get-survival';
import { AddLifeTable, curryAddLifeTable } from './add-life-table';
import { CoxJson } from '../common/json-types';
import { parseCoxJsonToCox } from '../json-parser/cox';
import { ToJson, curryToJsonFunction } from './to-json';

export interface BuildFromAlgorithmJson {
    buildFromAlgorithmJson: (algorithmJson: CoxJson) => GetSurvival & GetRisk & AddLifeTable & ToJson;
}

export function buildFromAlgorithmJson(
    algorithmJson: CoxJson
): GetSurvival & GetRisk & AddLifeTable & ToJson {
    const cox = parseCoxJsonToCox(algorithmJson);

    return {
        getSurvival: curryGetSurvivalFunction(cox),
        getRisk: curryGetRiskFunction(cox),
        addLifeTable: curryAddLifeTable(cox, algorithmJson),
        toJson: curryToJsonFunction(algorithmJson)
    }
}