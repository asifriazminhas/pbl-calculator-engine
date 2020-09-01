import { ITables } from './tables/tables';
import { IUserFunctions } from './user-functions/user-functions';
import { Data } from '../data';
import { IAlgorithmJson } from '../../parsers/json/json-algorithm';
export declare abstract class Algorithm {
    name: string;
    userFunctions: IUserFunctions;
    tables: ITables;
    constructor(algorithmJson: IAlgorithmJson);
    abstract evaluate(data: Data): number;
}
