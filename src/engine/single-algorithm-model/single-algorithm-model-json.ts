import { GenericSingleAlgorithmModel } from './generic-single-algorithm-model';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';

export type SingleAlgorithmModelJson = GenericSingleAlgorithmModel<
    ICoxSurvivalAlgorithmJson
>;
