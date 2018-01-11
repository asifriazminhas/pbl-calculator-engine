import { Field } from '../../field';
import { GenericCustomFunction } from '../../custom-function';

export interface GenericBaseCovariate<T> extends Field {
    beta: number;
    referencePoint: number | undefined;
    customFunction: GenericCustomFunction<T> | undefined;
}
