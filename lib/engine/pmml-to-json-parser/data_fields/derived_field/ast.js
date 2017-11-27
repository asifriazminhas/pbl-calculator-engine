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
        raw: String(value)
    };
}
exports.getLiteralAST = getLiteralAST;
/**
 *
 *
 * @export
 * @param {string} name
 * @returns {IdentifierAST}
 */
function getIdentifierAST(name) {
    return {
        type: 'Identifier',
        name
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
 * @returns {BinaryExpressionAST}
 */
function getBinaryExpressionAST(operator, left, right) {
    return {
        type: 'BinaryExpression',
        operator,
        left,
        right
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
 * @returns {LogicalExpressionAST}
 */
function getLogicalExpressionAST(operator, left, right) {
    return {
        type: 'LogicalExpression',
        operator,
        left,
        right
    };
}
exports.getLogicalExpressionAST = getLogicalExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {UnaryExpressionASTArgument} argument
 * @returns {UnaryExpressionAST}
 */
function getUnaryExpressionAST(operator, argument) {
    return {
        type: 'UnaryExpression',
        operator,
        argument
    };
}
exports.getUnaryExpressionAST = getUnaryExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {IdentifierAST} left
 * @param {AssignmentExpressionASTRight} right
 * @returns {AssignmentExpressionAST}
 */
function getAssignmentExpressionAST(operator, left, right) {
    return {
        type: 'AssignmentExpression',
        operator,
        left,
        right
    };
}
exports.getAssignmentExpressionAST = getAssignmentExpressionAST;
/**
 *
 *
 * @export
 * @param {AssignmentExpressionAST} expression
 * @returns {ExpressionStatementAST}
 */
function getExpressionStatementAST(expression) {
    return {
        type: 'ExpressionStatement',
        expression
    };
}
exports.getExpressionStatementAST = getExpressionStatementAST;
/**
 *
 *
 * @export
 * @param {LiteralAST} property
 * @param {string} objName
 * @returns {MemberExpressionAST}
 */
function getMemberExpressionAST(property, objName) {
    return {
        type: 'MemberExpression',
        computed: true,
        object: {
            type: 'Identifier',
            name: objName
        },
        property
    };
}
exports.getMemberExpressionAST = getMemberExpressionAST;
/**
 *
 *
 * @export
 * @param {MemberExpressionAST} callee
 * @param {Array<CallExpressionArgumentAST>} args
 * @returns {CallExpressionAST}
 */
function getCallExpressionAST(callee, args) {
    return {
        type: 'CallExpression',
        callee,
        arguments: args
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
 * @returns {ConditionalExpressionAST}
 */
function getConditionalExpressionAST(test, consequent, alternate) {
    return {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate
    };
}
exports.getConditionalExpressionAST = getConditionalExpressionAST;
function getFunctionExpressionAst(params, returnStatementAst) {
    return {
        type: 'FunctionExpression',
        params: params
            .map(param => getIdentifierAST(param)),
        body: {
            type: 'BlockStatement',
            body: [returnStatementAst]
        }
    };
}
exports.getFunctionExpressionAst = getFunctionExpressionAst;
function getReturnStatementAst(argument) {
    return {
        type: 'ReturnStatement',
        argument
    };
}
exports.getReturnStatementAst = getReturnStatementAst;
//# sourceMappingURL=ast.js.map