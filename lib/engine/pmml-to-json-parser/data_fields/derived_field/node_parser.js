"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//models
const ast_1 = require("./ast");
//Object for oeprators that don't meet the normal parsing conditions
const ApplyOperatorExceptions = {
    //The - operator can be a subtraction (a - b) or a negation (-a)
    '-': function (apply) {
        if (!apply.$$[1]) {
            const leftNode = apply.$$[0];
            let leftNodeAst;
            if (leftNode['#name'] === 'Constant') {
                leftNodeAst = getASTForConstant(leftNode);
            }
            else if (leftNode['#name'] === 'FieldRef') {
                leftNodeAst = getASTForFieldRef(leftNode);
            }
            else if (leftNode['#name'] === 'Apply') {
                leftNodeAst = getASTForApply(leftNode);
            }
            if (!leftNodeAst) {
                throw new Error(`Unhandle node type`);
            }
            return ast_1.getUnaryExpressionAST('-', leftNodeAst);
        }
        else {
            return getASTForBinaryExpressionApply(apply);
        }
    }
};
/**
 * Converts a Constant node either into a UnaryExpressionAST (since some of the constants can be negative numbers) or LiteralAST
 *
 * @export
 * @param {Constant} constant
 * @returns {(UnaryExpressionAST | LiteralAST)}
 */
function getASTForConstant(constant) {
    //If the constant's dataType is a string or the dataType is not given
    if (!constant.$ || constant.$.dataType === 'string') {
        return ast_1.getLiteralAST(constant._);
    }
    else if (constant.$.dataType === 'double') {
        //Parse the value as a number
        let value = Number(constant._);
        //If it is negative then return a UnaryExpressionAST
        if (value < 0) {
            return ast_1.getUnaryExpressionAST('-', ast_1.getLiteralAST(Math.abs(value)));
        }
        else {
            return ast_1.getLiteralAST(value);
        }
    }
    else {
        throw new Error(`Unknown dataType ${constant.$.dataType} for Constant`);
    }
}
exports.getASTForConstant = getASTForConstant;
/**
 * Parses a FieldRef node
 *
 * @export
 * @param {FieldRef} fieldRef
 * @returns {MemberExpressionAST}
 */
function getASTForFieldRef(fieldRef) {
    //Since field ref's refer to other predictor values we need to inject them at runtime when evaluating an algorithm. This if the fieldRef is for example test we return the AST so that it generates obj['test']
    return ast_1.getMemberExpressionAST(ast_1.getLiteralAST(fieldRef.$.field), 'obj');
}
exports.getASTForFieldRef = getASTForFieldRef;
/**
 * Returns AST for an Apply node
 *
 * @export
 * @param {Apply} apply
 * @returns {AST}
 */
function getASTForApply(apply) {
    if (ApplyOperatorExceptions[apply.$.function]) {
        return ApplyOperatorExceptions[apply.$.function](apply);
    }
    //if the function is a binary expression operator
    if (BinaryExpressionOperators[apply.$.function] !== undefined) {
        return getASTForBinaryExpressionApply(apply);
    }
    else if (LogicalExpressionOperators[apply.$.function] !== undefined) {
        return getASTForLogicalExpressionApply(apply);
    }
    else if (apply.$.function === 'if') {
        return getASTForIfApply(apply);
    }
    else if (SpecialFunctions.indexOf(apply.$.function) > -1) {
        return getASTForCallExpressionApply(apply);
    }
    else {
        throw new Error(`Unhandled function ${apply.$.function}`);
    }
}
exports.getASTForApply = getASTForApply;
//Maps PMML functions which can be binary expression operators to their relevant ones in javascript
const BinaryExpressionOperators = {
    '*': '*',
    '/': '/',
    '+': '+',
    '-': '-',
    'greaterThan': '>',
    'lessThan': '<',
    'equal': '==',
    'greaterOrEqual': '>=',
    'lessOrEqual': '<='
};
/**
 * Maps an Apply node whose function is a binary expression operand to a BinaryExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {BinaryExpressionAST}
 */
function getASTForBinaryExpressionApply(apply) {
    var left;
    var leftNode = apply.$$[0];
    switch (leftNode['#name']) {
        case 'Constant': {
            left = getASTForConstant(leftNode);
            break;
        }
        case 'FieldRef': {
            left = getASTForFieldRef(leftNode);
            break;
        }
        case 'Apply': {
            left = getASTForApply(leftNode);
            break;
        }
        default: {
            throw new Error(`Unhandled node type ${leftNode['#name']} when getting AST for binaryh expression node`);
        }
    }
    var right;
    var rightNode = apply.$$[1];
    switch (rightNode['#name']) {
        case 'Constant': {
            right = getASTForConstant(rightNode);
            break;
        }
        case 'FieldRef': {
            right = getASTForFieldRef(rightNode);
            break;
        }
        case 'Apply': {
            right = getASTForApply(rightNode);
            break;
        }
        default: {
            throw new Error(`Unhandled node type ${rightNode['#name']} when getting AST for binaryh expression node`);
        }
    }
    if (BinaryExpressionOperators[apply.$.function] === undefined) {
        throw new Error(`Unhandled operator ${apply.$.function}`);
    }
    return ast_1.getBinaryExpressionAST(BinaryExpressionOperators[apply.$.function], left, right);
}
exports.getASTForBinaryExpressionApply = getASTForBinaryExpressionApply;
//Maps PMML Apply function strings which are logical expression operators to their corresponsing logical expression operand in JS
const LogicalExpressionOperators = {
    and: '&&',
    or: '||'
};
/**
 * Maps an Apply whose function string is one of the above LogicalExpressionOperators to a LogicalExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {LogicalExpressionAST}
 */
function getASTForLogicalExpressionApply(apply) {
    var left;
    switch (apply.$$[1]['#name']) {
        case 'Constant': {
            left = getASTForConstant(apply.$$[0]);
            break;
        }
        case 'FieldRef': {
            left = getASTForFieldRef(apply.$$[0]);
            break;
        }
        case 'Apply': {
            left = getASTForApply(apply.$$[0]);
            break;
        }
        default: {
            throw new Error(`Unhandled node ${apply.$$[1]['#name']}`);
        }
    }
    var right;
    switch (apply.$$[1]['#name']) {
        case 'Constant': {
            right = getASTForConstant(apply.$$[1]);
            break;
        }
        case 'FieldRef': {
            right = getASTForFieldRef(apply.$$[1]);
            break;
        }
        case 'Apply': {
            right = getASTForApply(apply.$$[1]);
            break;
        }
        default: {
            throw new Error(`Unhandled node ${apply.$$[1]['#name']}`);
        }
    }
    if (LogicalExpressionOperators[apply.$.function] === undefined) {
        throw new Error(`Unhandled operator ${apply.$.function}`);
    }
    return ast_1.getLogicalExpressionAST(LogicalExpressionOperators[apply.$.function], left, right);
}
exports.getASTForLogicalExpressionApply = getASTForLogicalExpressionApply;
/**
 * Maps an Apply node whose function is an if to a ConditionalExpressionAST. Do this rather than an IfStatement because it's more concise
 *
 * @export
 * @param {Apply} apply
 * @returns {ConditionalExpressionAST}
 */
function getASTForIfApply(apply) {
    var test;
    switch (apply.$$[0]['#name']) {
        case 'Constant': {
            test = getASTForConstant(apply.$$[0]);
            break;
        }
        case 'FieldRef': {
            test = getASTForFieldRef(apply.$$[0]);
            break;
        }
        case 'Apply': {
            test = getASTForApply(apply.$$[0]);
            break;
        }
        default: {
            throw new Error(`Unhandles node type ${apply.$$[0]['#name']}`);
        }
    }
    var consequent;
    switch (apply.$$[1]['#name']) {
        case 'Constant': {
            consequent = getASTForConstant(apply.$$[1]);
            break;
        }
        case 'FieldRef': {
            consequent = getASTForFieldRef(apply.$$[1]);
            break;
        }
        case 'Apply': {
            consequent = getASTForApply(apply.$$[1]);
            break;
        }
        default: {
            throw new Error(`Unhandles node type ${apply.$$[1]['#name']}`);
        }
    }
    var alternate;
    switch (apply.$$[2]['#name']) {
        case 'Constant': {
            alternate = getASTForConstant(apply.$$[2]);
            break;
        }
        case 'FieldRef': {
            alternate = getASTForFieldRef(apply.$$[2]);
            break;
        }
        case 'Apply': {
            alternate = getASTForApply(apply.$$[2]);
            break;
        }
        default: {
            throw new Error(`Unhandled node type ${apply.$$[2]['#name']}`);
        }
    }
    return ast_1.getConditionalExpressionAST(test, consequent, alternate);
}
exports.getASTForIfApply = getASTForIfApply;
//These are functions which we have implemented ourselves
const SpecialFunctions = [
    'exp',
    'ln',
    'is.na',
    'not',
    'notEqual',
    'formatDatetime',
    'max',
    'sum'
];
/**
 * Maps a PMML apply node whose function string is set to one in the above SpecialFunctions object to a CallExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {CallExpressionAST}
 */
function getASTForCallExpressionApply(apply) {
    //We make the function call look like func[apply.$.function] so that we can dynamically make the functions available at runtime
    return ast_1.getCallExpressionAST(ast_1.getMemberExpressionAST(ast_1.getLiteralAST(apply.$.function), 'func'), 
    //Go through all the function arguments
    apply.$$.map((apply) => {
        switch (apply['#name']) {
            case 'Constant': {
                return getASTForConstant(apply);
            }
            case 'FieldRef': {
                return getASTForFieldRef(apply);
            }
            case 'Apply': {
                return getASTForApply(apply);
            }
            default: {
                throw new Error(`Unhandled node type ${apply['#name']}`);
            }
        }
    }));
}
exports.getASTForCallExpressionApply = getASTForCallExpressionApply;
//# sourceMappingURL=node_parser.js.map