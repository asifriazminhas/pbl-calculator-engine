import { DataField } from '../data-field';
import { flatten } from 'lodash';
import { Data, Coefficent } from '../../data';
import { autobind } from 'core-decorators';
import { Covariate } from '../covariate/covariate';
import { throwErrorIfUndefined } from '../../../util/undefined';
import { NoTableRowFoundError } from '../../errors';
import PmmlFunctions from './pmml-functions';
import { shouldLogDebugInfo } from '../../../util/env';
import { IDerivedFieldJson } from '../../../parsers/json/json-derived-field';
import { IUserFunctions } from '../../algorithm/user-functions/user-functions';
import { ITables } from '../../algorithm/tables/tables';
import { datumFactoryFromDataField } from '../../data/datum';
import { debugRisk } from '../../../debug/debug-risk';

// tslint:disable-next-line:only-arrow-functions
const getValueFromTable = function(
    table: Array<{ [index: string]: string }>,
    outputColumn: string,
    conditions: { [index: string]: string },
): string {
    const conditionTableColumns = Object.keys(conditions);

    return throwErrorIfUndefined(
        table.find(row => {
            const unMatchedColumn = conditionTableColumns.find(
                conditionColumn => {
                    // tslint:disable-next-line
                    return row[conditionColumn] != conditions[conditionColumn];
                },
            );

            return unMatchedColumn === undefined ? true : false;
        }),
        new NoTableRowFoundError(conditions),
    )[outputColumn];
};

export function getLeafFieldsForDerivedField(
    derivedField: DerivedField,
): DataField[] {
    if (derivedField.derivedFrom.length === 0) {
        return [derivedField];
    } else {
        return flatten(
            derivedField.derivedFrom.map(derivedFromItem => {
                if (derivedFromItem instanceof DerivedField) {
                    return getLeafFieldsForDerivedField(derivedFromItem);
                } else if (derivedFromItem instanceof Covariate) {
                    if (derivedFromItem.derivedField) {
                        return getLeafFieldsForDerivedField(
                            derivedFromItem.derivedField,
                        );
                    } else {
                        return derivedFromItem;
                    }
                } else {
                    return derivedFromItem;
                }
            }),
        );
    }
}

@autobind
export class DerivedField extends DataField {
    equation: string;
    derivedFrom: DataField[];

    constructor(derivedFieldJson: IDerivedFieldJson, derivedFrom: DataField[]) {
        super(derivedFieldJson);

        this.name = derivedFieldJson.name;
        this.equation = derivedFieldJson.equation;
        this.derivedFrom = derivedFrom;
    }

    evaluateEquation(
        obj: {
            [index: string]: any;
        },
        userFunctions: IUserFunctions,
        tables: ITables,
    ): any {
        // tslint:disable-next-line
        obj;
        // tslint:disable-next-line
        userFunctions;
        // tslint:disable-next-line
        tables;

        // tslint:disable-next-line
        let derived: any = undefined;
        // tslint:disable-next-line
        let func: { [index: string]: Function } = PmmlFunctions;
        // tslint:disable-next-line
        func;
        func['getValueFromTable'] = getValueFromTable;

        eval(this.equation);

        return derived;
    }

    calculateCoefficent(
        data: Data,
        userDefinedFunctions: IUserFunctions,
        tables: ITables,
    ): Coefficent {
        /*Check if there is a datum for this intermediate predictor. If there is then we don't need to go further*/
        const datumForCurrentDerivedField = this.getDatumForField(data);

        if (datumForCurrentDerivedField) {
            return datumForCurrentDerivedField.coefficent;
        } else {
            /*Filter out all the datum which are not needed for the equation evaluation*/
            let dataForEvaluation = data.filter(datum =>
                this.derivedFrom.find(
                    derivedFromItem => derivedFromItem.name === datum.name,
                )
                    ? true
                    : false,
            );

            /*If we don't have all the data for evaluation when calculate it*/
            if (dataForEvaluation.length !== this.derivedFrom.length) {
                dataForEvaluation = this.calculateDataToCalculateCoefficent(
                    data,
                    userDefinedFunctions,
                    tables,
                );
            }

            /*make the object with the all the data needed for the equation evaluation*/
            const obj: {
                [index: string]: any;
            } = {};
            dataForEvaluation.forEach(datum => {
                obj[datum.name] = datum.coefficent;
            });

            const evaluatedValue = this.evaluateEquation(
                obj,
                userDefinedFunctions,
                tables,
            );

            let returnedCalculatedValue;

            if (isNaN(Number(evaluatedValue)) === false) {
                returnedCalculatedValue = Number(evaluatedValue);
            } else if (typeof evaluatedValue === 'string') {
                returnedCalculatedValue = evaluatedValue;
            } else {
                returnedCalculatedValue = this.formatCoefficient(
                    evaluatedValue,
                );
            }

            debugRisk.addFieldDebugInfo(this.name, returnedCalculatedValue);

            return returnedCalculatedValue;
        }
    }

    calculateDataToCalculateCoefficent(
        data: Data,
        userDefinedFunctions: IUserFunctions,
        tables: ITables,
    ): Data {
        /*Go through each explanatory predictor and calculate the coefficent for
        each which will be used for the evaluation*/
        return flatten(
            this.derivedFrom.map(derivedFromItem => {
                const datumFound = derivedFromItem.getDatumForField(data);

                if (datumFound) {
                    return [];
                }
                if (derivedFromItem instanceof Covariate) {
                    return datumFactoryFromDataField(
                        derivedFromItem,
                        derivedFromItem.calculateCoefficient(
                            data,
                            userDefinedFunctions,
                            tables,
                        ),
                    );
                } else if (derivedFromItem instanceof DerivedField) {
                    return datumFactoryFromDataField(
                        derivedFromItem,
                        derivedFromItem.calculateCoefficent(
                            data,
                            userDefinedFunctions,
                            tables,
                        ),
                    );
                } else {
                    return {
                        name: derivedFromItem.name,
                        coefficent: undefined,
                    };
                }
            }),
        );
    }

    getDescendantFields(): DataField[] {
        return DataField.getUniqueDataFields(
            flatten(
                this.derivedFrom.map(derivedFromItem => {
                    if (derivedFromItem instanceof Covariate) {
                        if (derivedFromItem.derivedField) {
                            return derivedFromItem.derivedField
                                .getDescendantFields()
                                .concat(derivedFromItem);
                        } else {
                            return derivedFromItem;
                        }
                    } else if (derivedFromItem instanceof DerivedField) {
                        return derivedFromItem
                            .getDescendantFields()
                            .concat(derivedFromItem);
                    } else {
                        return derivedFromItem;
                    }
                }),
            ),
        );
    }
}
