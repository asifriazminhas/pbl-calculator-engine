import { JsonModelTypes } from '../model';

export interface ToJson {
    toJson: () => JsonModelTypes;
}

export function getToJson(modelJson: JsonModelTypes): ToJson {
    return {
        toJson: () => {
            return modelJson;
        }
    }
}

