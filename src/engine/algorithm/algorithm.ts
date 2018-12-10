import { ITables } from './tables/tables';
import { IUserFunctions } from './user-functions/user-functions';
import { Data } from '../data';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';
import { parseUserFunctions } from '../../parsers/json/json-user-functions';

export interface FileReport {
    valid: string[];
    errors: string[];
    warnings: string[];
    ignored: string[];
}

export abstract class Algorithm {
    /**
     * @description Build a report based on detected headers from a file. Build a list of headers
     * that are:
     * valid: required and found
     * error: required and missing
     * warning: optional and missing
     * ignored: extra, unnecessary headers
     */
    public abstract getHeaderReport (headers: string[]): FileReport;

    name: string;
    userFunctions: IUserFunctions;
    tables: ITables;

    constructor (algorithmJson: ICoxSurvivalAlgorithmJson) {
        this.name = algorithmJson.name;
        this.userFunctions = parseUserFunctions(algorithmJson.userFunctions);
        this.tables = algorithmJson.tables;
    }

    abstract evaluate (data: Data): number;
}
