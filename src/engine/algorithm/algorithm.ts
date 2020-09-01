import { ITables } from './tables/tables';
import { IUserFunctions } from './user-functions/user-functions';
import { Data } from '../data';
import { parseUserFunctions } from '../../parsers/json/json-user-functions';
import { IAlgorithmJson } from '../../parsers/json/json-algorithm';

export abstract class Algorithm {
    name: string;
    userFunctions: IUserFunctions;
    tables: ITables;

    constructor(algorithmJson: IAlgorithmJson) {
        this.name = algorithmJson.name;
        this.userFunctions = parseUserFunctions(algorithmJson.userFunctions);
        this.tables = algorithmJson.tables;
    }

    abstract evaluate(data: Data): number;
}
