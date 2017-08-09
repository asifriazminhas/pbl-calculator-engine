import { getMergeArraysFunction } from '../../common/merge';

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

export interface IDerivedField {
    $: {
        name: string;
        optype: string;
    }
    Apply?: IApply;
    Constant?: IConstant;
    FieldRef?: IFieldRef;
}

export const mergeDerivedFields = getMergeArraysFunction(
    (derivedField: IDerivedField) => {
        return derivedField.$.name
    }
);

