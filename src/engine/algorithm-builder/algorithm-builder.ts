import { buildSurvivalAlgorithm, SurvivalAlgorithmBuilder } from './build-survival-algorithm';

export interface IAlgorithmBuilder extends SurvivalAlgorithmBuilder {
}

export const AlgorithmBuilder: IAlgorithmBuilder = {
    buildSurvivalAlgorithm
}