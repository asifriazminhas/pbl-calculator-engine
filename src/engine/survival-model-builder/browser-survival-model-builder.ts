import {
    IBuildFromAlgorithmJson,
    getBuildFromAlgorithmJsonFunction,
} from './build-from-algorithm-json';

export type SurvivalModelBuilder = IBuildFromAlgorithmJson;

export const SurvivalModelBuilder: SurvivalModelBuilder = {
    ...getBuildFromAlgorithmJsonFunction(),
};
