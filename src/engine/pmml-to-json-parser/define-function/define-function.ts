import { DefineFunction } from '../../pmml/local_transformations/define-function';
import { getASTForApply, getASTForConstant, getASTForFieldRef } from '../data_fields/derived_field/node_parser';
import { getReturnStatementAst, getFunctionExpressionAst } from '../data_fields/derived_field/ast';
import { generate } from 'escodegen';

export function parseDefineFunction(
    defineFunction: DefineFunction,
    allDefineFunctionNames: Array<string>
): {
    [index: string]: string
 } {
    //Get the name of the function from the name field
    const functionName = defineFunction.$.name;

    //get the names of all the arguments to this function. They are ordered in the way they appear in the Parameters array
    const argumentNames = defineFunction
        .ParameterField
        .map(parameterField => parameterField.$.name);

    //Get Ast for the body of the function depending on whether there's an Apply, Constant or FieldRef node
    const functionBodyAst = (
        defineFunction.Apply
    ) ? getASTForApply(defineFunction.Apply, allDefineFunctionNames) : (
        defineFunction.Constant
    ) ? getASTForConstant(defineFunction.Constant) : (
        defineFunction.FieldRef
    ) ? getASTForFieldRef(defineFunction.FieldRef) : null;
    if(!functionBodyAst) {
        throw new Error(`No ast parsed for function body`)
    }

    //Make a Return Statement ast whose argument field is the expression ast made above
    const returnStatementAst = getReturnStatementAst(
        functionBodyAst
    );

    //Make the function expression Ast using the idenfier ast object array for the arguments and the return statement ast as part of the body array
    const functionExpressionAst = getFunctionExpressionAst(
        argumentNames,
        returnStatementAst
    );

    //Convert the function expression ast to it's javascript string
    const functionBodyJsString = generate(functionExpressionAst);

    //Create a string 'userFunctions["functionName"] = function javascriipt string created above'. This will be evaluated in the browser and user to populate an object var called userFunctions with all the functions
    const codeString = `
        userFunctions[${functionName}] = ${functionBodyJsString}
    `;

    //Return an object with one field named the same as the function name and set to the code string
    return {
        [functionName]: codeString
    };
}