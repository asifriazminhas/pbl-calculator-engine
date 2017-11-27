import { IApply, IConstant, IFieldRef } from './common';
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
