export interface IApply {
    '#name': 'Apply'
    $: {
        function: string
    }
    $$: Array<IApplyChildNode>
}

export interface IConstant {
    '#name': 'Constant'
    $: {
        dataType: string
    }
    _: string
}

export interface IFieldRef {
    '#name': 'FieldRef'
    $: {
        field: string
    }
}

export type IApplyChildNode = IApply | IConstant | IFieldRef