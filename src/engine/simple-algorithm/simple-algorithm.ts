import { Algorithm, AlgorithmType } from '../algorithm';
import { IGenericSimpleAlgorithm } from './generic-simple-algorithm';
import { DerivedField } from '../derived-field';

export interface ISimpleAlgorithm
    extends Algorithm<AlgorithmType.SimpleAlgorithm>,
        IGenericSimpleAlgorithm<() => any, DerivedField> {}
