import { ITables } from './tables/tables';
import { IUserFunctions } from './user-functions/user-functions';
import { Data } from '../data';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';
import { parseUserFunctions } from '../../parsers/json/json-user-functions';

export enum Header {
    Age = 'Age',
    Sex = 'Sex',
    PackYears = 'Pack years'
}

export interface FileReport {
    valid: Header[];
    errors: Header[];
    warnings: Header[];
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
    public static getHeaderReport (headers: Header[]): FileReport {
        const allHeaders = Object.values(Header);

        const validHeaders = [];
        const missingHeaders = [];
        const warningHeaders = [Header.Sex];
        const ignoredHeaders = [];

        for (const header of headers) {
            if (allHeaders.indexOf(header) >= 0) {
                validHeaders.push(header);
            } else {
                ignoredHeaders.push(header);
            }
        }

        for (const header of allHeaders) {
            if (validHeaders.indexOf(header) < 0) missingHeaders.push(header);
        }

        return {
            valid: validHeaders,
            errors: missingHeaders,
            warnings: warningHeaders,
            ignored: ignoredHeaders
        };
    }

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
