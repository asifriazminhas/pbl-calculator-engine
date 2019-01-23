import { Data, IDatum } from '../data';
import { autobind } from 'core-decorators';
import { uniqWith } from 'lodash';
import { Interval } from './covariate/interval';
import { IDataFieldJson } from '../../parsers/json/json-data-field';
import { ICategory } from './category';

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

    constructor(fieldJson: IDataFieldJson) {
        this.name = fieldJson.name;
        this.interval = fieldJson.interval
            ? new Interval(fieldJson.interval)
            : undefined;
        this.isRequired = fieldJson.isRequired;
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
     * @returns {(string | true)} If validation failed then a string
     * representing the error message will be returned. Otherwise true will be
     * returned
     * @memberof DataField
     */
    validateData(data: Data): string | true {
        const datumFound = this.getDatumForField(data);

        if (!datumFound) {
            return `No datum found with name ${this.name}`;
        }

        if (this.interval) {
            const numberCoefficient = Number(datumFound.coefficent);

            const lowerMarginValidation = this.interval.validateLowerMargin(
                numberCoefficient,
                this.name,
            );
            if (lowerMarginValidation !== true) {
                return lowerMarginValidation;
            }

            const higherMarginValidation = this.interval.validateHigherMargin(
                numberCoefficient,
                this.name,
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
                // Make the string of allowed category values used in the error message.
                const allowedCategoryValues = this.categories
                    .map(category => {
                        return category.value;
                    })
                    .join(', ');

                return `Datum value for variable ${this
                    .name} can only have values ${allowedCategoryValues}`;
            }
        }

        return true;
    }
}
