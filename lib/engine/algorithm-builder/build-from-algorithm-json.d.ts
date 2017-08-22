import { GetRisk } from './get-risk';
import { GetSurvivalToTime } from './get-survival-to-time';
import { AddLifeTable } from './add-life-table';
import { CoxJson } from '../common/json-types';
import { ToJson } from './to-json';
export interface BuildFromAlgorithmJson {
    buildFromAlgorithmJson: (algorithmJson: CoxJson) => GetSurvivalToTime & GetRisk & AddLifeTable & ToJson;
}
export declare function buildFromAlgorithmJson(algorithmJson: CoxJson): GetSurvivalToTime & GetRisk & AddLifeTable & ToJson;
