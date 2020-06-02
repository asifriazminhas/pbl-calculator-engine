import { SurvivalModelFunctions } from './survival-model-functions';
import { Model } from '../model/model';
import { IModelJson } from '../../parsers/json/json-model';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';
import { CoxSurvivalAlgorithm } from '../model';

export type BuildFromModelJsonFunction = (
    modelJson: IModelJson<ICoxSurvivalAlgorithmJson>,
) => SurvivalModelFunctions;

export interface IBuildFromModelJson {
    buildFromModelJson: BuildFromModelJsonFunction;
}

export function getBuildFromModelJsonFunction(): IBuildFromModelJson {
    return {
        buildFromModelJson: modelJson => {
            const model = new Model<CoxSurvivalAlgorithm>(modelJson);

            return new SurvivalModelFunctions(model, modelJson);
        },
    };
}
