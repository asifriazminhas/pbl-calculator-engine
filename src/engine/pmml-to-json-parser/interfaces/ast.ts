/**
 * Used for a token representing a number or a string
 * eg1. var a = 2 where 2 would be a LiteralAST
 * eg2. var a = 'test' where 'test' would be a LiteralAST
 *
 * @export
 * @interface LiteralAST
 */
export interface ILiteralAST {
    // name of the AST
    type: 'Literal';
    // The value the literal AST represents. eg1: Would be 2 eg2: Would be 'test'
    value: number | string | null;
    // The string value of the value. eg1: Would be '2' eg2: Would be "'2'"
    raw: string;
}

/**
 * Used to represent a variable name. eg. var a = 2. a would be represented by Identifier AST
 *
 * @export
 * @interface IdentifierAST
 */
export interface IIdentifierAST {
    // name if this AST
    type: 'Identifier';
    // name of the variable. eg: Would be "a"
    name: string;
}

export type BinaryExpressionASTLeftAndRight =
    | ILiteralAST
    | IIdentifierAST
    | ILogicalExpressionAST
    | IAssignmentExpressionAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST
    | IUnaryExpressionAST;
/**
 * Used to represent an operation involving two operands. eg. 2*3 is a binary
 * expression. && and || are exceptions (logical expressions ast)
 *
 * @export
 * @interface BinaryExpressionAST
 */
export interface IBinaryExpressionAST {
    type: 'BinaryExpression';
    operator: string;
    left: BinaryExpressionASTLeftAndRight;
    right: BinaryExpressionASTLeftAndRight;
}

export type LogicalExpressionASTLeftAndRight =
    | ILiteralAST
    | IIdentifierAST
    | ILogicalExpressionAST
    | IAssignmentExpressionAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST
    | IUnaryExpressionAST;
/**
 * Used to represent an operation in volving && or ||. eg. a&&b
 *
 * @export
 * @interface LogicalExpressionAST
 */
export interface ILogicalExpressionAST {
    type: 'LogicalExpression';
    operator: string;
    left: LogicalExpressionASTLeftAndRight;
    right: LogicalExpressionASTLeftAndRight;
}

export type UnaryExpressionASTArgument =
    | ILiteralAST
    | IIdentifierAST
    | ILogicalExpressionAST
    | IAssignmentExpressionAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST
    | IUnaryExpressionAST;
/**
 * Used to represent an operation involving a single operand. eg. ! or -
 *
 * @export
 * @interface UnaryExpressionAST
 */
export interface IUnaryExpressionAST {
    type: 'UnaryExpression';
    operator: string;
    argument: UnaryExpressionASTArgument;
}

export type AssignmentExpressionASTRight =
    | ILiteralAST
    | IIdentifierAST
    | IBinaryExpressionAST
    | ILogicalExpressionAST
    | IUnaryExpressionAST
    | IAssignmentExpressionAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST;
export type AssignmentExpressionASTLeft =
    | ILiteralAST
    | IIdentifierAST
    | IMemberExpressionAST;
/**
 * Used to represent assignment. eg a=b
 *
 * @export
 * @interface AssignmentExpressionAST
 */
export interface IAssignmentExpressionAST {
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
export interface IExpressionStatementAST {
    type: 'ExpressionStatement';
    expression:
        | ILiteralAST
        | IIdentifierAST
        | IBinaryExpressionAST
        | ILogicalExpressionAST
        | IUnaryExpressionAST
        | IAssignmentExpressionAST
        | IIfStatementAST
        | IMemberExpressionAST
        | ICallExpressionAST
        | IConditionalExpressionAST;
}

export type IfStatementASTTest =
    | ILiteralAST
    | IIdentifierAST
    | IBinaryExpressionAST
    | ILogicalExpressionAST
    | IUnaryExpressionAST
    | IAssignmentExpressionAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST;
export type IfStatementASTAlternate = IIfStatementAST | IExpressionStatementAST;
/**
 * If statement
 *
 * @export
 * @interface IfStatementAST
 */
export interface IIfStatementAST {
    type: 'IfStatement';
    // The first test
    test: IfStatementASTTest;
    // if the test passes then this run
    consequent: IExpressionStatementAST;
    // if the test fails then this is run
    alternate: IfStatementASTAlternate;
}

export type MemberExpressionPropertyAST =
    | ILiteralAST
    | IIdentifierAST
    | IBinaryExpressionAST
    | ILogicalExpressionAST
    | IUnaryExpressionAST
    | IAssignmentExpressionAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST;
/**
 * Used when accessing array or object property using square brackets. eg. a[2] or a['2']
 *
 * @export
 * @interface MemberExpressionAST
 */
export interface IMemberExpressionAST {
    type: 'MemberExpression';
    computed: true;
    object: {
        type: 'Identifier';
        name: string;
    };
    property: MemberExpressionPropertyAST;
}

export type CallExpressionArgumentAST =
    | ILiteralAST
    | IIdentifierAST
    | IBinaryExpressionAST
    | ILogicalExpressionAST
    | IUnaryExpressionAST
    | IAssignmentExpressionAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST
    | IObjectExpressionAst;
/**
 * Used when calling a function eg. test()
 *
 * @export
 * @interface CallExpressionAST
 */
export interface ICallExpressionAST {
    type: 'CallExpression';
    // Hardcode since it will always be calles as obj['a']()
    callee: IMemberExpressionAST | IIdentifierAST;
    arguments: CallExpressionArgumentAST[];
}

export type ConditionalExpressionTestAST =
    | ILiteralAST
    | IIdentifierAST
    | IBinaryExpressionAST
    | ILogicalExpressionAST
    | IUnaryExpressionAST
    | IAssignmentExpressionAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST;
export type ConditionalExpressionConsequentAST =
    | ILiteralAST
    | IIdentifierAST
    | IBinaryExpressionAST
    | ILogicalExpressionAST
    | IUnaryExpressionAST
    | IAssignmentExpressionAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST;
export type ConditionalExpressionAlternateAST =
    | ILiteralAST
    | IIdentifierAST
    | IBinaryExpressionAST
    | ILogicalExpressionAST
    | IUnaryExpressionAST
    | IAssignmentExpressionAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST;
/**
 * AST for ternary if statements. eg a === 2 ? 1 : 3
 *
 * @export
 * @interface ConditionalExpressionAST
 */
export interface IConditionalExpressionAST {
    type: 'ConditionalExpression';
    test: ConditionalExpressionTestAST;
    consequent: ConditionalExpressionConsequentAST;
    alternate: ConditionalExpressionAlternateAST;
}

export interface IExpressionStatementAst {
    type: 'ExpressionStatement';
    expression: AST;
}

export interface IBlockStatementAst {
    type: 'BlockStatement';
    body: IReturnStatementAst[];
}

export interface IReturnStatementAst {
    type: 'ReturnStatement';
    argument: AST;
}

export interface IFunctionExpressionAst {
    type: 'FunctionExpression';
    params: IIdentifierAST[];
    body: IBlockStatementAst;
}

export interface IPropertyAst {
    type: 'Property';
    method: false;
    shorthand: false;
    computed: false;
    kind: 'init';
    key: ILiteralAST;
    value: ILiteralAST | IMemberExpressionAST;
}

export interface IObjectExpressionAst {
    type: 'ObjectExpression';
    properties: IPropertyAst[];
}

export type AST =
    | ILiteralAST
    | IIdentifierAST
    | IBinaryExpressionAST
    | ILogicalExpressionAST
    | IUnaryExpressionAST
    | IAssignmentExpressionAST
    | IExpressionStatementAST
    | IIfStatementAST
    | IMemberExpressionAST
    | ICallExpressionAST
    | IConditionalExpressionAST
    | IExpressionStatementAst
    | IObjectExpressionAst;
