import { DataField } from '../data-field';
import { Data, Coefficent } from '../../data';
import { IDerivedFieldJson } from '../../../parsers/json/json-derived-field';
import { IUserFunctions } from '../../algorithm/user-functions/user-functions';
import { ITables } from '../../algorithm/tables/tables';
export declare function getLeafFieldsForDerivedField(derivedField: DerivedField): DataField[];
export declare function findDescendantDerivedField(derivedField: DerivedField, name: string): DerivedField | undefined;
export declare class DerivedField extends DataField {
    equation: string;
    derivedFrom: DataField[];
    constructor(derivedFieldJson: IDerivedFieldJson, derivedFrom: DataField[]);
    evaluateEquation(obj: {
        [index: string]: any;
    }, userFunctions: IUserFunctions, tables: ITables): any;
    calculateCoefficent(data: Data, userDefinedFunctions: IUserFunctions, tables: ITables): Coefficent;
    calculateDataToCalculateCoefficent(data: Data, userDefinedFunctions: IUserFunctions, tables: ITables): Data;
    getDescendantFields(): DataField[];
}
