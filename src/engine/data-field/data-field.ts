import { Data, IDatum } from '../data';
import { autobind } from 'core-decorators';
import { uniqWith } from 'lodash';
import { Interval } from './covariate/interval';
import { IDataFieldJson } from '../../parsers/json/json-data-field';
import { ICategory } from './category';
import { ErrorCode } from './error-code';
import { IMetadata } from './metadata';
import { Coefficent } from '../data/coefficent';
import moment = require('moment');

@autobind
export class DataField {
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

    constructor(fieldJson: IDataFieldJson) {
        this.name = fieldJson.name;
        this.intervals = fieldJson.intervals
            ? fieldJson.intervals.map(interval => {
                  return new Interval(interval);
              })
            : undefined;
        this.categories = fieldJson.categories;
        this.isRequired = fieldJson.isRequired;
        this.metadata = fieldJson.metadata;
        this.isRecommended = fieldJson.isRecommended;
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
     * @returns {(ErrorCode[] | true)} If validation failed, then error codes
     * representing all the validation errors is returned
     * @memberof DataField
     */
    validateData(data: Data): ErrorCode[] | true {
        const datumFound = this.getDatumForField(data);

        if (!datumFound) {
            return [ErrorCode.NoDatumFound];
        }

        const errorCodes: ErrorCode[] = [];

        if (this.intervals) {
            const numberCoefficient = Number(datumFound.coefficent);
            const isEmptyString =
                typeof datumFound.coefficent === 'string' &&
                datumFound.coefficent.trim().length === 0;

            if (isNaN(numberCoefficient) || isEmptyString) {
                errorCodes.push(ErrorCode.NotANumber);
            } else {
                // Go through each interval and validate the margins of each one.
                // If both margins are validated for any interval than
                // validation passes. Otherwise add to the list of error codes
                // if it hasn't already been added
                for (const interval of this.intervals) {
                    const lowerMarginValidation = interval.validateLowerMargin(
                        numberCoefficient,
                    );
                    if (
                        lowerMarginValidation !== true &&
                        errorCodes.indexOf(lowerMarginValidation) === -1
                    ) {
                        errorCodes.push(lowerMarginValidation);
                    }

                    const higherMarginValidation = interval.validateHigherMargin(
                        numberCoefficient,
                    );
                    if (
                        higherMarginValidation !== true &&
                        errorCodes.indexOf(higherMarginValidation) === -1
                    ) {
                        errorCodes.push(higherMarginValidation);
                    }

                    if (
                        lowerMarginValidation === true &&
                        higherMarginValidation === true
                    ) {
                        return true;
                    }
                }
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
                errorCodes.push(ErrorCode.InvalidCategory);
            } else {
                // Otherwise validation passes
                return true;
            }
        }

        return errorCodes;
    }

    formatCoefficient(coefficient: Coefficent) {
        if (coefficient instanceof moment || coefficient instanceof Date) {
            throw new Error(`Coefficent is not a number ${this.name}`);
        } else {
            const formattedCoefficient = Number(coefficient);

            if (this.intervals) {
                // Find One interval where the coefficient is within it's bounds
                const validatedInterval = this.intervals.find(interval => {
                    return interval.validate(formattedCoefficient);
                });

                if (validatedInterval) {
                    return formattedCoefficient;
                } else {
                    return this.intervals[0].limitNumber(formattedCoefficient);
                }
            }

            return formattedCoefficient;
        }
    }
}
