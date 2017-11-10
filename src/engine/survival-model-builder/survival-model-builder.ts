import {
    IBuildFromAlgorithmJson,
    getBuildFromAlgorithmJsonFunction,
} from './build-from-algorithm-json';
import {
    IBuildFromAssetsFolder,
    getBuildFromAssetsFolder,
} from './build-from-assets-folder';

export type SurvivalModelBuilder = IBuildFromAlgorithmJson &
    IBuildFromAssetsFolder;

export const SurvivalModelBuilder: SurvivalModelBuilder = {
    ...getBuildFromAlgorithmJsonFunction(),
    ...getBuildFromAssetsFolder(),
};
