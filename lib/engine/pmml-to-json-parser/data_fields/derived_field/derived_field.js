"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const op_type_1 = require("../../op_type/op_type");
const escodegen = require("escodegen");
const node_parser_1 = require("./node_parser");
const data_field_1 = require("../data_field");
const field_types_1 = require("../../../common/field-types");
var astTypes = require('ast-types');
function getAstForDerivedField(derivedField) {
    let right = null;
    if (derivedField.Apply) {
        right = node_parser_1.getASTForApply(derivedField.Apply);
    }
    else if (derivedField.Constant) {
        right = node_parser_1.getASTForConstant(derivedField.Constant);
    }
    else if (derivedField.FieldRef) {
        right = node_parser_1.getASTForFieldRef(derivedField.FieldRef);
    }
    else {
        throw new Error(`Unknown root node in derived field`);
    }
    //make the line of code 'var {derivedFieldName};'
    var declarationAst = {
        type: 'ExpressionStatement',
        expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
                type: 'Identifier',
                name: 'derived'
            },
            right
        }
    };
    return declarationAst;
}
function getDerivedFromForAst(ast, pmml) {
    const derivedFrom = [];
    const ObjIdentifier = 'obj';
    const IdentifiersToNotInclude = [
        'derived',
        'func',
        ObjIdentifier,
        'NA'
    ];
    astTypes.visit(ast, {
        //Code like obj['age'] is a MemberExpression so to extract for example age we need to visit them
        visitMemberExpression: function (path) {
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
        visitIdentifier: function (path) {
            const variableName = path.node.name;
            if (IdentifiersToNotInclude.indexOf(variableName) === -1) {
                derivedFrom.push(variableName);
            }
            this.traverse(path);
        }
    });
    return derivedFrom
        .filter((derivedFromItem, index, derivedFrom) => {
        return derivedFrom.indexOf(derivedFromItem) === index;
    })
        .map((derivedFromItem) => {
        const derivedFieldForCurrentDerivedFrom = pmml
            .findDerivedFieldWithName(derivedFromItem);
        if (derivedFieldForCurrentDerivedFrom) {
            return derivedFromItem;
        }
        else {
            const dataFieldForCurrentDerivedField = pmml.findDataFieldWithName(derivedFromItem);
            if (dataFieldForCurrentDerivedField) {
                return Object.assign({}, data_field_1.parseDataFieldFromDataFieldPmmlNode(dataFieldForCurrentDerivedField), {
                    fieldType: field_types_1.FieldTypes.DataField
                });
            }
            else {
                return {
                    fieldType: field_types_1.FieldTypes.DataField,
                    name: derivedFromItem,
                    displayName: '',
                    extensions: {}
                };
            }
        }
    });
}
function parseDerivedFields(pmml) {
    if (pmml.pmmlXml.PMML.LocalTransformations.DerivedField) {
        //All the derived predictors for this algorithm
        return pmml.pmmlXml.PMML.LocalTransformations.DerivedField
            .map((derivedField) => {
            const dataFieldForCurrentDerivedField = pmml
                .findDataFieldWithName(derivedField.$.name);
            const ast = getAstForDerivedField(derivedField);
            return Object.assign({
                fieldType: field_types_1.FieldTypes.DerivedField,
                name: derivedField.$.name,
                opType: op_type_1.getOpTypeFromPmmlOpType(derivedField.$.optype),
                equation: escodegen.generate(ast),
                derivedFrom: getDerivedFromForAst(ast, pmml),
                displayName: '',
                extensions: {}
            }, dataFieldForCurrentDerivedField ?
                data_field_1.parseDataFieldFromDataFieldPmmlNode(dataFieldForCurrentDerivedField) : {});
        });
    }
    else {
        return [];
    }
}
exports.parseDerivedFields = parseDerivedFields;
//# sourceMappingURL=derived_field.js.map