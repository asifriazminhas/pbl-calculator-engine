import { CoxJson } from '../common/json-types';

export interface ToJson {
    toJson: () => CoxJson;
}

export function curryToJsonFunction(
    coxJson: CoxJson
): () => CoxJson {
    return () => {
        return coxJson;
    }
}

