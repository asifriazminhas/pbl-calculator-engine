import { buildSurvivalAlgorithm, BrowserSurvivalAlgorithmBuilder } from './browser-build-survival-algorithm';

export interface IBrowserAlgorithmBuilder extends BrowserSurvivalAlgorithmBuilder {}

export const AlgorithmBuilder: IBrowserAlgorithmBuilder = {
    buildSurvivalAlgorithm
}