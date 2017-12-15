import { GenericSingleAlgorithmModel } from './generic-single-algorithm-model';
import { AlgorithmJsonTypes } from '../algorithm/algorithm-json-types';

export type SingleAlgorithmModelJson<
    U extends AlgorithmJsonTypes = AlgorithmJsonTypes
> = GenericSingleAlgorithmModel<U>;
