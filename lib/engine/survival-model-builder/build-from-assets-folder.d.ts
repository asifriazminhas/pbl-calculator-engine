import { SurvivalModelFunctions } from './survival-model-functions';
export declare type BuildFromAssetsFolderFunction = (assetsFolderPath: string) => Promise<SurvivalModelFunctions>;
export interface IBuildFromAssetsFolder {
    buildFromAssetsFolder: BuildFromAssetsFolderFunction;
}
export declare function getBuildFromAssetsFolder(): IBuildFromAssetsFolder;
