import { DerivedFieldJson } from '../../../derived-field';
import { getOpTypeFromPmmlOpType } from '../../op_type/op_type';
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
import { DataField } from '../../../data-field';
import { FieldType } from '../../../field';
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
): Array<string | DataField> {
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

                if (derivedFieldForCurrentDerivedFrom) {
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
                            ),
                            {
                                fieldType: FieldType.DataField as FieldType.DataField,
                            },
                        );
                    } else {
                        return {
                            fieldType: FieldType.DataField as FieldType.DataField,
                            name: derivedFromItem,
                            displayName: '',
                            extensions: {},
                        };
                    }
                }
            })
    );
}

export function parseDerivedFields(
    pmml: Pmml,
    userDefinedFunctionNames: string[],
): DerivedFieldJson[] {
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
                    fieldType: FieldType.DerivedField as FieldType.DerivedField,
                    name: derivedField.$.name,
                    opType: getOpTypeFromPmmlOpType(derivedField.$.optype),
                    equation: escodegen.generate(ast),
                    derivedFrom: getDerivedFromForAst(ast, pmml),
                    displayName: '',
                    extensions: {},
                },
                dataFieldForCurrentDerivedField
                    ? parseDataFieldFromDataFieldPmmlNode(
                          dataFieldForCurrentDerivedField,
                      )
                    : {},
                {
                    fieldType: FieldType.DerivedField as FieldType.DerivedField,
                },
            );
        });
    } else {
        return [];
    }
}
