//interfaces
import {
    LiteralAST,
    IdentifierAST,
    BinaryExpressionASTLeftAndRight,
    BinaryExpressionAST,
    LogicalExpressionASTLeftAndRight,
    LogicalExpressionAST,
    UnaryExpressionASTArgument,
    UnaryExpressionAST,
    AssignmentExpressionAST,
    AssignmentExpressionASTRight,
    ExpressionStatementAST,
    MemberExpressionAST,
    CallExpressionAST,
    ConditionalExpressionAST,
    AST
} from '../interfaces/ast'

export function getLiteralAST(value: number | string): LiteralAST {
    return {
        type: 'Literal',
        value: value,
        raw: String(value)
    }
}

export function getIdentifierAST(name: string): IdentifierAST {
    return {
        type: 'Identifier',
        name
    }
}

export function getBinaryExpressionAST(operator: string, left: BinaryExpressionASTLeftAndRight, right: BinaryExpressionASTLeftAndRight): BinaryExpressionAST {
    return {
        type: 'BinaryExpression',
        operator,
        left,
        right
    }
}

export function getLogicalExpressionAST(operator: string, left: LogicalExpressionASTLeftAndRight, right: LogicalExpressionASTLeftAndRight): LogicalExpressionAST {
    return {
        type: 'LogicalExpression',
        operator,
        left,
        right
    }
}

export function getUnaryExpressionAST(operator: string, argument: UnaryExpressionASTArgument): UnaryExpressionAST {
    return {
        type: 'UnaryExpression',
        operator,
        argument
    }
}

export function getAssignmentExpressionAST(operator: string, left: IdentifierAST, right: AssignmentExpressionASTRight): AssignmentExpressionAST {
    return {
        type: 'AssignmentExpression',
        operator,
        left,
        right
    }
}

export function getExpressionStatementAST(expression: AssignmentExpressionAST): ExpressionStatementAST {
    return {
        type: 'ExpressionStatement',
        expression
    }
}

export function getMemberExpressionAST(property: LiteralAST, objName: string): MemberExpressionAST {
    return {
        type: 'MemberExpression',
        computed: true,
        object: {
            type: 'Identifier',
            name: objName
        },
        property
    }
}


export function getCallExpressionAST(callee: MemberExpressionAST, args: Array<AST>): CallExpressionAST {
    return {
        type: 'CallExpression',
        callee,
        arguments: args
    }
}

export function getConditionalExpressionAST(test: AST, consequent: AST, alternate: AST): ConditionalExpressionAST {
    return {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate
    }
}


