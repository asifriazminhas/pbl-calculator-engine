import { IApply, IConstant, IFieldRef } from './common';
export interface DefineFunction {
    $: {
        name: string;
        optype: string;
        dataType: string;
    };
    ParameterField: Array<{
        $: {
            name: string;
            dataType: string;
        };
    }> | {
        $: {
            name: string;
            dataType: string;
        };
    };
    Apply?: IApply;
    Constant?: IConstant;
    FieldRef?: IFieldRef;
}
export declare const mergeDefineFunctions: (arrayOne: DefineFunction[], arrayTwo: DefineFunction[]) => DefineFunction[];
