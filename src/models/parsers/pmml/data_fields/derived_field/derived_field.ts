import { DerivedFieldJson } from '../../../json/data_fields/derived_field';
import { getOpTypeFromPmmlOpType } from '../../op_type/op_type';
import { IDerivedField, Pmml } from '../../../../pmml';
import { ExpressionStatementAST } from '../../interfaces/ast';
import * as escodegen from 'escodegen';
import { getASTForApply, getASTForConstant, getASTForFieldRef } from './node_parser';
import { parseDataFieldFromDataFieldPmmlNode } from '../data_field';
import { GenericDataFields } from '../../../../common';
var astTypes = require('ast-types');

function getAstForDerivedField(derivedField: IDerivedField): ExpressionStatementAST {
    let right: any = null;
    if (derivedField.Apply) {
        right = getASTForApply(derivedField.Apply);
    }
    else if (derivedField.Constant) {
        right = getASTForConstant(derivedField.Constant);
    }
    else if (derivedField.FieldRef) {
        right = getASTForFieldRef(derivedField.FieldRef);
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
): Array<string | GenericDataFields> {
    const derivedFrom: Array<string> = [];
    const ObjIdentifier = 'obj';
    const IdentifiersToNotInclude = [
        'derived',
        'func',
        ObjIdentifier,
        'NA'
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
                    return parseDataFieldFromDataFieldPmmlNode(
                        dataFieldForCurrentDerivedField
                    );
                }
                else {
                    return {
                        name: derivedFromItem,
                        displayName: '',
                        extensions: {}
                    }
                }
            }
        });
}

export function parseDerivedFields(pmml: Pmml): Array<DerivedFieldJson> {
    //All the derived predictors for this algorithm
    return pmml.pmmlXml.PMML.LocalTransformations.DerivedField
        .map((derivedField) => {
            const dataFieldForCurrentDerivedField = pmml
                .findDataFieldWithName(
                    derivedField.$.name
            );
            const ast = getAstForDerivedField(derivedField);

            return Object.assign(
                {
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
                    ) : {}
            );
        });
}