/**
 * Used for a token representing a number or a string
 * eg1. var a = 2 where 2 would be a LiteralAST
 * eg2. var a = 'test' where 'test' would be a LiteralAST
 *
 * @export
 * @interface LiteralAST
 */
export interface LiteralAST {
    type: 'Literal';
    value: number | string | null;
    raw: string;
}
/**
 * Used to represent a variable name. eg. var a = 2. a would be represented by Identifier AST
 *
 * @export
 * @interface IdentifierAST
 */
export interface IdentifierAST {
    type: 'Identifier';
    name: string;
}
export declare type BinaryExpressionASTLeftAndRight = LiteralAST | IdentifierAST | LogicalExpressionAST | AssignmentExpressionAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST | UnaryExpressionAST;
/**
 * Used to represent an operation involving two operands. eg. 2*3 is a binary expression. && and || are exceptions (logical expressions ast)
 *
 * @export
 * @interface BinaryExpressionAST
 */
export interface BinaryExpressionAST {
    type: 'BinaryExpression';
    operator: string;
    left: BinaryExpressionASTLeftAndRight;
    right: BinaryExpressionASTLeftAndRight;
}
export declare type LogicalExpressionASTLeftAndRight = LiteralAST | IdentifierAST | LogicalExpressionAST | AssignmentExpressionAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST | UnaryExpressionAST;
/**
 * Used to represent an operation in volving && or ||. eg. a&&b
 *
 * @export
 * @interface LogicalExpressionAST
 */
export interface LogicalExpressionAST {
    type: 'LogicalExpression';
    operator: string;
    left: LogicalExpressionASTLeftAndRight;
    right: LogicalExpressionASTLeftAndRight;
}
export declare type UnaryExpressionASTArgument = LiteralAST | IdentifierAST | LogicalExpressionAST | AssignmentExpressionAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST | UnaryExpressionAST;
/**
 * Used to represent an operation involving a single operand. eg. ! or -
 *
 * @export
 * @interface UnaryExpressionAST
 */
export interface UnaryExpressionAST {
    type: 'UnaryExpression';
    operator: string;
    argument: UnaryExpressionASTArgument;
}
export declare type AssignmentExpressionASTRight = LiteralAST | IdentifierAST | BinaryExpressionAST | LogicalExpressionAST | UnaryExpressionAST | AssignmentExpressionAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST;
export declare type AssignmentExpressionASTLeft = LiteralAST | IdentifierAST | MemberExpressionAST;
/**
 * Used to represent assignment. eg a=b
 *
 * @export
 * @interface AssignmentExpressionAST
 */
export interface AssignmentExpressionAST {
    type: 'AssignmentExpression';
    operator: string;
    left: AssignmentExpressionASTLeft;
    right: AssignmentExpressionASTRight;
}
/**
 * Represents a javascript expression.
 *
 * @export
 * @interface ExpressionStatementAST
 */
export interface ExpressionStatementAST {
    type: 'ExpressionStatement';
    expression: LiteralAST | IdentifierAST | BinaryExpressionAST | LogicalExpressionAST | UnaryExpressionAST | AssignmentExpressionAST | IfStatementAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST;
}
export declare type IfStatementASTTest = LiteralAST | IdentifierAST | BinaryExpressionAST | LogicalExpressionAST | UnaryExpressionAST | AssignmentExpressionAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST;
export declare type IfStatementASTAlternate = IfStatementAST | ExpressionStatementAST;
/**
 * If statement
 *
 * @export
 * @interface IfStatementAST
 */
export interface IfStatementAST {
    type: 'IfStatement';
    test: IfStatementASTTest;
    consequent: ExpressionStatementAST;
    alternate: IfStatementASTAlternate;
}
export declare type MemberExpressionPropertyAST = LiteralAST | IdentifierAST | BinaryExpressionAST | LogicalExpressionAST | UnaryExpressionAST | AssignmentExpressionAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST;
/**
 * Used when accessing array or object property using square brackets. eg. a[2] or a['2']
 *
 * @export
 * @interface MemberExpressionAST
 */
export interface MemberExpressionAST {
    type: 'MemberExpression';
    computed: true;
    object: {
        type: 'Identifier';
        name: string;
    };
    property: MemberExpressionPropertyAST;
}
export declare type CallExpressionArgumentAST = LiteralAST | IdentifierAST | BinaryExpressionAST | LogicalExpressionAST | UnaryExpressionAST | AssignmentExpressionAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST;
/**
 * Used when calling a function eg. test()
 *
 * @export
 * @interface CallExpressionAST
 */
export interface CallExpressionAST {
    type: 'CallExpression';
    callee: MemberExpressionAST;
    arguments: Array<CallExpressionArgumentAST>;
}
export declare type ConditionalExpressionTestAST = LiteralAST | IdentifierAST | BinaryExpressionAST | LogicalExpressionAST | UnaryExpressionAST | AssignmentExpressionAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST;
export declare type ConditionalExpressionConsequentAST = LiteralAST | IdentifierAST | BinaryExpressionAST | LogicalExpressionAST | UnaryExpressionAST | AssignmentExpressionAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST;
export declare type ConditionalExpressionAlternateAST = LiteralAST | IdentifierAST | BinaryExpressionAST | LogicalExpressionAST | UnaryExpressionAST | AssignmentExpressionAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST;
/**
 * AST for ternary if statements. eg a === 2 ? 1 : 3
 *
 * @export
 * @interface ConditionalExpressionAST
 */
export interface ConditionalExpressionAST {
    type: 'ConditionalExpression';
    test: ConditionalExpressionTestAST;
    consequent: ConditionalExpressionConsequentAST;
    alternate: ConditionalExpressionAlternateAST;
}
export interface ExpressionStatementAst {
    type: 'ExpressionStatement';
    expression: AST;
}
export interface BlockStatementAst {
    type: 'BlockStatement';
    body: Array<ReturnStatementAst>;
}
export interface ReturnStatementAst {
    type: 'ReturnStatement';
    argument: AST;
}
export interface FunctionExpressionAst {
    type: 'FunctionExpression';
    params: Array<IdentifierAST>;
    body: BlockStatementAst;
}
export declare type AST = LiteralAST | IdentifierAST | BinaryExpressionAST | LogicalExpressionAST | UnaryExpressionAST | AssignmentExpressionAST | ExpressionStatementAST | IfStatementAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST | ExpressionStatementAst;
