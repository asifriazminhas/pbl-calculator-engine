import { LiteralAST, IdentifierAST, BinaryExpressionASTLeftAndRight, BinaryExpressionAST, LogicalExpressionASTLeftAndRight, LogicalExpressionAST, UnaryExpressionASTArgument, UnaryExpressionAST, AssignmentExpressionAST, AssignmentExpressionASTRight, ExpressionStatementAST, MemberExpressionAST, CallExpressionAST, ConditionalExpressionAST, CallExpressionArgumentAST, ConditionalExpressionTestAST, ConditionalExpressionAlternateAST, ConditionalExpressionConsequentAST } from '../../interfaces/ast';
/**
 *
 *
 * @export
 * @param {(number | string)} value
 * @returns {LiteralAST}
 */
export declare function getLiteralAST(value: number | string): LiteralAST;
/**
 *
 *
 * @export
 * @param {string} name
 * @returns {IdentifierAST}
 */
export declare function getIdentifierAST(name: string): IdentifierAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {BinaryExpressionASTLeftAndRight} left
 * @param {BinaryExpressionASTLeftAndRight} right
 * @returns {BinaryExpressionAST}
 */
export declare function getBinaryExpressionAST(operator: string, left: BinaryExpressionASTLeftAndRight, right: BinaryExpressionASTLeftAndRight): BinaryExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {LogicalExpressionASTLeftAndRight} left
 * @param {LogicalExpressionASTLeftAndRight} right
 * @returns {LogicalExpressionAST}
 */
export declare function getLogicalExpressionAST(operator: string, left: LogicalExpressionASTLeftAndRight, right: LogicalExpressionASTLeftAndRight): LogicalExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {UnaryExpressionASTArgument} argument
 * @returns {UnaryExpressionAST}
 */
export declare function getUnaryExpressionAST(operator: string, argument: UnaryExpressionASTArgument): UnaryExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {IdentifierAST} left
 * @param {AssignmentExpressionASTRight} right
 * @returns {AssignmentExpressionAST}
 */
export declare function getAssignmentExpressionAST(operator: string, left: IdentifierAST, right: AssignmentExpressionASTRight): AssignmentExpressionAST;
/**
 *
 *
 * @export
 * @param {AssignmentExpressionAST} expression
 * @returns {ExpressionStatementAST}
 */
export declare function getExpressionStatementAST(expression: AssignmentExpressionAST): ExpressionStatementAST;
/**
 *
 *
 * @export
 * @param {LiteralAST} property
 * @param {string} objName
 * @returns {MemberExpressionAST}
 */
export declare function getMemberExpressionAST(property: LiteralAST, objName: string): MemberExpressionAST;
/**
 *
 *
 * @export
 * @param {MemberExpressionAST} callee
 * @param {Array<CallExpressionArgumentAST>} args
 * @returns {CallExpressionAST}
 */
export declare function getCallExpressionAST(callee: MemberExpressionAST, args: Array<CallExpressionArgumentAST>): CallExpressionAST;
/**
 *
 *
 * @export
 * @param {ConditionalExpressionTestAST} test
 * @param {ConditionalExpressionConsequentAST} consequent
 * @param {ConditionalExpressionAlternateAST} alternate
 * @returns {ConditionalExpressionAST}
 */
export declare function getConditionalExpressionAST(test: ConditionalExpressionTestAST, consequent: ConditionalExpressionConsequentAST, alternate: ConditionalExpressionAlternateAST): ConditionalExpressionAST;
