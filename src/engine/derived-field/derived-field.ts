import {
    GenericBaseDerivedField,
    GenericCategoricalDerivedField,
    GenericContinuousDerivedField,
} from './generic-derived-field';
import { DerivedFrom } from './derived-from';
import { getDatumForField } from '../field';
import { FieldType } from '../field';
import { flatten } from 'lodash';
import { Data, datumFactory, Coefficent } from '../data';
import { calculateCoefficent as calculateCoefficentForCovariate } from '../covariate';
import { Cox } from '../cox';
import PmmlFunctions from '../cox/pmml-functions';
import { shouldLogDebugInfo } from '../env';
import { Algorithm } from '../algorithm';
import { throwErrorIfUndefined } from '../undefined';
import { NoTableRowFoundError } from '../errors';

/*
The following 3 interfaces are important because of the following issue
https://github.com/Microsoft/TypeScript/issues/14174. Don't remove otherwise it
will break the type DerivedFrom in the derived-from module
*/
export interface IBaseDerivedField
    extends GenericBaseDerivedField<DerivedFrom> {}
export interface ICategoricalDerivedField
    extends GenericCategoricalDerivedField<DerivedFrom> {}
export interface IContinuousDerivedField
    extends GenericContinuousDerivedField<DerivedFrom> {}

export type DerivedField =
    | IBaseDerivedField
    | ICategoricalDerivedField
    | IContinuousDerivedField;

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

function evaluateEquation(
    derivedField: DerivedField,
    obj: {
        [index: string]: any;
    },
    userFunctions: Cox['userFunctions'],
    tables: Algorithm<any>['tables'],
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

    eval(derivedField.equation);

    return derived;
}

export function calculateCoefficent(
    derivedField: DerivedField,
    data: Data,
    userDefinedFunctions: Algorithm<any>['userFunctions'],
    tables: Algorithm<any>['tables'],
): Coefficent {
    /*Check if there is a datum for this intermediate predictor. If there is then we don't need to go further*/
    const datumForCurrentDerivedField = getDatumForField(derivedField, data);

    if (datumForCurrentDerivedField) {
        return datumForCurrentDerivedField.coefficent;
    } else {
        /*Filter out all the datum which are not needed for the equation evaluation*/
        let dataForEvaluation = data.filter(
            datum =>
                derivedField.derivedFrom.find(
                    derivedFromItem => derivedFromItem.name === datum.name,
                )
                    ? true
                    : false,
        );

        /*If we don't have all the data for evaluation when calculate it*/
        if (dataForEvaluation.length !== derivedField.derivedFrom.length) {
            dataForEvaluation = calculateDataToCalculateCoefficent(
                derivedField,
                data,
                userDefinedFunctions,
                tables,
            );
        }

        if (shouldLogDebugInfo() === true) {
            console.groupCollapsed(`Derived Field: ${derivedField.name}`);
            console.log(`Name: ${derivedField.name}`);
            console.log(`Derived Field: ${derivedField.equation}`);
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

        const evaluatedValue = evaluateEquation(
            derivedField,
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

export function calculateDataToCalculateCoefficent(
    derivedField: DerivedField,
    data: Data,
    userDefinedFunctions: Cox['userFunctions'],
    tables: Algorithm<any>['tables'],
): Data {
    /*Go through each explanatory predictor and calculate the coefficent for
    each which will be used for the evaluation*/
    return flatten(
        derivedField.derivedFrom.map(derivedFromItem => {
            const fieldName = derivedFromItem.name;

            if (
                derivedFromItem.fieldType === FieldType.InteractionCovariate ||
                derivedFromItem.fieldType === FieldType.NonInteractionCovariate
            ) {
                return datumFactory(
                    fieldName,
                    calculateCoefficentForCovariate(
                        derivedFromItem,
                        data,
                        userDefinedFunctions,
                        tables,
                    ),
                );
            } else if (derivedFromItem.fieldType === FieldType.DerivedField) {
                return datumFactory(
                    fieldName,
                    calculateCoefficent(
                        derivedFromItem,
                        data,
                        userDefinedFunctions,
                        tables,
                    ),
                );
            } else {
                const datumFound = getDatumForField(derivedFromItem, data);

                if (!datumFound) {
                    return {
                        name: derivedFromItem.name,
                        coefficent: null,
                    };
                } else {
                    return datumFound;
                }
            }
        }),
    );
}

export function getLeafFieldsForDerivedField(
    derivedField: DerivedField,
): DerivedFrom[] {
    if (derivedField.derivedFrom.length === 0) {
        return [derivedField];
    } else {
        return flatten(
            derivedField.derivedFrom.map(derivedFromItem => {
                if (derivedFromItem.fieldType === FieldType.DataField) {
                    return derivedFromItem;
                } else if (
                    derivedFromItem.fieldType === FieldType.DerivedField
                ) {
                    return getLeafFieldsForDerivedField(derivedFromItem);
                } else {
                    if (derivedFromItem.derivedField) {
                        return getLeafFieldsForDerivedField(
                            derivedFromItem.derivedField,
                        );
                    } else {
                        return derivedFromItem;
                    }
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
            if (derivedFromItem.fieldType === FieldType.DerivedField) {
                foundDerivedField = derivedFromItem;
            }
        } else {
            if (
                derivedFromItem.fieldType ===
                    FieldType.NonInteractionCovariate &&
                derivedFromItem.derivedField
            ) {
                foundDerivedField = findDescendantDerivedField(
                    derivedFromItem.derivedField,
                    name,
                );
            } else if (
                derivedFromItem.fieldType === FieldType.InteractionCovariate
            ) {
                foundDerivedField = findDescendantDerivedField(
                    derivedFromItem.derivedField,
                    name,
                );
            } else if (derivedFromItem.fieldType === FieldType.DerivedField) {
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
