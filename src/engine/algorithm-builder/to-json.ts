import { CoxJson } from '../common/json-types';

export interface ToJson {
    toJson: () => CoxJson;
}

export function getToJson(coxJson: CoxJson): ToJson {
    return {
        toJson: () => {
            return coxJson;
        }
    }
}

