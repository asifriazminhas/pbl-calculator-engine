import { CoxJson } from '../common/json-types';
export interface ToJson {
    toJson: () => CoxJson;
}
export declare function curryToJsonFunction(coxJson: CoxJson): () => CoxJson;
