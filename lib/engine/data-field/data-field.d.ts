import { Data, IDatum } from '../data';
import { Interval } from './covariate/interval';
import { IDataFieldJson } from '../../parsers/json/json-data-field';
import { ICategory } from './category';
import { ErrorCode } from './error-code';
import { IMetadata } from './metadata';
import { Coefficent } from '../data/coefficent';
export declare class DataField {
    name: string;
    intervals?: Interval[];
    /**
     * If the DataField is a categorical field, then this field will be set.
     * Otherwise it will be undefined.
     *
     * @type {ICategory[]}
     * @memberof DataField
     */
    categories?: ICategory[];
    isRequired: boolean;
    isRecommended: boolean;
    metadata: IMetadata;
    constructor(fieldJson: IDataFieldJson);
    static getUniqueDataFields(dataFields: DataField[]): DataField[];
    static isSameDataField(dataFieldOne: DataField, dataFieldTwo: DataField): boolean;
    static findDataFieldWithName(dataFields: DataField[], name: string): DataField | undefined;
    getDatumForField(data: Data): IDatum | undefined;
    isFieldWithName(name: string): boolean;
    /**
     * Validates the Datum identical to this DataField in the data arg using
     * the interval and categories fields if present
     *
     * @param {Data[]} data Data to validate in the context of this DataField
     * @returns {(ErrorCode[] | true)} If validation failed, then error codes
     * representing all the validation errors is returned
     * @memberof DataField
     */
    validateData(data: Data): ErrorCode[] | true;
    formatCoefficient(coefficient: Coefficent): number;
}
