import { SurvivalModelFunctions } from './survival-model-functions';
import { Model } from '../model/model';
import { IModelJson } from '../../parsers/json/json-model';

export type BuildFromModelJsonFunction = (
    modelJson: IModelJson,
) => SurvivalModelFunctions;

export interface IBuildFromModelJson {
    buildFromModelJson: BuildFromModelJsonFunction;
}

export function getBuildFromModelJsonFunction(): IBuildFromModelJson {
    return {
        buildFromModelJson: modelJson => {
            const model = new Model(modelJson);

            return new SurvivalModelFunctions(model, modelJson);
        },
    };
}
