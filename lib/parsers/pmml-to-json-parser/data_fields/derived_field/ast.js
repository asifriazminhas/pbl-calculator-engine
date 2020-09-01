"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLiteralAST = getLiteralAST;
exports.getIdentifierAST = getIdentifierAST;
exports.getBinaryExpressionAST = getBinaryExpressionAST;
exports.getLogicalExpressionAST = getLogicalExpressionAST;
exports.getUnaryExpressionAST = getUnaryExpressionAST;
exports.getAssignmentExpressionAST = getAssignmentExpressionAST;
exports.getExpressionStatementAST = getExpressionStatementAST;
exports.getMemberExpressionAST = getMemberExpressionAST;
exports.getCallExpressionAST = getCallExpressionAST;
exports.getConditionalExpressionAST = getConditionalExpressionAST;
exports.getFunctionExpressionAst = getFunctionExpressionAst;
exports.getReturnStatementAst = getReturnStatementAst;
exports.getObjectExpressionAst = getObjectExpressionAst;
exports.getPropertyAst = getPropertyAst;

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
    name: name
  };
}
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
    operator: operator,
    left: left,
    right: right
  };
}
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
    operator: operator,
    left: left,
    right: right
  };
}
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
    operator: operator,
    argument: argument
  };
}
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
    operator: operator,
    left: left,
    right: right
  };
}
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
    expression: expression
  };
}
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
      name: objName
    },
    property: property
  };
}
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
    callee: callee,
    arguments: args
  };
}
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
    test: test,
    consequent: consequent,
    alternate: alternate
  };
}

function getFunctionExpressionAst(params, returnStatementAst) {
  return {
    type: 'FunctionExpression',
    params: params.map(function (param) {
      return getIdentifierAST(param);
    }),
    body: {
      type: 'BlockStatement',
      body: [returnStatementAst]
    }
  };
}

function getReturnStatementAst(argument) {
  return {
    type: 'ReturnStatement',
    argument: argument
  };
}

function getObjectExpressionAst(properties) {
  return {
    type: 'ObjectExpression',
    properties: properties
  };
}

function getPropertyAst(key, value) {
  return {
    type: 'Property',
    method: false,
    shorthand: false,
    computed: false,
    key: getLiteralAST(key),
    value: value,
    kind: 'init'
  };
}
//# sourceMappingURL=ast.js.map