import { ITables } from './tables/tables';
import { IUserFunctions } from './user-functions/user-functions';
import { Data } from '../data';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';
import { parseUserFunctions } from '../../parsers/json/json-user-functions';

export abstract class Algorithm {
    name: string;
    userFunctions: IUserFunctions;
    tables: ITables;

    constructor (algorithmJson: ICoxSurvivalAlgorithmJson) {
        this.name = algorithmJson.name;
        this.userFunctions = parseUserFunctions(algorithmJson.userFunctions);
        this.tables = algorithmJson.tables;
    }

    /**
     * @description Build a report based on provided data names
     */
    public abstract buildDataNameReport (headers: string[]): DataNameReport;

    abstract evaluate (data: Data): number;
}

export interface DataNameReport {
    found: string[];
    missingRequired: string[];
    missingOptional: string[];
    ignored: string[];
}
