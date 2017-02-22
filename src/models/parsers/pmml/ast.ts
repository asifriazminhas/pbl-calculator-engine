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
    CallExpressionArgumentAST,
    ConditionalExpressionTestAST,
    ConditionalExpressionAlternateAST,
    ConditionalExpressionConsequentAST
} from './interfaces/ast'

/**
 * 
 * 
 * @export
 * @param {(number | string)} value 
 * @returns {LiteralAST} 
 */
export function getLiteralAST(value: number | string): LiteralAST {
    return {
        type: 'Literal',
        value: value,
        raw: String(value)
    }
}

/**
 * 
 * 
 * @export
 * @param {string} name 
 * @returns {IdentifierAST} 
 */
export function getIdentifierAST(name: string): IdentifierAST {
    return {
        type: 'Identifier',
        name
    }
}

/**
 * 
 * 
 * @export
 * @param {string} operator 
 * @param {BinaryExpressionASTLeftAndRight} left 
 * @param {BinaryExpressionASTLeftAndRight} right 
 * @returns {BinaryExpressionAST} 
 */
export function getBinaryExpressionAST(operator: string, left: BinaryExpressionASTLeftAndRight, right: BinaryExpressionASTLeftAndRight): BinaryExpressionAST {
    return {
        type: 'BinaryExpression',
        operator,
        left,
        right
    }
}

/**
 * 
 * 
 * @export
 * @param {string} operator 
 * @param {LogicalExpressionASTLeftAndRight} left 
 * @param {LogicalExpressionASTLeftAndRight} right 
 * @returns {LogicalExpressionAST} 
 */
export function getLogicalExpressionAST(operator: string, left: LogicalExpressionASTLeftAndRight, right: LogicalExpressionASTLeftAndRight): LogicalExpressionAST {
    return {
        type: 'LogicalExpression',
        operator,
        left,
        right
    }
}

/**
 * 
 * 
 * @export
 * @param {string} operator 
 * @param {UnaryExpressionASTArgument} argument 
 * @returns {UnaryExpressionAST} 
 */
export function getUnaryExpressionAST(operator: string, argument: UnaryExpressionASTArgument): UnaryExpressionAST {
    return {
        type: 'UnaryExpression',
        operator,
        argument
    }
}

/**
 * 
 * 
 * @export
 * @param {string} operator 
 * @param {IdentifierAST} left 
 * @param {AssignmentExpressionASTRight} right 
 * @returns {AssignmentExpressionAST} 
 */
export function getAssignmentExpressionAST(operator: string, left: IdentifierAST, right: AssignmentExpressionASTRight): AssignmentExpressionAST {
    return {
        type: 'AssignmentExpression',
        operator,
        left,
        right
    }
}

/**
 * 
 * 
 * @export
 * @param {AssignmentExpressionAST} expression 
 * @returns {ExpressionStatementAST} 
 */
export function getExpressionStatementAST(expression: AssignmentExpressionAST): ExpressionStatementAST {
    return {
        type: 'ExpressionStatement',
        expression
    }
}

/**
 * 
 * 
 * @export
 * @param {LiteralAST} property 
 * @param {string} objName 
 * @returns {MemberExpressionAST} 
 */
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

/**
 * 
 * 
 * @export
 * @param {MemberExpressionAST} callee 
 * @param {Array<CallExpressionArgumentAST>} args 
 * @returns {CallExpressionAST} 
 */
export function getCallExpressionAST(callee: MemberExpressionAST, args: Array<CallExpressionArgumentAST>): CallExpressionAST {
    return {
        type: 'CallExpression',
        callee,
        arguments: args
    }
}

/**
 * 
 * 
 * @export
 * @param {ConditionalExpressionTestAST} test 
 * @param {ConditionalExpressionConsequentAST} consequent 
 * @param {ConditionalExpressionAlternateAST} alternate 
 * @returns {ConditionalExpressionAST} 
 */
export function getConditionalExpressionAST(test: ConditionalExpressionTestAST, consequent: ConditionalExpressionConsequentAST, alternate: ConditionalExpressionAlternateAST): ConditionalExpressionAST {
    return {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate
    }
}


