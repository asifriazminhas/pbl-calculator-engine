import { parseModelJsonToModel, JsonModelTypes } from '../model';
import { SurvivalModelFunctions } from './survival-model-functions';

export type BuildFromAlgorithJsonFunction = (
    modelJson: JsonModelTypes,
) => SurvivalModelFunctions;

export interface IBuildFromAlgorithmJson {
    buildFromAlgorithmJson: BuildFromAlgorithJsonFunction;
}

export function getBuildFromAlgorithmJsonFunction(): IBuildFromAlgorithmJson {
    return {
        buildFromAlgorithmJson: modelJson => {
            const model = parseModelJsonToModel(modelJson);

            return new SurvivalModelFunctions(model);
        },
    };
}
