import { ILiteralAST, IIdentifierAST, BinaryExpressionASTLeftAndRight, IBinaryExpressionAST, LogicalExpressionASTLeftAndRight, ILogicalExpressionAST, UnaryExpressionASTArgument, IUnaryExpressionAST, IAssignmentExpressionAST, AssignmentExpressionASTRight, IExpressionStatementAST, IMemberExpressionAST, ICallExpressionAST, IConditionalExpressionAST, CallExpressionArgumentAST, ConditionalExpressionTestAST, ConditionalExpressionAlternateAST, ConditionalExpressionConsequentAST, IFunctionExpressionAst, IReturnStatementAst, IObjectExpressionAst, AST, IPropertyAst } from '../../interfaces/ast';
/**
 *
 *
 * @export
 * @param {(number | string)} value
 * @returns {LiteralAST}
 */
export declare function getLiteralAST(value: number | string | boolean | null): ILiteralAST;
/**
 *
 *
 * @export
 * @param {string} name
 * @returns {IIdentifierAST}
 */
export declare function getIdentifierAST(name: string): IIdentifierAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {BinaryExpressionASTLeftAndRight} left
 * @param {BinaryExpressionASTLeftAndRight} right
 * @returns {IBinaryExpressionAST}
 */
export declare function getBinaryExpressionAST(operator: string, left: BinaryExpressionASTLeftAndRight, right: BinaryExpressionASTLeftAndRight): IBinaryExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {LogicalExpressionASTLeftAndRight} left
 * @param {LogicalExpressionASTLeftAndRight} right
 * @returns {ILogicalExpressionAST}
 */
export declare function getLogicalExpressionAST(operator: string, left: LogicalExpressionASTLeftAndRight, right: LogicalExpressionASTLeftAndRight): ILogicalExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {UnaryExpressionASTArgument} argument
 * @returns {IUnaryExpressionAST}
 */
export declare function getUnaryExpressionAST(operator: string, argument: UnaryExpressionASTArgument): IUnaryExpressionAST;
/**
 *
 *
 * @export
 * @param {string} operator
 * @param {IIdentifierAST} left
 * @param {AssignmentExpressionASTRight} right
 * @returns {IAssignmentExpressionAST}
 */
export declare function getAssignmentExpressionAST(operator: string, left: IIdentifierAST, right: AssignmentExpressionASTRight): IAssignmentExpressionAST;
/**
 *
 *
 * @export
 * @param {IAssignmentExpressionAST} expression
 * @returns {IExpressionStatementAST}
 */
export declare function getExpressionStatementAST(expression: IAssignmentExpressionAST): IExpressionStatementAST;
/**
 *
 *
 * @export
 * @param {ILiteralAST} property
 * @param {string} objName
 * @returns {IMemberExpressionAST}
 */
export declare function getMemberExpressionAST(property: ILiteralAST, objName: string): IMemberExpressionAST;
/**
 *
 *
 * @export
 * @param {IMemberExpressionAST} callee
 * @param {Array<CallExpressionArgumentAST>} args
 * @returns {ICallExpressionAST}
 */
export declare function getCallExpressionAST(callee: IMemberExpressionAST | IIdentifierAST, args: Array<CallExpressionArgumentAST>): ICallExpressionAST;
/**
 *
 *
 * @export
 * @param {ConditionalExpressionTestAST} test
 * @param {ConditionalExpressionConsequentAST} consequent
 * @param {ConditionalExpressionAlternateAST} alternate
 * @returns {IConditionalExpressionAST}
 */
export declare function getConditionalExpressionAST(test: ConditionalExpressionTestAST, consequent: ConditionalExpressionConsequentAST, alternate: ConditionalExpressionAlternateAST): IConditionalExpressionAST;
export declare function getFunctionExpressionAst(params: Array<string>, returnStatementAst: IReturnStatementAst): IFunctionExpressionAst;
export declare function getReturnStatementAst(argument: AST): IReturnStatementAst;
export declare function getObjectExpressionAst(properties: IPropertyAst[]): IObjectExpressionAst;
export declare function getPropertyAst(key: string, value: ILiteralAST | IMemberExpressionAST | IIdentifierAST): IPropertyAst;
