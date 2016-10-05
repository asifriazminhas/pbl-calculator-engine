export interface LiteralAST {
    type: 'Literal',
    value: number | string
    raw: string
}

export interface IdentifierAST {
    type: 'Identifier',
    name: string
}

export type BinaryExpressionASTLeftAndRight = AST
export interface BinaryExpressionAST {
    type: 'BinaryExpression',
    operator: string
    left: BinaryExpressionASTLeftAndRight
    right: BinaryExpressionASTLeftAndRight
}

export type LogicalExpressionASTLeftAndRight = AST
export interface LogicalExpressionAST {
    type: 'LogicalExpression'
    operator: string
    left: LogicalExpressionASTLeftAndRight
    right: LogicalExpressionASTLeftAndRight
}

export type UnaryExpressionASTArgument = BinaryExpressionAST | LiteralAST | IdentifierAST
export interface UnaryExpressionAST {
    type: 'UnaryExpression'
    operator: string
    argument: UnaryExpressionASTArgument
}

export type AssignmentExpressionASTRight = BinaryExpressionAST | LiteralAST | IdentifierAST
export interface AssignmentExpressionAST {
    type: 'AssignmentExpression'
    operator: string
    left: IdentifierAST,
    right: AssignmentExpressionASTRight
}

export interface ExpressionStatementAST {
    type: 'ExpressionStatement'
    expression: AssignmentExpressionAST
}

export type IfStatementASTTest = BinaryExpressionAST | LogicalExpressionAST
export type IfStatementASTAlternate = IfStatementAST | ExpressionStatementAST
export interface IfStatementAST {
    type: 'IfStatement'
    test: IfStatementASTTest
    consequent: ExpressionStatementAST
    alternate: IfStatementASTAlternate
}

export interface MemberExpressionAST {
    type: 'MemberExpression',
    computed: true,
    object: {
        type: 'Identifier',
        name: string
    },
    property: LiteralAST
}

export interface CallExpressionAST {
    type: 'CallExpression'
    callee: MemberExpressionAST
    arguments: Array<AST>
}

export interface ConditionalExpressionAST {
    type: 'ConditionalExpression'
    test: AST
    consequent: AST
    alternate: AST
}

export type AST = LiteralAST | IdentifierAST | BinaryExpressionAST | LogicalExpressionAST | UnaryExpressionAST | AssignmentExpressionAST | ExpressionStatementAST | IfStatementAST | MemberExpressionAST | CallExpressionAST | ConditionalExpressionAST