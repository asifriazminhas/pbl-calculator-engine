"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDefineFunction = parseDefineFunction;

var _node_parser = require("../data_fields/derived_field/node_parser");

var _ast = require("../data_fields/derived_field/ast");

var _escodegen = require("escodegen");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function parseDefineFunction(defineFunction, allDefineFunctionNames) {
  //Get the name of the function from the name field
  var functionName = defineFunction.$.name; //Arguments to the function are:
  //The original arguments
  //userFunctions - Object with user defined functions
  //funcs - Object with pmml functions

  var argumentNames = (defineFunction.ParameterField instanceof Array ? defineFunction.ParameterField.map(function (parameterField) {
    return parameterField.$.name;
  }) : [defineFunction.ParameterField.$.name]).concat([//This order is importants
  'userFunctions', 'func', 'tables']); //Get Ast for the body of the function depending on whether there's an Apply, Constant or FieldRef node

  var functionBodyAst = defineFunction.Apply ? (0, _node_parser.getASTForApply)(defineFunction.Apply, allDefineFunctionNames, false) : defineFunction.Constant ? (0, _node_parser.getASTForConstant)(defineFunction.Constant) : defineFunction.FieldRef ? (0, _node_parser.getASTForFieldRef)(defineFunction.FieldRef, false) : null;

  if (!functionBodyAst) {
    throw new Error("No ast parsed for function body");
  } //Make a Return Statement ast whose argument field is the expression ast made above


  var returnStatementAst = (0, _ast.getReturnStatementAst)(functionBodyAst); //Make the function expression Ast using the idenfier ast object array for the arguments and the return statement ast as part of the body array

  var functionExpressionAst = (0, _ast.getFunctionExpressionAst)(argumentNames, returnStatementAst); //Convert the function expression ast to it's javascript string

  var functionBodyJsString = (0, _escodegen.generate)(functionExpressionAst); //Create a string 'userFunctions["functionName"] = function javascriipt string created above'. This will be evaluated in the browser and user to populate an object var called userFunctions with all the functions

  var codeString = "\n        userFunctions[\"".concat(functionName, "\"] = (").concat(functionBodyJsString, ")\n    "); //Return an object with one field named the same as the function name and set to the code string

  return _defineProperty({}, functionName, codeString);
}
//# sourceMappingURL=define-function.js.map