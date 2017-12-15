import { IApply, IFieldRef, IConstant } from '../../../pmml/local_transformations/common';
import { ILiteralAST, IBinaryExpressionAST, ILogicalExpressionAST, IUnaryExpressionAST, IMemberExpressionAST, IConditionalExpressionAST, ICallExpressionAST, IIdentifierAST } from '../../interfaces/ast';
import { IMapValues } from '../../../pmml/local_transformations/derived_field';
/**
 * Converts a Constant node either into a UnaryExpressionAST (since some of the constants can be negative numbers) or LiteralAST
 *
 * @export
 * @param {Constant} constant
 * @returns {(IUnaryExpressionAST | ILiteralAST)}
 */
export declare function getASTForConstant(constant: IConstant): IUnaryExpressionAST | ILiteralAST;
/**
 * Parses a FieldRef node
 *
 * @export
 * @param {FieldRef} fieldRef
 * @returns {IMemberExpressionAST}
 */
export declare function getASTForFieldRef(fieldRef: IFieldRef, wrapInMemberExpressionAst: boolean): IMemberExpressionAST | IIdentifierAST;
export declare type GetAstForApplyReturn = IBinaryExpressionAST | ILogicalExpressionAST | IConditionalExpressionAST | ICallExpressionAST;
/**
 * Returns AST for an Apply node
 *
 * @export
 * @param {Apply} apply
 * @returns {AST}
 */
export declare function getASTForApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): GetAstForApplyReturn;
/**
 * Maps an Apply node whose function is a binary expression operand to a BinaryExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {IBinaryExpressionAST}
 */
export declare function getASTForBinaryExpressionApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): IBinaryExpressionAST;
/**
 * Maps an Apply whose function string is one of the above LogicalExpressionOperators to a LogicalExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {ILogicalExpressionAST}
 */
export declare function getASTForLogicalExpressionApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): ILogicalExpressionAST;
/**
 * Maps an Apply node whose function is an if to a ConditionalExpressionAST. Do this rather than an IfStatement because it's more concise
 *
 * @export
 * @param {Apply} apply
 * @returns {IConditionalExpressionAST}
 */
export declare function getASTForIfApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): IConditionalExpressionAST;
/**
 * Maps a PMML apply node whose function string is set to one in the above SpecialFunctions object to a CallExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {CallExpressionAST}
 */
export declare function getASTForCallExpressionApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): ICallExpressionAST;
/**
 * Maps a PMML apply node whose function string is set to one in the above SpecialFunctions object to a CallExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {CallExpressionAST}
 */
export declare function getASTForUserDefinedFunctionApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): ICallExpressionAST;
export declare function getAstForMapValues(mapValues: IMapValues): ICallExpressionAST;
