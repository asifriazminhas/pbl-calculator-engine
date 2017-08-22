import { GetRisk, curryGetRiskFunction } from './get-risk';
import { GetSurvivalToTime, curryGetSurvivalToTimeFunction } from './get-survival-to-time';
import { AddLifeTable, curryAddLifeTable } from './add-life-table';
import { CoxJson } from '../common/json-types';
import { parseCoxJsonToCox } from '../json-parser/cox';
import { ToJson, curryToJsonFunction } from './to-json';

export interface BuildFromAlgorithmJson {
    buildFromAlgorithmJson: (algorithmJson: CoxJson) => GetSurvivalToTime & GetRisk & AddLifeTable & ToJson;
}

export function buildFromAlgorithmJson(
    algorithmJson: CoxJson
): GetSurvivalToTime & GetRisk & AddLifeTable & ToJson {
    const cox = parseCoxJsonToCox(algorithmJson);

    return {
        getSurvivalToTime: curryGetSurvivalToTimeFunction(cox),
        getRisk: curryGetRiskFunction(cox),
        addLifeTable: curryAddLifeTable(cox, algorithmJson),
        toJson: curryToJsonFunction(algorithmJson)
    }
}