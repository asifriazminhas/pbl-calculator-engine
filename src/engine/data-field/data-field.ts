import { Data, IDatum } from '../data';
import { autobind } from 'core-decorators';
import { uniqWith } from 'lodash';
import { Interval } from './covariate/interval';
import { IDataFieldJson } from '../../parsers/json/json-data-field';
import { ICategory } from './category';
import { ErrorCode } from './error-code';
import { IMetadata } from './metadata';

@autobind
export class DataField {
    name: string;
    interval?: Interval;
    /**
     * If the DataField is a categorical field, then this field will be set.
     * Otherwise it will be undefined.
     *
     * @type {ICategory[]}
     * @memberof DataField
     */
    categories?: ICategory[];
    isRequired: boolean;
    metadata: IMetadata;

    constructor(fieldJson: IDataFieldJson) {
        this.name = fieldJson.name;
        this.interval = fieldJson.interval
            ? new Interval(fieldJson.interval)
            : undefined;
        this.isRequired = fieldJson.isRequired;
        this.metadata = fieldJson.metadata;
    }

    static getUniqueDataFields(dataFields: DataField[]): DataField[] {
        return uniqWith(dataFields, DataField.isSameDataField);
    }

    static isSameDataField(dataFieldOne: DataField, dataFieldTwo: DataField) {
        return dataFieldOne.name === dataFieldTwo.name;
    }

    static findDataFieldWithName(
        dataFields: DataField[],
        name: string,
    ): DataField | undefined {
        return dataFields.find(dataField => {
            return dataField.name === name;
        });
    }

    getDatumForField(data: Data): IDatum | undefined {
        return data.find(datum => datum.name === this.name);
    }

    isFieldWithName(name: string): boolean {
        return this.name === name;
    }

    /**
     * Validates the Datum identical to this DataField in the data arg using
     * the interval and categories fields if present
     *
     * @param {Data[]} data Data to validate in the context of this DataField
     * @returns {(ErrorCode | true)} If validation failed, then an ErrorCode
     * representing the error will be returned. Otherwise true will be
     * returned
     * @memberof DataField
     */
    validateData(data: Data): ErrorCode | true {
        const datumFound = this.getDatumForField(data);

        if (!datumFound) {
            return ErrorCode.NoDatumFound;
        }

        if (this.interval) {
            const numberCoefficient = Number(datumFound.coefficent);

            const lowerMarginValidation = this.interval.validateLowerMargin(
                numberCoefficient,
            );
            if (lowerMarginValidation !== true) {
                return lowerMarginValidation;
            }

            const higherMarginValidation = this.interval.validateHigherMargin(
                numberCoefficient,
            );
            if (higherMarginValidation !== true) {
                return higherMarginValidation;
            }
        }

        // If categories field exists validate whether the coefficient is part of the accepted values
        if (this.categories) {
            // Try to find a category whose value field matches the coefficient
            const foundCategory = this.categories.find(category => {
                return category.value === datumFound.coefficent;
            });

            // If no category was found then validation has failed
            if (!foundCategory) {
                return ErrorCode.InvalidCategory;
            }
        }

        return true;
    }
}
