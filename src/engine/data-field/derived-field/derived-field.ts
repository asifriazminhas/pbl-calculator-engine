import { DataField } from '../data-field';

import { flatten } from 'lodash';
import { Data, datumFactory, Coefficent } from '../../data';
import { autobind } from 'core-decorators';
import { Covariate } from '../covariate/covariate';
import { throwErrorIfUndefined } from '../../../util/undefined';
import { NoTableRowFoundError } from '../../errors';
import PmmlFunctions from './pmml-functions';
import { shouldLogDebugInfo } from '../../../util/env';
import { NonInteractionCovariate } from '../covariate/non-interaction-covariats/non-interaction-covariate';
import { InteractionCovariate } from '../covariate/interaction-covariate/interaction-covariate';
import { IDerivedFieldJson } from '../../../parsers/json/json-derived-field';
import { IUserFunctions } from '../../algorithm/user-functions/user-functions';
import { ITables } from '../../algorithm/tables/tables';

function getValueFromTable(
    table: Array<{ [index: string]: string }>,
    outputColumn: string,
    conditions: { [index: string]: string },
): string {
    const conditionTableColumns = Object.keys(conditions);

    return throwErrorIfUndefined(
        table.find(row => {
            return conditionTableColumns.find(conditionColumn => {
                // tslint:disable-next-line
                return row[conditionColumn] != conditions[conditionColumn];
            })
                ? false
                : true;
        }),
        new NoTableRowFoundError(conditions),
    )[outputColumn];
}
// tslint:disable-next-line
getValueFromTable;

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

export function findDescendantDerivedField(
    derivedField: DerivedField,
    name: string,
): DerivedField | undefined {
    let foundDerivedField: DerivedField | undefined;

    derivedField.derivedFrom.every(derivedFromItem => {
        if (derivedFromItem.name === name) {
            if (derivedFromItem instanceof DerivedField) {
                foundDerivedField = derivedFromItem;
            }
        } else {
            if (
                derivedFromItem instanceof NonInteractionCovariate &&
                derivedFromItem.derivedField
            ) {
                foundDerivedField = findDescendantDerivedField(
                    derivedFromItem.derivedField,
                    name,
                );
            } else if (derivedFromItem instanceof InteractionCovariate) {
                foundDerivedField = findDescendantDerivedField(
                    derivedFromItem.derivedField,
                    name,
                );
            } else if (derivedFromItem instanceof DerivedField) {
                foundDerivedField = findDescendantDerivedField(
                    derivedFromItem,
                    name,
                );
            }
        }

        return foundDerivedField ? false : true;
    });

    return foundDerivedField;
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
        let func = PmmlFunctions;
        // tslint:disable-next-line
        func;

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
            let dataForEvaluation = data.filter(
                datum =>
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

            if (shouldLogDebugInfo() === true) {
                console.groupCollapsed(`Derived Field: ${this.name}`);
                console.log(`Name: ${this.name}`);
                console.log(`Derived Field: ${this.equation}`);
                console.log(`Derived Field Data`);
                console.table(dataForEvaluation);
            }

            /*make the object with the all the data needed for the equation evaluation*/
            const obj: {
                [index: string]: any;
            } = {};
            dataForEvaluation.forEach(
                datum => (obj[datum.name] = datum.coefficent),
            );

            const evaluatedValue = this.evaluateEquation(
                obj,
                userDefinedFunctions,
                tables,
            );
            if (shouldLogDebugInfo()) {
                console.log(`Evaluated value: ${evaluatedValue}`);
                console.groupEnd();
            }
            return evaluatedValue;
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
                const fieldName = derivedFromItem.name;

                if (derivedFromItem instanceof Covariate) {
                    return datumFactory(
                        fieldName,
                        derivedFromItem.calculateCoefficient(
                            data,
                            userDefinedFunctions,
                            tables,
                        ),
                    );
                } else if (derivedFromItem instanceof DerivedField) {
                    return datumFactory(
                        fieldName,
                        derivedFromItem.calculateCoefficent(
                            data,
                            userDefinedFunctions,
                            tables,
                        ),
                    );
                } else {
                    const datumFound = derivedFromItem.getDatumForField(data);

                    if (!datumFound) {
                        return {
                            name: derivedFromItem.name,
                            coefficent: undefined,
                        };
                    } else {
                        return datumFound;
                    }
                }
            }),
        );
    }
}
