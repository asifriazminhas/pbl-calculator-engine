import { SurvivalModelFunctions } from './survival-model-functions';
import { IModelJson } from '../../parsers/json/json-model';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';
export declare type BuildFromModelJsonFunction = (modelJson: IModelJson<ICoxSurvivalAlgorithmJson>) => SurvivalModelFunctions;
export interface IBuildFromModelJson {
    buildFromModelJson: BuildFromModelJsonFunction;
}
export declare function getBuildFromModelJsonFunction(): IBuildFromModelJson;
