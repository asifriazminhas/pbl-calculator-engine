import { ModelType, JsonModelTypes, ModelTypes } from '../model';
import { parseCoxJsonToCox } from './cox';

export function parseModelJsonToModel(
    modelTypeJson: JsonModelTypes
): ModelTypes {
    if(modelTypeJson.modelType === ModelType.SingleAlgorithm) {
        return Object.assign({}, modelTypeJson, {
            algorithm: parseCoxJsonToCox(modelTypeJson.algorithm)
        });
    } else {
        return Object.assign({}, modelTypeJson, {
            algorithms: modelTypeJson.algorithms
                .map(({algorithm, predicate}) => {
                    return {
                        algorithm: parseCoxJsonToCox(
                            algorithm
                        ),
                        predicate
                    }
                })
        });
    }
}