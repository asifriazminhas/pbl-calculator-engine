//interfaces
import {
    Apply,
    FieldRef,
    Constant
} from '../interfaces/pmml/pmml'
import {
    BinaryExpressionApply,
    IfApply,
    LogicalExpressionApply,
    CallExpressionApply
} from '../interfaces/pmml/apply'
import {
    LiteralAST,
    BinaryExpressionASTLeftAndRight,
    BinaryExpressionAST,
    LogicalExpressionASTLeftAndRight,
    LogicalExpressionAST,
    UnaryExpressionAST,
    MemberExpressionAST,
    ConditionalExpressionAST,
    CallExpressionAST,
    AST
} from '../interfaces/ast'

//models
import {
    getLiteralAST,
    getUnaryExpressionAST,
    getMemberExpressionAST,
    getBinaryExpressionAST,
    getConditionalExpressionAST,
    getLogicalExpressionAST,
    getCallExpressionAST
} from './ast'

export function getASTForConstant(constant: Constant): UnaryExpressionAST | LiteralAST {
    if(constant.$.dataType === 'double') {
        let value = Number(constant._)

        if(value < 0) {
            return getUnaryExpressionAST('-', getLiteralAST(Math.abs(value)))
        }
        else {
            return getLiteralAST(value)
        }
    }
    else if(constant.$.dataType === 'string') {
        return getLiteralAST(constant._)
    }
    else {
        throw new Error(`Unknown dataType ${constant.$.dataType} for Constant`)
    }
}

export function getASTForFieldRef(fieldRef: FieldRef): MemberExpressionAST {
    return getMemberExpressionAST(getLiteralAST(fieldRef.$.field), 'obj')
}

const SpecialFunctions: Array<string> = [
    'exp',
    'ln',
    'is.na',
    'not',
    'notEqual'
]
export function getASTForApply(apply: Apply): AST {
    if(BinaryExpressionOperators[apply.$.function] !== undefined) {
        return getASTForBinaryExpressionApply(apply as BinaryExpressionApply)
    }
    else if(LogicalExpressionOperators[apply.$.function] !==  undefined) {
        return getASTForLogicalExpressionApply(apply as LogicalExpressionApply)
    }
    else if(apply.$.function === 'if') {
        return getASTForIfApply(apply as IfApply)
    }
    else if(SpecialFunctions.indexOf(apply.$.function) > -1) {
        return getASTForCallExpressionApply(apply as CallExpressionApply)
    }
    else {
        throw new Error(`Unhandled function ${apply.$.function}`)
    }
}

const BinaryExpressionOperators: {
    [index: string]: string | undefined
} = {
    '*': '*',
    '/': '/',
    '+': '+',
    '-': '-',
    'greaterThan': '>',
    'lessThan': '<',
    'equal': '==',
    'greaterOrEqual': '>=',
    'lessOrEqual': '<='
}
export function getASTForBinaryExpressionApply(apply: BinaryExpressionApply): BinaryExpressionAST {
    var left: BinaryExpressionASTLeftAndRight
    var leftNode = apply.$$[0]
    switch(leftNode['#name']) {
        case 'Constant': {
            left = getASTForConstant(leftNode as Constant)
            break
        }
        case 'FieldRef': {
            left = getASTForFieldRef(leftNode as FieldRef)
            break
        }
        case 'Apply': {
            left = getASTForApply(leftNode as Apply)
            break
        }
        default: {
            throw new Error(`Unhandled node type ${leftNode['#name']} when getting AST for binaryh expression node`)
        }
    }

    var right: BinaryExpressionASTLeftAndRight
    var rightNode = apply.$$[1]
    switch(rightNode['#name']) {
        case 'Constant': {
            right = getASTForConstant(rightNode as Constant)
            break
        }
        case 'FieldRef': {
            right = getASTForFieldRef(rightNode as FieldRef)
            break
        }
        case 'Apply': {
            right = getASTForApply(rightNode as Apply)
            break
        }
        default: {
            throw new Error(`Unhandled node type ${rightNode['#name']} when getting AST for binaryh expression node`)
        }
    }

    if(BinaryExpressionOperators[apply.$.function] === undefined) {
        throw new Error(`Unhandled operator ${apply.$.function}`)
    }

    return getBinaryExpressionAST(BinaryExpressionOperators[apply.$.function] as string, left, right)
}

const LogicalExpressionOperators: {
    [index: string]: string | undefined
} = {
    and: '&&',
    or: '||'
}
export function getASTForLogicalExpressionApply(apply: LogicalExpressionApply): LogicalExpressionAST {
    if(apply.$$[0]['#name'] !== 'Apply') {
        throw new Error(`Unhandled node type ${apply.$$[0]['#name']}`)
    }

    var right: LogicalExpressionASTLeftAndRight
    switch(apply.$$[1]['#name']) {
        case 'Constant': {
            right = getASTForConstant(apply.$$[1] as Constant)
            break
        }
        case 'FieldRef': {
            right = getASTForFieldRef(apply.$$[1] as FieldRef)
            break
        }
        case 'Apply': {
            right = getASTForApply(apply.$$[1] as Apply)
            break
        }
        default: {
            throw new Error(`Unhandled node ${apply.$$[1]['#name']}`)
        }
    }

    if(LogicalExpressionOperators[apply.$.function] === undefined) {
        throw new Error(`Unhandled operator ${apply.$.function}`)
    }

    return getLogicalExpressionAST(LogicalExpressionOperators[apply.$.function] as string, getASTForApply(apply.$$[0] as Apply) as LogicalExpressionASTLeftAndRight, right)
} 

export function getASTForIfApply(apply: IfApply): ConditionalExpressionAST {
    var test: AST
    switch(apply.$$[0]['#name']) {
        case 'Constant': {
            test = getASTForConstant(apply.$$[0] as Constant) as LiteralAST
            break
        }
        case 'FieldRef': {
            test = getASTForFieldRef(apply.$$[0] as FieldRef)
            break
        }
        case 'Apply': {
            test = getASTForApply(apply.$$[0] as Apply)
            break
        }
        default: {
            throw new Error(`Unhandles node type ${apply.$$[0]['#name']}`)
        }
    }

    var consequent: AST
    switch(apply.$$[1]['#name']) {
        case 'Constant': {
            consequent = getASTForConstant(apply.$$[1] as Constant) as LiteralAST
            break
        }
        case 'FieldRef': {
            consequent = getASTForFieldRef(apply.$$[1] as FieldRef)
            break
        }
        case 'Apply': {
            consequent = getASTForApply(apply.$$[1] as Apply)
            break
        }
        default: {
            throw new Error(`Unhandles node type ${apply.$$[1]['#name']}`)
        }
    }

    var alternate: AST
    switch(apply.$$[2]['#name']) {
        case 'Constant': {
            alternate = getASTForConstant(apply.$$[2] as Constant) as LiteralAST
            break
        }
        case 'FieldRef': {
            alternate = getASTForFieldRef(apply.$$[2] as FieldRef)
            break
        }
        case 'Apply': {
            alternate = getASTForApply(apply.$$[2] as Apply)
            break
        }
        default: {
            throw new Error(`Unhandled node type ${apply.$$[2]['#name']}`)
        }
    } 

    return getConditionalExpressionAST(test, consequent, alternate)
}

export function getASTForCallExpressionApply(apply: CallExpressionApply): CallExpressionAST {
    return getCallExpressionAST(getMemberExpressionAST(getLiteralAST(apply.$.function), 'func'), apply.$$.map((apply) => {
        switch(apply['#name']) {
            case 'Constant': {
                return getASTForConstant(apply as Constant)
            }
            case 'FieldRef': {
                return getASTForFieldRef(apply as FieldRef)
            }
            case 'Apply': {
                return getASTForApply(apply as Apply)
            }
            default: {
                throw new Error(`Unhandled node type ${apply['#name']}`)
            }
        }
    }))
}

