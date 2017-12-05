//interfaces
import {
    ILiteralAST,
    IIdentifierAST,
    BinaryExpressionASTLeftAndRight,
    IBinaryExpressionAST,
    LogicalExpressionASTLeftAndRight,
    ILogicalExpressionAST,
    UnaryExpressionASTArgument,
    IUnaryExpressionAST,
    IAssignmentExpressionAST,
    AssignmentExpressionASTRight,
    IExpressionStatementAST,
    IMemberExpressionAST,
    ICallExpressionAST,
    IConditionalExpressionAST,
    CallExpressionArgumentAST,
    ConditionalExpressionTestAST,
    ConditionalExpressionAlternateAST,
    ConditionalExpressionConsequentAST,
    IFunctionExpressionAst,
    IReturnStatementAst,
    IObjectExpressionAst,
    AST,
    IPropertyAst,
} from '../../interfaces/ast';

/**
 * 
 * 
 * @export
 * @param {(number | string)} value 
 * @returns {LiteralAST} 
 */
export function getLiteralAST(value: number | string | null): ILiteralAST {
    return {
        type: 'Literal',
        value: value,
        raw: String(value),
    };
}

/**
 * 
 * 
 * @export
 * @param {string} name 
 * @returns {IIdentifierAST} 
 */
export function getIdentifierAST(name: string): IIdentifierAST {
    return {
        type: 'Identifier',
        name,
    };
}

/**
 * 
 * 
 * @export
 * @param {string} operator 
 * @param {BinaryExpressionASTLeftAndRight} left 
 * @param {BinaryExpressionASTLeftAndRight} right 
 * @returns {IBinaryExpressionAST} 
 */
export function getBinaryExpressionAST(
    operator: string,
    left: BinaryExpressionASTLeftAndRight,
    right: BinaryExpressionASTLeftAndRight,
): IBinaryExpressionAST {
    return {
        type: 'BinaryExpression',
        operator,
        left,
        right,
    };
}

/**
 * 
 * 
 * @export
 * @param {string} operator 
 * @param {LogicalExpressionASTLeftAndRight} left 
 * @param {LogicalExpressionASTLeftAndRight} right 
 * @returns {ILogicalExpressionAST} 
 */
export function getLogicalExpressionAST(
    operator: string,
    left: LogicalExpressionASTLeftAndRight,
    right: LogicalExpressionASTLeftAndRight,
): ILogicalExpressionAST {
    return {
        type: 'LogicalExpression',
        operator,
        left,
        right,
    };
}

/**
 * 
 * 
 * @export
 * @param {string} operator 
 * @param {UnaryExpressionASTArgument} argument 
 * @returns {IUnaryExpressionAST} 
 */
export function getUnaryExpressionAST(
    operator: string,
    argument: UnaryExpressionASTArgument,
): IUnaryExpressionAST {
    return {
        type: 'UnaryExpression',
        operator,
        argument,
    };
}

/**
 * 
 * 
 * @export
 * @param {string} operator 
 * @param {IIdentifierAST} left 
 * @param {AssignmentExpressionASTRight} right 
 * @returns {IAssignmentExpressionAST} 
 */
export function getAssignmentExpressionAST(
    operator: string,
    left: IIdentifierAST,
    right: AssignmentExpressionASTRight,
): IAssignmentExpressionAST {
    return {
        type: 'AssignmentExpression',
        operator,
        left,
        right,
    };
}

/**
 * 
 * 
 * @export
 * @param {IAssignmentExpressionAST} expression 
 * @returns {IExpressionStatementAST} 
 */
export function getExpressionStatementAST(
    expression: IAssignmentExpressionAST,
): IExpressionStatementAST {
    return {
        type: 'ExpressionStatement',
        expression,
    };
}

/**
 * 
 * 
 * @export
 * @param {ILiteralAST} property 
 * @param {string} objName 
 * @returns {IMemberExpressionAST} 
 */
export function getMemberExpressionAST(
    property: ILiteralAST,
    objName: string,
): IMemberExpressionAST {
    return {
        type: 'MemberExpression',
        computed: true,
        object: {
            type: 'Identifier',
            name: objName,
        },
        property,
    };
}

/**
 * 
 * 
 * @export
 * @param {IMemberExpressionAST} callee 
 * @param {Array<CallExpressionArgumentAST>} args 
 * @returns {ICallExpressionAST} 
 */
export function getCallExpressionAST(
    callee: IMemberExpressionAST | IIdentifierAST,
    args: Array<CallExpressionArgumentAST>,
): ICallExpressionAST {
    return {
        type: 'CallExpression',
        callee,
        arguments: args,
    };
}

/**
 * 
 * 
 * @export
 * @param {ConditionalExpressionTestAST} test 
 * @param {ConditionalExpressionConsequentAST} consequent 
 * @param {ConditionalExpressionAlternateAST} alternate 
 * @returns {IConditionalExpressionAST} 
 */
export function getConditionalExpressionAST(
    test: ConditionalExpressionTestAST,
    consequent: ConditionalExpressionConsequentAST,
    alternate: ConditionalExpressionAlternateAST,
): IConditionalExpressionAST {
    return {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate,
    };
}

export function getFunctionExpressionAst(
    params: Array<string>,
    returnStatementAst: IReturnStatementAst,
): IFunctionExpressionAst {
    return {
        type: 'FunctionExpression',
        params: params.map(param => getIdentifierAST(param)),
        body: {
            type: 'BlockStatement',
            body: [returnStatementAst],
        },
    };
}

export function getReturnStatementAst(argument: AST): IReturnStatementAst {
    return {
        type: 'ReturnStatement',
        argument,
    };
}

export function getObjectExpressionAst(
    properties: IPropertyAst[],
): IObjectExpressionAst {
    return {
        type: 'ObjectExpression',
        properties,
    };
}

export function getPropertyAst(
    key: string,
    value: ILiteralAST | IMemberExpressionAST,
): IPropertyAst {
    return {
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        key: getLiteralAST(key),
        value,
        kind: 'init',
    };
}
