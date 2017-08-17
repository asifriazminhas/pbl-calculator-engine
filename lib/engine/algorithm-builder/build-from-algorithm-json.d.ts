import { GetRisk } from './get-risk';
import { GetSurvival } from './get-survival';
import { AddLifeTable } from './add-life-table';
import { CoxJson } from '../common/json-types';
import { ToJson } from './to-json';
export interface BuildFromAlgorithmJson {
    buildFromAlgorithmJson: (algorithmJson: CoxJson) => GetSurvival & GetRisk & AddLifeTable & ToJson;
}
export declare function buildFromAlgorithmJson(algorithmJson: CoxJson): GetSurvival & GetRisk & AddLifeTable & ToJson;
