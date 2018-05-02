import { parseModelJsonToModel, JsonModelTypes } from '../model';
import { SurvivalModelFunctions } from './survival-model-functions';
import { ModelTypes } from '../model/model-types';

export type BuildFromModelJsonFunction = (
    modelJson: JsonModelTypes,
) => SurvivalModelFunctions;

export interface IBuildFromModelJson {
    buildFromModelJson: BuildFromModelJsonFunction;
}

export function getBuildFromModelJsonFunction(): IBuildFromModelJson {
    return {
        buildFromModelJson: modelJson => {
            const model = parseModelJsonToModel(modelJson);

            return new SurvivalModelFunctions(model as ModelTypes, modelJson);
        },
    };
}
