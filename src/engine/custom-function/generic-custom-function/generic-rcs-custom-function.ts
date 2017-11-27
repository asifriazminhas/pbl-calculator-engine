import { CustomFunctionType } from '../custom-function-type';

export interface GenericRcsCustomFunction<T> {
    customFunctionType: CustomFunctionType.RcsCustomFunction;
    knots: number[];
    firstVariableCovariate: T;
    variableNumber: number;
}
