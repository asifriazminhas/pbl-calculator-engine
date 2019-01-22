import { IDerivedFieldJson } from '../../../../parsers/json/json-derived-field';
import { IDerivedField, Pmml } from '../../../pmml';
import { IExpressionStatementAST } from '../../interfaces/ast';
import * as escodegen from 'escodegen';
import {
    getASTForApply,
    getASTForConstant,
    getASTForFieldRef,
    getAstForMapValues,
} from './node_parser';
import { parseDataFieldFromDataFieldPmmlNode } from '../data_field';
import { DataFieldType } from '../../../../parsers/json/data-field-type';
import { IDataFieldJson } from '../../../../parsers/json/json-data-field';
import { IPredictor } from '../../../pmml/general_regression_model/predictor';
// tslint:disable-next-line
const astTypes = require('ast-types');

function getAstForDerivedField(
    derivedField: IDerivedField,
    userDefinedFunctionNames: string[],
): IExpressionStatementAST {
    let right: any = null;
    if (derivedField.Apply) {
        right = getASTForApply(
            derivedField.Apply,
            userDefinedFunctionNames,
            true,
        );
    } else if (derivedField.Constant) {
        right = getASTForConstant(derivedField.Constant);
    } else if (derivedField.FieldRef) {
        right = getASTForFieldRef(derivedField.FieldRef, true);
    } else if (derivedField.MapValues) {
        right = getAstForMapValues(derivedField.MapValues);
    } else {
        throw new Error(`Unknown root node in derived field`);
    }

    // Make the line of code 'var {derivedFieldName};'
    const declarationAst = {
        type: 'ExpressionStatement' as 'ExpressionStatement',
        expression: {
            type: 'AssignmentExpression' as 'AssignmentExpression',
            operator: '=',
            left: {
                type: 'Identifier' as 'Identifier',
                name: 'derived',
            },
            right,
        },
    };

    return declarationAst;
}

function getDerivedFromForAst(
    ast: IExpressionStatementAST,
    pmml: Pmml,
): Array<string | IDataFieldJson> {
    const derivedFrom: string[] = [];
    const ObjIdentifier = 'obj';
    const IdentifiersToNotInclude = [
        'derived',
        'func',
        ObjIdentifier,
        'NA',
        'userFunctions',
        'tables',
        'getValueFromTable',
        'undefined',
    ];

    astTypes.visit(ast, {
        // Code like obj['age'] is a MemberExpression so to extract for example age we need to visit them
        visitMemberExpression(path: any) {
            // Check whether the AST represents accessing a property of a variable called 'obj'
            if (path.node.object.name === ObjIdentifier) {
                // The name of the field being accessed on obj
                const objectPropertyName = path.node.property.value;

                // Check whether it is NA
                if (
                    IdentifiersToNotInclude.indexOf(objectPropertyName) === -1
                ) {
                    derivedFrom.push(objectPropertyName);
                }
            }

            this.traverse(path);
        },
        visitIdentifier(path: any) {
            const variableName = path.node.name;
            if (IdentifiersToNotInclude.indexOf(variableName) === -1) {
                derivedFrom.push(variableName);
            }

            this.traverse(path);
        },
    });

    return (
        derivedFrom
            // Remove duplicates
            .filter((derivedFromItem, index, currentDerivedFrom) => {
                return currentDerivedFrom.indexOf(derivedFromItem) === index;
            })
            /* Depending on whether we find a DerivedField for the current
            derivedFromItem return iteself or a DataField based on it */
            .map(derivedFromItem => {
                const derivedFieldForCurrentDerivedFrom = pmml.findDerivedFieldWithName(
                    derivedFromItem,
                );
                let covariateForCurrentDerivedFrom: IPredictor | undefined;
                if (pmml.pmmlXml.PMML.GeneralRegressionModel) {
                    // tslint:disable-next-line:max-line-length
                    covariateForCurrentDerivedFrom = pmml.pmmlXml.PMML.GeneralRegressionModel.CovariateList.Predictor.find(
                        predictor => {
                            return predictor.$.name === derivedFromItem;
                        },
                    );
                }

                if (covariateForCurrentDerivedFrom) {
                    return derivedFromItem;
                } else if (derivedFieldForCurrentDerivedFrom) {
                    return derivedFromItem;
                } else {
                    const dataFieldForCurrentDerivedField = pmml.findDataFieldWithName(
                        derivedFromItem,
                    );

                    if (dataFieldForCurrentDerivedField) {
                        return Object.assign(
                            {},
                            parseDataFieldFromDataFieldPmmlNode(
                                dataFieldForCurrentDerivedField,
                                undefined,
                            ),
                            {
                                fieldType: DataFieldType.DataField as DataFieldType.DataField,
                            },
                        );
                    } else {
                        return {
                            fieldType: DataFieldType.DataField as DataFieldType.DataField,
                            name: derivedFromItem,
                            displayName: '',
                            extensions: {},
                            isRequired: false,
                        };
                    }
                }
            })
    );
}

export function parseDerivedFields(
    pmml: Pmml,
    userDefinedFunctionNames: string[],
): IDerivedFieldJson[] {
    if (pmml.pmmlXml.PMML.LocalTransformations.DerivedField) {
        const DerivedField =
            pmml.pmmlXml.PMML.LocalTransformations.DerivedField instanceof Array
                ? pmml.pmmlXml.PMML.LocalTransformations.DerivedField
                : [pmml.pmmlXml.PMML.LocalTransformations.DerivedField];

        // All the derived predictors for this algorithm
        return DerivedField.map(derivedField => {
            const dataFieldForCurrentDerivedField = pmml.findDataFieldWithName(
                derivedField.$.name,
            );
            const ast = getAstForDerivedField(
                derivedField,
                userDefinedFunctionNames,
            );

            return Object.assign(
                {
                    fieldType: DataFieldType.DerivedField as DataFieldType.DerivedField,
                    name: derivedField.$.name,
                    equation: escodegen.generate(ast),
                    derivedFrom: getDerivedFromForAst(ast, pmml),
                    displayName: '',
                    extensions: {},
                    isRequired: false,
                },
                dataFieldForCurrentDerivedField
                    ? parseDataFieldFromDataFieldPmmlNode(
                          dataFieldForCurrentDerivedField,
                          undefined,
                      )
                    : {},
                {
                    fieldType: DataFieldType.DerivedField as DataFieldType.DerivedField,
                },
            );
        });
    } else {
        return [];
    }
}
