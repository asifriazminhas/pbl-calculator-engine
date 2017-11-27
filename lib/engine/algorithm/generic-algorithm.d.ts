import { AlgorithmType } from './algorithm-type';
export interface IGenericAlgorithm<T, U, V> {
    algorithmType: AlgorithmType;
    name: string;
    version: string;
    description: string;
    covariates: T[];
    baseline: number | V;
    userFunctions: {
        [index: string]: U;
    };
}
