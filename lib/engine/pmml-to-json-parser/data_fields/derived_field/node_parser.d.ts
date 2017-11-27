import { IApply, IFieldRef, IConstant } from '../../../pmml/local_transformations/common';
import { LiteralAST, BinaryExpressionAST, LogicalExpressionAST, UnaryExpressionAST, MemberExpressionAST, ConditionalExpressionAST, CallExpressionAST, IdentifierAST } from '../../interfaces/ast';
/**
 * Converts a Constant node either into a UnaryExpressionAST (since some of the constants can be negative numbers) or LiteralAST
 *
 * @export
 * @param {Constant} constant
 * @returns {(UnaryExpressionAST | LiteralAST)}
 */
export declare function getASTForConstant(constant: IConstant): UnaryExpressionAST | LiteralAST;
/**
 * Parses a FieldRef node
 *
 * @export
 * @param {FieldRef} fieldRef
 * @returns {MemberExpressionAST}
 */
export declare function getASTForFieldRef(fieldRef: IFieldRef, wrapInMemberExpressionAst: boolean): MemberExpressionAST | IdentifierAST;
export declare type GetAstForApplyReturn = BinaryExpressionAST | LogicalExpressionAST | ConditionalExpressionAST | CallExpressionAST;
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
 * @returns {BinaryExpressionAST}
 */
export declare function getASTForBinaryExpressionApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): BinaryExpressionAST;
/**
 * Maps an Apply whose function string is one of the above LogicalExpressionOperators to a LogicalExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {LogicalExpressionAST}
 */
export declare function getASTForLogicalExpressionApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): LogicalExpressionAST;
/**
 * Maps an Apply node whose function is an if to a ConditionalExpressionAST. Do this rather than an IfStatement because it's more concise
 *
 * @export
 * @param {Apply} apply
 * @returns {ConditionalExpressionAST}
 */
export declare function getASTForIfApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): ConditionalExpressionAST;
/**
 * Maps a PMML apply node whose function string is set to one in the above SpecialFunctions object to a CallExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {CallExpressionAST}
 */
export declare function getASTForCallExpressionApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): CallExpressionAST;
/**
 * Maps a PMML apply node whose function string is set to one in the above SpecialFunctions object to a CallExpressionAST
 *
 * @export
 * @param {Apply} apply
 * @returns {CallExpressionAST}
 */
export declare function getASTForUserDefinedFunctionApply(apply: IApply, userDefinedFunctionNames: Array<string>, wrapFieldRefInMemberExpressionAst: boolean): CallExpressionAST;
