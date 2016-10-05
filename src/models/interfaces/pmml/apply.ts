//interfaces
import {
    Apply
} from './pmml'

export interface EqualApply extends Apply {
    $: {
        function: 'equal'
    }
}

export interface MultiplyApply extends Apply {
    $: {
        function: '*'
    }
}

export interface DivideApply extends Apply {
    $: {
        function: '/'
    }
}

export interface AddApply extends Apply {
    $: {
        function: '+'
    }
}

export interface SubtractApply extends Apply {
    $: {
        function: '-'
    }
}

export type BinaryExpressionApply = EqualApply | MultiplyApply | DivideApply | AddApply | SubtractApply

export interface IfApply extends Apply {
    $: {
        function: 'if'
    }
}

export interface AndApply extends Apply {
    $: {
        function: 'and'
    }
}

export interface OrApply extends Apply {
    $: {
        function: 'or'
    }
}

export type LogicalExpressionApply = AndApply | OrApply

export interface ExpApply extends Apply {
    $: {
        function: 'exp'
    }
}

export interface LnApply extends Apply {
    $: {
        function: 'ln'
    }
}

export type CallExpressionApply = ExpApply | LnApply