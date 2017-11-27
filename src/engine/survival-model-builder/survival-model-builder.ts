import {
    IBuildFromModelJson,
    getBuildFromModelJsonFunction,
} from './build-from-model-json';
import {
    IBuildFromAssetsFolder,
    getBuildFromAssetsFolder,
} from './build-from-assets-folder';

export type SurvivalModelBuilder = IBuildFromModelJson & IBuildFromAssetsFolder;

export const SurvivalModelBuilder: SurvivalModelBuilder = {
    ...getBuildFromModelJsonFunction(),
    ...getBuildFromAssetsFolder(),
};
