//interfaces
import { IApply, IFieldRef, IConstant } from '../../../pmml/local_transformations/common';
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
} from '../../interfaces/ast'

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

//Object for oeprators that don't meet the normal parsing conditions
const ApplyOperatorExceptions: {
    [index: string]: (
        apply: IApply, 
        userDefinedFunctionNames: Array<string>
    ) => AST;
} = {
    //The - operator can be a subtraction (a - b) or a negation (-a)
    '-': function(apply, userDefinedFunctionNames) {
        if(!apply.$$[1]) {
            const leftNode = apply.$$[0];
            let leftNodeAst;

            if(leftNode['#name'] === 'Constant') {
                leftNodeAst = getASTForConstant(leftNode as IConstant);
            }
            else if(leftNode['#name'] === 'FieldRef') {
                leftNodeAst = getASTForFieldRef(leftNode as IFieldRef);
            }
            else if(leftNode['#name'] === 'Apply') {
                leftNodeAst = getASTForApply(
                    leftNode as IApply,
                    userDefinedFunctionNames
                );
            }

            if(!leftNodeAst) {
                throw new Error(`Unhandle node type`);
            }

            return getUnaryExpressionAST('-', leftNodeAst as any);
        }
        else {
            return getASTForBinaryExpressionApply(
                apply,
                userDefinedFunctionNames
            );
        }
    }
};

/**
 * Converts a Constant node either into a UnaryExpressionAST (since some of the constants can be negative numbers) or LiteralAST
 * 
 * @export
 * @param {Constant} constant
 * @returns {(UnaryExpressionAST | LiteralAST)}
 */
export function getASTForConstant(constant: IConstant): UnaryExpressionAST | LiteralAST {
    //If the constant's dataType is a string or the dataType is not given
    if(!constant.$ || constant.$.dataType === 'string') {
        return getLiteralAST(constant._)
    }
    //If it's dataType is a double
    else if(constant.$.dataType === 'double') {
        //Parse the value as a number
        let value = Number(constant._)

        //If it is negative then return a UnaryExpressionAST
        if(value < 0) {
            return getUnaryExpressionAST('-', getLiteralAST(Math.abs(value)))
        }
        else {
            return getLiteralAST(value)
        }
    }
    else {
        throw new Error(`Unknown dataType ${constant.$.dataType} for Constant`)
    }
}

/**
 * Parses a FieldRef node
 * 
 * @export
 * @param {FieldRef} fieldRef
 * @returns {MemberExpressionAST}
 */
export function getASTForFieldRef(fieldRef: IFieldRef): MemberExpressionAST {
    //Since field ref's refer to other predictor values we need to inject them at runtime when evaluating an algorithm. This if the fieldRef is for example test we return the AST so that it generates obj['test']
    return getMemberExpressionAST(getLiteralAST(fieldRef.$.field), 'obj')
}

export type GetAstForApplyReturn = BinaryExpressionAST | LogicalExpressionAST | ConditionalExpressionAST | CallExpressionAST;
/**
 * Returns AST for an Apply node
 * 
 * @export
 * @param {Apply} apply
 * @returns {AST}
 */
export function getASTForApply(
    apply: IApply,
    userDefinedFunctionNames: Array<string>
): GetAstForApplyReturn {
    if(ApplyOperatorExceptions[apply.$.function]) {
        return ApplyOperatorExceptions[apply.$.function](
            apply,
            userDefinedFunctionNames
        ) as any;
    }
    //if the function is a binary expression operator
    if(BinaryExpressionOperators[apply.$.function] !== undefined) {
        return getASTForBinaryExpressionApply(
            apply,
            userDefinedFunctionNames
        )
    }
    //if the function is a logical expression operator
    else if(LogicalExpressionOperators[apply.$.function] !==  undefined) {
        return getASTForLogicalExpressionApply(
            apply,
            userDefinedFunctionNames
        )
    }
    //if the function is an if statement
    else if(apply.$.function === 'if') {
        return getASTForIfApply(
            apply,
            userDefinedFunctionNames
        )
    }
    //if it is one of the special PMML functions
    else if(SpecialFunctions.indexOf(apply.$.function) > -1) {
        return getASTForCallExpressionApply(
            apply,
            userDefinedFunctionNames
        )
    }
    else if(userDefinedFunctionNames.indexOf(apply.$.function) > -1) {
        return getASTForUserDefinedFunctionApply(
            apply,
            userDefinedFunctionNames
        );
    }
    else {
        throw new Error(`Unhandled function ${apply.$.function}`)
    }
}

//Maps PMML functions which can be binary expression operators to their relevant ones in javascript
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
/**
 * Maps an Apply node whose function is a binary expression operand to a BinaryExpressionAST 
 * 
 * @export
 * @param {Apply} apply
 * @returns {BinaryExpressionAST}
 */
export function getASTForBinaryExpressionApply(
    apply: IApply,
    userDefinedFunctionNames: Array<string>
): BinaryExpressionAST {
    var left: BinaryExpressionASTLeftAndRight
    var leftNode = apply.$$[0]
    switch(leftNode['#name']) {
        case 'Constant': {
            left = getASTForConstant(leftNode as IConstant)
            break
        }
        case 'FieldRef': {
            left = getASTForFieldRef(leftNode as IFieldRef)
            break
        }
        case 'Apply': {
            left = getASTForApply(leftNode as IApply, userDefinedFunctionNames) as BinaryExpressionASTLeftAndRight
            break
        }
        default: {
            throw new Error(`Unhandled node type ${leftNode['#name']} when getting AST for binaryh expression node`)
        }
    }

    var right: BinaryExpressionASTLeftAndRight
    var rightNode = apply.$$[1];
    switch(rightNode['#name']) {
        case 'Constant': {
            right = getASTForConstant(rightNode as IConstant)
            break
        }
        case 'FieldRef': {
            right = getASTForFieldRef(rightNode as IFieldRef)
            break
        }
        case 'Apply': {
            right = getASTForApply(
                rightNode as IApply,
                userDefinedFunctionNames
            ) as BinaryExpressionASTLeftAndRight
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

//Maps PMML Apply function strings which are logical expression operators to their corresponsing logical expression operand in JS
const LogicalExpressionOperators: {
    [index: string]: string | undefined
} = {
    and: '&&',
    or: '||'
}
/**
 * Maps an Apply whose function string is one of the above LogicalExpressionOperators to a LogicalExpressionAST
 * 
 * @export
 * @param {Apply} apply
 * @returns {LogicalExpressionAST}
 */
export function getASTForLogicalExpressionApply(
    apply: IApply,
    userDefinedFunctionNames: Array<string>
): LogicalExpressionAST {
    var left: LogicalExpressionASTLeftAndRight
    switch(apply.$$[1]['#name']) {
        case 'Constant': {
            left = getASTForConstant(apply.$$[0] as IConstant)
            break
        }
        case 'FieldRef': {
            left = getASTForFieldRef(apply.$$[0] as IFieldRef)
            break
        }
        case 'Apply': {
            left = getASTForApply(
                apply.$$[0] as IApply, 
                userDefinedFunctionNames
            ) as LogicalExpressionASTLeftAndRight
            break
        }
        default: {
            throw new Error(`Unhandled node ${apply.$$[1]['#name']}`)
        }
    }

    var right: LogicalExpressionASTLeftAndRight
    switch(apply.$$[1]['#name']) {
        case 'Constant': {
            right = getASTForConstant(apply.$$[1] as IConstant)
            break
        }
        case 'FieldRef': {
            right = getASTForFieldRef(apply.$$[1] as IFieldRef)
            break
        }
        case 'Apply': {
            right = getASTForApply(
                apply.$$[1] as IApply,
                userDefinedFunctionNames
            ) as LogicalExpressionASTLeftAndRight
            break
        }
        default: {
            throw new Error(`Unhandled node ${apply.$$[1]['#name']}`)
        }
    }

    if(LogicalExpressionOperators[apply.$.function] === undefined) {
        throw new Error(`Unhandled operator ${apply.$.function}`)
    }

    return getLogicalExpressionAST(LogicalExpressionOperators[apply.$.function] as string, left, right)
} 

/**
 * Maps an Apply node whose function is an if to a ConditionalExpressionAST. Do this rather than an IfStatement because it's more concise
 * 
 * @export
 * @param {Apply} apply
 * @returns {ConditionalExpressionAST}
 */
export function getASTForIfApply(
    apply: IApply,
    userDefinedFunctionNames: Array<string>
): ConditionalExpressionAST {
    var test: AST
    switch(apply.$$[0]['#name']) {
        case 'Constant': {
            test = getASTForConstant(apply.$$[0] as IConstant) as LiteralAST
            break
        }
        case 'FieldRef': {
            test = getASTForFieldRef(apply.$$[0] as IFieldRef)
            break
        }
        case 'Apply': {
            test = getASTForApply(
                apply.$$[0] as IApply,
                userDefinedFunctionNames
            )
            break
        }
        default: {
            throw new Error(`Unhandles node type ${apply.$$[0]['#name']}`)
        }
    }

    var consequent: AST
    switch(apply.$$[1]['#name']) {
        case 'Constant': {
            consequent = getASTForConstant(apply.$$[1] as IConstant) as LiteralAST
            break
        }
        case 'FieldRef': {
            consequent = getASTForFieldRef(apply.$$[1] as IFieldRef)
            break
        }
        case 'Apply': {
            consequent = getASTForApply(
                apply.$$[1] as IApply,
                userDefinedFunctionNames
            )
            break
        }
        default: {
            throw new Error(`Unhandles node type ${apply.$$[1]['#name']}`)
        }
    }

    var alternate: AST
    switch(apply.$$[2]['#name']) {
        case 'Constant': {
            alternate = getASTForConstant(apply.$$[2] as IConstant) as LiteralAST
            break
        }
        case 'FieldRef': {
            alternate = getASTForFieldRef(apply.$$[2] as IFieldRef)
            break
        }
        case 'Apply': {
            alternate = getASTForApply(
                apply.$$[2] as IApply,
                userDefinedFunctionNames
            )
            break
        }
        default: {
            throw new Error(`Unhandled node type ${apply.$$[2]['#name']}`)
        }
    } 

    return getConditionalExpressionAST(test, consequent, alternate)
}

//These are functions which we have implemented ourselves
const SpecialFunctions: Array<string> = [
    'exp',
    'ln',
    'is.na',
    'not',
    'notEqual',
    'formatDatetime',
    'max',
    'sum'
]
/**
 * Maps a PMML apply node whose function string is set to one in the above SpecialFunctions object to a CallExpressionAST
 * 
 * @export
 * @param {Apply} apply
 * @returns {CallExpressionAST}
 */
export function getASTForCallExpressionApply(
    apply: IApply,
    userDefinedFunctionNames: Array<string>
): CallExpressionAST {
    //We make the function call look like func[apply.$.function] so that we can dynamically make the functions available at runtime
    return getCallExpressionAST(
        getMemberExpressionAST(getLiteralAST(apply.$.function), 'func'),
        //Go through all the function arguments
        apply.$$.map((apply) => {
            switch (apply['#name']) {
                case 'Constant': {
                    return getASTForConstant(apply as IConstant)
                }
                case 'FieldRef': {
                    return getASTForFieldRef(apply as IFieldRef)
                }
                case 'Apply': {
                    return getASTForApply(
                        apply as IApply,
                        userDefinedFunctionNames
                    )
                }
                default: {
                    throw new Error(`Unhandled node type ${apply['#name']}`)
                }
            }
        })
    );
}

/**
 * Maps a PMML apply node whose function string is set to one in the above SpecialFunctions object to a CallExpressionAST
 * 
 * @export
 * @param {Apply} apply
 * @returns {CallExpressionAST}
 */
export function getASTForUserDefinedFunctionApply(
    apply: IApply,
    userDefinedFunctionNames: Array<string>
): CallExpressionAST {
    //We make the function call look like func[apply.$.function] so that we can dynamically make the functions available at runtime
    return getCallExpressionAST(
        getMemberExpressionAST(
            getLiteralAST(apply.$.function), 'userFunctions'
        ),
        //Go through all the function arguments
        apply.$$.map((apply) => {
            switch (apply['#name']) {
                case 'Constant': {
                    return getASTForConstant(apply as IConstant)
                }
                case 'FieldRef': {
                    return getASTForFieldRef(apply as IFieldRef)
                }
                case 'Apply': {
                    return getASTForApply(
                        apply as IApply,
                        userDefinedFunctionNames
                    )
                }
                default: {
                    throw new Error(`Unhandled node type ${apply['#name']}`)
                }
            }
        })
    );
}

