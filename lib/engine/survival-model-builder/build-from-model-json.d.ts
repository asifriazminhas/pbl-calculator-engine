import { SurvivalModelFunctions } from './survival-model-functions';
import { IModelJson } from '../../parsers/json/json-model';
export declare type BuildFromModelJsonFunction = (modelJson: IModelJson) => SurvivalModelFunctions;
export interface IBuildFromModelJson {
    buildFromModelJson: BuildFromModelJsonFunction;
}
export declare function getBuildFromModelJsonFunction(): IBuildFromModelJson;
