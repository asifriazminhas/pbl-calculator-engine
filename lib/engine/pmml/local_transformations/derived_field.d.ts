export interface IApply {
    '#name': 'Apply';
    $: {
        function: string;
    };
    $$: Array<IApplyChildNode>;
}
export interface IConstant {
    '#name': 'Constant';
    $: {
        dataType: string;
    };
    _: string;
}
export interface IFieldRef {
    '#name': 'FieldRef';
    $: {
        field: string;
    };
}
export declare type IApplyChildNode = IApply | IConstant | IFieldRef;
export interface IDerivedField {
    $: {
        name: string;
        optype: string;
    };
    Apply?: IApply;
    Constant?: IConstant;
    FieldRef?: IFieldRef;
}
export declare const mergeDerivedFields: (arrayOne: IDerivedField[], arrayTwo: IDerivedField[]) => IDerivedField[];