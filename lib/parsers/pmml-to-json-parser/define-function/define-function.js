"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var node_parser_1 = require("../data_fields/derived_field/node_parser");

var ast_1 = require("../data_fields/derived_field/ast");

var escodegen_1 = require("escodegen");

function parseDefineFunction(defineFunction, allDefineFunctionNames) {
  //Get the name of the function from the name field
  var functionName = defineFunction.$.name; //Arguments to the function are:
  //The original arguments
  //userFunctions - Object with user defined functions
  //funcs - Object with pmml functions

  var argumentNames = (defineFunction.ParameterField instanceof Array ? defineFunction.ParameterField.map(function (parameterField) {
    return parameterField.$.name;
  }) : [defineFunction.ParameterField.$.name]).concat(['userFunctions', 'func']); //Get Ast for the body of the function depending on whether there's an Apply, Constant or FieldRef node

  var functionBodyAst = defineFunction.Apply ? node_parser_1.getASTForApply(defineFunction.Apply, allDefineFunctionNames, false) : defineFunction.Constant ? node_parser_1.getASTForConstant(defineFunction.Constant) : defineFunction.FieldRef ? node_parser_1.getASTForFieldRef(defineFunction.FieldRef, false) : null;

  if (!functionBodyAst) {
    throw new Error("No ast parsed for function body");
  } //Make a Return Statement ast whose argument field is the expression ast made above


  var returnStatementAst = ast_1.getReturnStatementAst(functionBodyAst); //Make the function expression Ast using the idenfier ast object array for the arguments and the return statement ast as part of the body array

  var functionExpressionAst = ast_1.getFunctionExpressionAst(argumentNames, returnStatementAst); //Convert the function expression ast to it's javascript string

  var functionBodyJsString = escodegen_1.generate(functionExpressionAst); //Create a string 'userFunctions["functionName"] = function javascriipt string created above'. This will be evaluated in the browser and user to populate an object var called userFunctions with all the functions

  var codeString = "\n        userFunctions[\"".concat(functionName, "\"] = (").concat(functionBodyJsString, ")\n    "); //Return an object with one field named the same as the function name and set to the code string

  return _defineProperty({}, functionName, codeString);
}

exports.parseDefineFunction = parseDefineFunction;
//# sourceMappingURL=define-function.js.map