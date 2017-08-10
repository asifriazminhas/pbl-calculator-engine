import { cox, CoxBuilder } from './cox';

export interface IAlgorithmBuilder extends CoxBuilder {
}

export const AlgorithmBuilder: IAlgorithmBuilder = {
    cox
}