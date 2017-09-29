import { DerivedFieldJson } from '../../../common/json-types';
import { getOpTypeFromPmmlOpType } from '../../op_type/op_type';
import { IDerivedField, Pmml } from '../../../pmml';
import { ExpressionStatementAST } from '../../interfaces/ast';
import * as escodegen from 'escodegen';
import { getASTForApply, getASTForConstant, getASTForFieldRef } from './node_parser';
import { parseDataFieldFromDataFieldPmmlNode } from '../data_field';
import { GenericDataField } from '../../../common/generic-types';
import { FieldTypes } from '../../../common/field-types';
var astTypes = require('ast-types');

function getAstForDerivedField(
    derivedField: IDerivedField,
    userDefinedFunctionNames: Array<string>
): ExpressionStatementAST {
    let right: any = null;
    if (derivedField.Apply) {
        right = getASTForApply(
            derivedField.Apply, 
            userDefinedFunctionNames,
            true
        );
    }
    else if (derivedField.Constant) {
        right = getASTForConstant(derivedField.Constant);
    }
    else if (derivedField.FieldRef) {
        right = getASTForFieldRef(derivedField.FieldRef, true);
    }
    else {
        throw new Error(`Unknown root node in derived field`);
    }

    //make the line of code 'var {derivedFieldName};'
    var declarationAst = {
        type: 'ExpressionStatement' as 'ExpressionStatement',
        expression: {
            type: 'AssignmentExpression' as 'AssignmentExpression',
            operator: '=',
            left: {
                type: 'Identifier' as 'Identifier',
                name: 'derived'
            },
            right
        }
    };

    return declarationAst;
}

function getDerivedFromForAst(
    ast: ExpressionStatementAST,
    pmml: Pmml
): Array<string | GenericDataField> {
    const derivedFrom: Array<string> = [];
    const ObjIdentifier = 'obj';
    const IdentifiersToNotInclude = [
        'derived',
        'func',
        ObjIdentifier,
        'NA',
        'userFunctions'
    ];

    astTypes.visit(ast, {
        //Code like obj['age'] is a MemberExpression so to extract for example age we need to visit them
        visitMemberExpression: function (path: any) {
            //Check whether the AST represents accessing a property of a variable called 'obj'
            if (path.node.object.name === ObjIdentifier) {
                //The name of the field being accessed on obj
                const objectPropertyName = path.node.property.value;

                //Check whether it is NA
                if (IdentifiersToNotInclude.indexOf(objectPropertyName) === -1) {
                    derivedFrom.push(objectPropertyName);
                }
            }

            this.traverse(path);
        },
        visitIdentifier: function (path: any) {
            const variableName = path.node.name
            if (IdentifiersToNotInclude.indexOf(variableName) === -1) {
                derivedFrom.push(variableName);
            }

            this.traverse(path);
        }
    });

    return derivedFrom
        //Remove duplicates
        .filter((derivedFromItem, index, derivedFrom) => {
            return derivedFrom.indexOf(derivedFromItem) === index;
        })
        //Depending on whether we find a DerivedField for the current derivedFromItem return iteself or a DataField based on it
        .map((derivedFromItem) => {
            const derivedFieldForCurrentDerivedFrom = pmml
                .findDerivedFieldWithName(derivedFromItem);

            if (derivedFieldForCurrentDerivedFrom) {
                return derivedFromItem;
            }
            else {
                const dataFieldForCurrentDerivedField = pmml.findDataFieldWithName(derivedFromItem);

                if (dataFieldForCurrentDerivedField) {
                    return Object.assign(
                        {},
                        parseDataFieldFromDataFieldPmmlNode(
                            dataFieldForCurrentDerivedField
                        ),
                        {
                            fieldType: FieldTypes.DataField as FieldTypes.DataField
                        }
                    );
                }
                else {
                    return {
                        fieldType: FieldTypes.DataField as FieldTypes.DataField,
                        name: derivedFromItem,
                        displayName: '',
                        extensions: {}
                    }
                }
            }
        });
}

export function parseDerivedFields(
    pmml: Pmml,
    userDefinedFunctionNames: Array<string>
): Array<DerivedFieldJson> {
    if (pmml.pmmlXml.PMML.LocalTransformations.DerivedField) {
        //All the derived predictors for this algorithm
        return pmml.pmmlXml.PMML.LocalTransformations.DerivedField
            .map((derivedField) => {
                const dataFieldForCurrentDerivedField = pmml
                    .findDataFieldWithName(
                    derivedField.$.name
                    );
                const ast = getAstForDerivedField(
                    derivedField,
                    userDefinedFunctionNames
                );

                return Object.assign(
                    {
                        fieldType: FieldTypes.DerivedField as FieldTypes.DerivedField,
                        name: derivedField.$.name,
                        opType: getOpTypeFromPmmlOpType(derivedField.$.optype),
                        equation: escodegen.generate(ast),
                        derivedFrom: getDerivedFromForAst(ast, pmml),
                        displayName: '',
                        extensions: {}
                    },
                    dataFieldForCurrentDerivedField ?
                        parseDataFieldFromDataFieldPmmlNode(
                            dataFieldForCurrentDerivedField
                        ) : {},
                    {
                        fieldType: FieldTypes.DerivedField as FieldTypes.DerivedField
                    }
                );
            });
    }
    else {
        return [];
    }
}