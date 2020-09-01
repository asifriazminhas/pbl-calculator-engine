"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getASTForConstant = getASTForConstant;
exports.getASTForFieldRef = getASTForFieldRef;
exports.getASTForApply = getASTForApply;
exports.getASTForBinaryExpressionApply = getASTForBinaryExpressionApply;
exports.getASTForLogicalExpressionApply = getASTForLogicalExpressionApply;
exports.getASTForIfApply = getASTForIfApply;
exports.getASTForCallExpressionApply = getASTForCallExpressionApply;
exports.getASTForUserDefinedFunctionApply = getASTForUserDefinedFunctionApply;
exports.getAstForMapValues = getAstForMapValues;

var _ast = require("./ast");

var _pmmlFunctions = _interopRequireDefault(require("../../../../engine/data-field/derived-field/pmml-functions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//interfaces
//models
//Object for oeprators that don't meet the normal parsing conditions
var ApplyOperatorExceptions = {
  //The - operator can be a subtraction (a - b) or a negation (-a)
  '-': function _(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst) {
    if (!apply.$$[1]) {
      var leftNode = apply.$$[0];
      var leftNodeAst;

      if (leftNode['#name'] === 'Constant') {
        leftNodeAst = getASTForConstant(leftNode);
      } else if (leftNode['#name'] === 'FieldRef') {
        leftNodeAst = getASTForFieldRef(leftNode, wrapFieldRefInMemberExpressionAst);
      } else if (leftNode['#name'] === 'Apply') {
        leftNodeAst = getASTForApply(leftNode, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
      }

      if (!leftNodeAst) {
        throw new Error("Unhandle node type");
      }

      return (0, _ast.getUnaryExpressionAST)('-', leftNodeAst);
    } else {
      return getASTForBinaryExpressionApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
    }
  }
};
/**
 * Converts a Constant node either into a UnaryExpressionAST (since some of the constants can be negative numbers) or LiteralAST
 *
 * @export
 * @param {Constant} constant
 * @returns {(IUnaryExpressionAST | ILiteralAST)}
 */

function getASTForConstant(constant) {
  //If the constant's dataType is a string or the dataType is not given
  if (!constant.$ || constant.$.dataType === 'string') {
    return (0, _ast.getLiteralAST)(constant._);
  } else if (constant.$.dataType === 'double') {
    //If it's dataType is a double
    //Parse the value as a number
    var value = Number(constant._); //If it is negative then return a UnaryExpressionAST

    if (value < 0) {
      return (0, _ast.getUnaryExpressionAST)('-', (0, _ast.getLiteralAST)(Math.abs(value)));
    } else {
      return (0, _ast.getLiteralAST)(value);
    }
  } else if (constant.$.dataType === 'NA') {
    return (0, _ast.getIdentifierAST)('undefined');
  } else if (constant.$.dataType === 'NULL') {
    return (0, _ast.getIdentifierAST)('null');
  } else if (constant.$.dataType === 'boolean') {
    return (0, _ast.getLiteralAST)(constant._ === 'true' ? true : false);
  } else {
    throw new Error("Unknown dataType ".concat(constant.$.dataType, " for Constant"));
  }
}
/**
 * Parses a FieldRef node
 *
 * @export
 * @param {FieldRef} fieldRef
 * @returns {IMemberExpressionAST}
 */


function getASTForFieldRef(fieldRef, wrapInMemberExpressionAst) {
  //Since field ref's refer to other predictor values we need to inject them at runtime when evaluating an algorithm. This if the fieldRef is for example test we return the AST so that it generates obj['test']
  return wrapInMemberExpressionAst ? (0, _ast.getMemberExpressionAST)((0, _ast.getLiteralAST)(fieldRef.$.field), 'obj') : (0, _ast.getIdentifierAST)(fieldRef.$.field);
}
/**
 * Returns AST for an Apply node
 *
 * @export
 * @param {Apply} apply
 * @returns {AST}
 */


function getASTForApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst) {
  if (ApplyOperatorExceptions[apply.$.function]) {
    return ApplyOperatorExceptions[apply.$.function](apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
  } //if the function is a binary expression operator


  if (BinaryExpressionOperators[apply.$.function] !== undefined) {
    return getASTForBinaryExpressionApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
  } else if (LogicalExpressionOperators[apply.$.function] !== undefined) {
    //if the function is a logical expression operator
    return getASTForLogicalExpressionApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
  } else if (apply.$.function === 'if') {
    //if the function is an if statement
    return getASTForIfApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
  } else if (SpecialFunctions.find(function (specialFunction) {
    return specialFunction === apply.$.function;
  })) {
    //if it is one of the special PMML functions
    return getASTForCallExpressionApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
  } else if (userDefinedFunctionNames.indexOf(apply.$.function) > -1) {
    return getASTForUserDefinedFunctionApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
  } else {
    throw new Error("Unhandled function ".concat(apply.$.function));
  }
} //Maps PMML functions which can be binary expression operators to their relevant ones in javascript


var BinaryExpressionOperators = {
  '*': '*',
  '/': '/',
  '+': '+',
  '-': '-',
  greaterThan: '>',
  lessThan: '<',
  equal: '==',
  greaterOrEqual: '>=',
  lessOrEqual: '<='
};
/**
 * Maps an Apply node whose function is a binary expression operand to a BinaryExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {IBinaryExpressionAST}
 */

function getASTForBinaryExpressionApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst) {
  var isInUserFunction = !wrapFieldRefInMemberExpressionAst;
  var left;
  var leftNode = apply.$$[0];

  switch (leftNode['#name']) {
    case 'Constant':
      {
        left = getASTForConstant(leftNode);
        break;
      }

    case 'FieldRef':
      {
        left = getASTForFieldRef(leftNode, wrapFieldRefInMemberExpressionAst);
        break;
      }

    case 'Apply':
      {
        left = getASTForApply(leftNode, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
        break;
      }

    case 'MapValues':
      {
        left = getAstForMapValues(leftNode, isInUserFunction);
        break;
      }

    default:
      {
        throw new Error("Unhandled node type ".concat(leftNode['#name'], " when getting AST for binaryh expression node"));
      }
  }

  var right;
  var rightNode = apply.$$[1];

  switch (rightNode['#name']) {
    case 'Constant':
      {
        right = getASTForConstant(rightNode);
        break;
      }

    case 'FieldRef':
      {
        right = getASTForFieldRef(rightNode, wrapFieldRefInMemberExpressionAst);
        break;
      }

    case 'Apply':
      {
        right = getASTForApply(rightNode, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
        break;
      }

    case 'MapValues':
      {
        right = getAstForMapValues(rightNode, isInUserFunction);
        break;
      }

    default:
      {
        throw new Error("Unhandled node type ".concat(rightNode['#name'], " when getting AST for binaryh expression node"));
      }
  }

  if (BinaryExpressionOperators[apply.$.function] === undefined) {
    throw new Error("Unhandled operator ".concat(apply.$.function));
  }

  return (0, _ast.getBinaryExpressionAST)(BinaryExpressionOperators[apply.$.function], left, right);
} //Maps PMML Apply function strings which are logical expression operators to their corresponsing logical expression operand in JS


var LogicalExpressionOperators = {
  and: '&&',
  or: '||'
};
/**
 * Maps an Apply whose function string is one of the above LogicalExpressionOperators to a LogicalExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {ILogicalExpressionAST}
 */

function getASTForLogicalExpressionApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst) {
  var left;

  switch (apply.$$[1]['#name']) {
    case 'Constant':
      {
        left = getASTForConstant(apply.$$[0]);
        break;
      }

    case 'FieldRef':
      {
        left = getASTForFieldRef(apply.$$[0], wrapFieldRefInMemberExpressionAst);
        break;
      }

    case 'Apply':
      {
        left = getASTForApply(apply.$$[0], userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
        break;
      }

    default:
      {
        throw new Error("Unhandled node ".concat(apply.$$[1]['#name']));
      }
  }

  var right;

  switch (apply.$$[1]['#name']) {
    case 'Constant':
      {
        right = getASTForConstant(apply.$$[1]);
        break;
      }

    case 'FieldRef':
      {
        right = getASTForFieldRef(apply.$$[1], wrapFieldRefInMemberExpressionAst);
        break;
      }

    case 'Apply':
      {
        right = getASTForApply(apply.$$[1], userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
        break;
      }

    default:
      {
        throw new Error("Unhandled node ".concat(apply.$$[1]['#name']));
      }
  }

  if (LogicalExpressionOperators[apply.$.function] === undefined) {
    throw new Error("Unhandled operator ".concat(apply.$.function));
  }

  return (0, _ast.getLogicalExpressionAST)(LogicalExpressionOperators[apply.$.function], left, right);
}
/**
 * Maps an Apply node whose function is an if to a ConditionalExpressionAST. Do this rather than an IfStatement because it's more concise
 *
 * @export
 * @param {Apply} apply
 * @returns {IConditionalExpressionAST}
 */


function getASTForIfApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst) {
  var test;

  switch (apply.$$[0]['#name']) {
    case 'Constant':
      {
        test = getASTForConstant(apply.$$[0]);
        break;
      }

    case 'FieldRef':
      {
        test = getASTForFieldRef(apply.$$[0], wrapFieldRefInMemberExpressionAst);
        break;
      }

    case 'Apply':
      {
        test = getASTForApply(apply.$$[0], userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
        break;
      }

    default:
      {
        throw new Error("Unhandles node type ".concat(apply.$$[0]['#name']));
      }
  }

  var consequent;

  switch (apply.$$[1]['#name']) {
    case 'Constant':
      {
        consequent = getASTForConstant(apply.$$[1]);
        break;
      }

    case 'FieldRef':
      {
        consequent = getASTForFieldRef(apply.$$[1], wrapFieldRefInMemberExpressionAst);
        break;
      }

    case 'Apply':
      {
        consequent = getASTForApply(apply.$$[1], userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
        break;
      }

    default:
      {
        throw new Error("Unhandles node type ".concat(apply.$$[1]['#name']));
      }
  }

  var alternate;

  switch (apply.$$[2]['#name']) {
    case 'Constant':
      {
        alternate = getASTForConstant(apply.$$[2]);
        break;
      }

    case 'FieldRef':
      {
        alternate = getASTForFieldRef(apply.$$[2], wrapFieldRefInMemberExpressionAst);
        break;
      }

    case 'Apply':
      {
        alternate = getASTForApply(apply.$$[2], userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
        break;
      }

    default:
      {
        throw new Error("Unhandled node type ".concat(apply.$$[2]['#name']));
      }
  }

  return (0, _ast.getConditionalExpressionAST)(test, consequent, alternate);
} //These are functions which we have implemented ourselves


var SpecialFunctions = Object.keys(_pmmlFunctions.default);
/**
 * Maps a PMML apply node whose function string is set to one in the above SpecialFunctions object to a CallExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {CallExpressionAST}
 */

function getASTForCallExpressionApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst) {
  var isInUserFunction = !wrapFieldRefInMemberExpressionAst; //We make the function call look like func[apply.$.function] so that we can dynamically make the functions available at runtime

  return (0, _ast.getCallExpressionAST)((0, _ast.getMemberExpressionAST)((0, _ast.getLiteralAST)(apply.$.function), 'func'), //Go through all the function arguments
  apply.$$ ? apply.$$.map(function (apply) {
    switch (apply['#name']) {
      case 'Constant':
        {
          return getASTForConstant(apply);
        }

      case 'FieldRef':
        {
          return getASTForFieldRef(apply, wrapFieldRefInMemberExpressionAst);
        }

      case 'Apply':
        {
          return getASTForApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
        }

      case 'MapValues':
        {
          return getAstForMapValues(apply, isInUserFunction);
        }

      default:
        {
          throw new Error("Unhandled node type ".concat(apply['#name']));
        }
    }
  }) : []);
}
/**
 * Maps a PMML apply node whose function string is set to one in the above SpecialFunctions object to a CallExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {CallExpressionAST}
 */


function getASTForUserDefinedFunctionApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst) {
  var additionalFunctionPassedInArgs = ['userFunctions', 'func', 'tables']; //We make the function call look like func[apply.$.function] so that we can dynamically make the functions available at runtime

  return (0, _ast.getCallExpressionAST)((0, _ast.getMemberExpressionAST)((0, _ast.getLiteralAST)(apply.$.function), 'userFunctions'), //Go through all the function arguments
  (apply.$$ ? apply.$$.map(function (apply) {
    switch (apply['#name']) {
      case 'Constant':
        {
          return getASTForConstant(apply);
        }

      case 'FieldRef':
        {
          return getASTForFieldRef(apply, wrapFieldRefInMemberExpressionAst);
        }

      case 'Apply':
        {
          return getASTForApply(apply, userDefinedFunctionNames, wrapFieldRefInMemberExpressionAst);
        }

      case 'MapValues':
        {
          return getAstForMapValues(apply, true);
        }

      default:
        {
          throw new Error("Unhandled node type ".concat(apply['#name']));
        }
    }
  }) : []).concat(additionalFunctionPassedInArgs.map(function (functionArg) {
    return (0, _ast.getIdentifierAST)(functionArg);
  })));
} // isInUserFunction: Whether this MapValues node is inside a DefineFunction node


function getPropertyAstFromFieldColumnPair(fieldColumnPair, isInDefineFunction) {
  return (0, _ast.getPropertyAst)(fieldColumnPair.$.column, fieldColumnPair.$.field ? isInDefineFunction === false ? (0, _ast.getMemberExpressionAST)((0, _ast.getLiteralAST)(fieldColumnPair.$.field), 'obj') : // If within a DefineFunction node then the fields come from
  // the function args and not from the obj object
  (0, _ast.getIdentifierAST)(fieldColumnPair.$.field) : (0, _ast.getLiteralAST)(fieldColumnPair.$.constant));
} // isInUserFunction: Whether this MapValues node is inside a DefineFunction node


function getAstForMapValues(mapValues, isInDefineFunction) {
  var fieldColumnPairs = mapValues.FieldColumnPair instanceof Array ? mapValues.FieldColumnPair : [mapValues.FieldColumnPair];
  return (0, _ast.getCallExpressionAST)((0, _ast.getMemberExpressionAST)((0, _ast.getLiteralAST)('getValueFromTable'), 'func'), [(0, _ast.getMemberExpressionAST)((0, _ast.getLiteralAST)(mapValues.TableLocator.$.name), 'tables'), (0, _ast.getLiteralAST)(mapValues.$.outputColumn), (0, _ast.getObjectExpressionAst)(fieldColumnPairs.map(function (fieldColumnPair) {
    return getPropertyAstFromFieldColumnPair(fieldColumnPair, isInDefineFunction);
  }))]);
}
//# sourceMappingURL=node_parser.js.map