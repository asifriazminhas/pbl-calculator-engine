import { IApply, IConstant, IFieldRef } from './common';
import { getMergeArraysFunction } from '../../../util/merge';

export interface DefineFunction {
    $: {
        name: string;
        optype: string;
        dataType: string;
    };
    ParameterField:
        | Array<{
              $: {
                  name: string;
                  dataType: string;
              };
          }>
        | {
              $: {
                  name: string;
                  dataType: string;
              };
          };
    Apply?: IApply;
    Constant?: IConstant;
    FieldRef?: IFieldRef;
}

export const mergeDefineFunctions = getMergeArraysFunction(
    (defineFunction: DefineFunction) => {
        return defineFunction.$.name;
    },
);
