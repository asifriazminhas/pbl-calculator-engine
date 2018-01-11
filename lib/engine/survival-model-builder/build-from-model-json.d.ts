import { JsonModelTypes } from '../model';
import { SurvivalModelFunctions } from './survival-model-functions';
export declare type BuildFromModelJsonFunction = (modelJson: JsonModelTypes) => SurvivalModelFunctions;
export interface IBuildFromModelJson {
    buildFromModelJson: BuildFromModelJsonFunction;
}
export declare function getBuildFromModelJsonFunction(): IBuildFromModelJson;
