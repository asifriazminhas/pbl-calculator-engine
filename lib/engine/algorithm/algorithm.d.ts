import { ITables } from './tables/tables';
import { IUserFunctions } from './user-functions/user-functions';
import { Data } from '../data';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';
import { DataField } from '../data-field/data-field';
export declare abstract class Algorithm {
    name: string;
    userFunctions: IUserFunctions;
    tables: ITables;
    constructor(algorithmJson: ICoxSurvivalAlgorithmJson);
    /**
     * @description Build a report based on provided data names
     */
    abstract buildDataNameReport(headers: string[]): DataNameReport;
    abstract evaluate(data: Data): number;
}
export interface DataNameReport<T extends DataField = DataField> {
    found: T[];
    missingRequired: T[];
    missingOptional: T[];
    ignored: string[];
}
