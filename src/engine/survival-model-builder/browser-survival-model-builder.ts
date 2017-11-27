import {
    IBuildFromModelJson,
    getBuildFromModelJsonFunction,
} from './build-from-model-json';

export type SurvivalModelBuilder = IBuildFromModelJson;

export const SurvivalModelBuilder: SurvivalModelBuilder = {
    ...getBuildFromModelJsonFunction(),
};
