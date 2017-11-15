import { parseModelJsonToModel, JsonModelTypes } from '../model';
import { SurvivalModelFunctions } from './survival-model-functions';

export type BuildFromModelJsonFunction = (
    modelJson: JsonModelTypes,
) => SurvivalModelFunctions;

export interface IBuildFromModelJson {
    buildFromAlgorithmJson: BuildFromModelJsonFunction;
}

export function getBuildFromModelJsonFunction(): IBuildFromModelJson {
    return {
        buildFromAlgorithmJson: modelJson => {
            const model = parseModelJsonToModel(modelJson);

            return new SurvivalModelFunctions(model);
        },
    };
}
