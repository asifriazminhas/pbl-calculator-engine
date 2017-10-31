import { Field } from '../field';
import { GenericCustomFunction } from '../custom-function';

export interface GenericBaseCovariate<T> extends Field {
    beta: number;
    referencePoint: number;
    customFunction: GenericCustomFunction<T> | undefined;
}