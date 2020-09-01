import { JsonSerializable } from '../../util/types';
import { SimpleAlgorithm } from '../../engine/algorithm/simple-algorithm/simple-algorithm';
import { Omit } from 'utility-types';
import { IAlgorithmJson } from './json-algorithm';
import { AlgorithmType } from './algorithm-type';
import { IUserFunctionsJson } from './json-user-functions';
import { IDerivedFieldJson } from './json-derived-field';

export interface IJsonSimpleAlgorithm
    extends Omit<JsonSerializable<SimpleAlgorithm>, 'output' | 'userFunctions'>,
        IAlgorithmJson {
    algorithmType: AlgorithmType.SimpleAlgorithm;
    output: string;
    userFunctions: IUserFunctionsJson;
    derivedFields: IDerivedFieldJson[];
}
