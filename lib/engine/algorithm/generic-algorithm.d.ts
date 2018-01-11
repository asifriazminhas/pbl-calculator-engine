import { AlgorithmType } from './algorithm-type';
export interface ITables {
    [index: string]: Array<{
        [index: string]: string;
    }>;
}
export interface IGenericAlgorithm<U, Z extends AlgorithmType> {
    algorithmType: Z;
    name: string;
    version: string;
    description: string;
    userFunctions: {
        [index: string]: U;
    };
    tables: ITables;
}
