"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 *
 * @export
 * @param {(number | string)} value
 * @returns {LiteralAST}
 */
function getLiteralAST(value) {
    return {
        type: 'Literal',
        value: value,
        raw: String(value),
    };
}
exports.getLiteralAST = getLiteralAST;
/**
 *
 *
 * @export
 * @param {string} name
 * @returns {IIdentifierAST}
 */
function getIdentifierAST(name) {
    return {
        type: 'Identifier',
        name,
    };
}
exports.getIdentifierAST = getIdentifierAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {BinaryExpressionASTLeftAndRight} left
 * @param {BinaryExpressionASTLeftAndRight} right
 * @returns {IBinaryExpressionAST}
 */
function getBinaryExpressionAST(operator, left, right) {
    return {
        type: 'BinaryExpression',
        operator,
        left,
        right,
    };
}
exports.getBinaryExpressionAST = getBinaryExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {LogicalExpressionASTLeftAndRight} left
 * @param {LogicalExpressionASTLeftAndRight} right
 * @returns {ILogicalExpressionAST}
 */
function getLogicalExpressionAST(operator, left, right) {
    return {
        type: 'LogicalExpression',
        operator,
        left,
        right,
    };
}
exports.getLogicalExpressionAST = getLogicalExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {UnaryExpressionASTArgument} argument
 * @returns {IUnaryExpressionAST}
 */
function getUnaryExpressionAST(operator, argument) {
    return {
        type: 'UnaryExpression',
        operator,
        argument,
    };
}
exports.getUnaryExpressionAST = getUnaryExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {IIdentifierAST} left
 * @param {AssignmentExpressionASTRight} right
 * @returns {IAssignmentExpressionAST}
 */
function getAssignmentExpressionAST(operator, left, right) {
    return {
        type: 'AssignmentExpression',
        operator,
        left,
        right,
    };
}
exports.getAssignmentExpressionAST = getAssignmentExpressionAST;
/**
 *
 *
 * @export
 * @param {IAssignmentExpressionAST} expression
 * @returns {IExpressionStatementAST}
 */
function getExpressionStatementAST(expression) {
    return {
        type: 'ExpressionStatement',
        expression,
    };
}
exports.getExpressionStatementAST = getExpressionStatementAST;
/**
 *
 *
 * @export
 * @param {ILiteralAST} property
 * @param {string} objName
 * @returns {IMemberExpressionAST}
 */
function getMemberExpressionAST(property, objName) {
    return {
        type: 'MemberExpression',
        computed: true,
        object: {
            type: 'Identifier',
            name: objName,
        },
        property,
    };
}
exports.getMemberExpressionAST = getMemberExpressionAST;
/**
 *
 *
 * @export
 * @param {IMemberExpressionAST} callee
 * @param {Array<CallExpressionArgumentAST>} args
 * @returns {ICallExpressionAST}
 */
function getCallExpressionAST(callee, args) {
    return {
        type: 'CallExpression',
        callee,
        arguments: args,
    };
}
exports.getCallExpressionAST = getCallExpressionAST;
/**
 *
 *
 * @export
 * @param {ConditionalExpressionTestAST} test
 * @param {ConditionalExpressionConsequentAST} consequent
 * @param {ConditionalExpressionAlternateAST} alternate
 * @returns {IConditionalExpressionAST}
 */
function getConditionalExpressionAST(test, consequent, alternate) {
    return {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate,
    };
}
exports.getConditionalExpressionAST = getConditionalExpressionAST;
function getFunctionExpressionAst(params, returnStatementAst) {
    return {
        type: 'FunctionExpression',
        params: params.map(param => getIdentifierAST(param)),
        body: {
            type: 'BlockStatement',
            body: [returnStatementAst],
        },
    };
}
exports.getFunctionExpressionAst = getFunctionExpressionAst;
function getReturnStatementAst(argument) {
    return {
        type: 'ReturnStatement',
        argument,
    };
}
exports.getReturnStatementAst = getReturnStatementAst;
function getObjectExpressionAst(properties) {
    return {
        type: 'ObjectExpression',
        properties,
    };
}
exports.getObjectExpressionAst = getObjectExpressionAst;
function getPropertyAst(key, value) {
    return {
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        key: getLiteralAST(key),
        value,
        kind: 'init',
    };
}
exports.getPropertyAst = getPropertyAst;
//# sourceMappingURL=ast.js.map