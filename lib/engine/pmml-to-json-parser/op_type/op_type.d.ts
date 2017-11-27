import { OpType } from '../../op-type';
import { Field } from '../../field';
import { IDataField } from '../../pmml';
export declare function addCategoricalOrContinuousFields<T extends Field>(field: T, dataFieldNode: IDataField): T;
export declare function getOpTypeFromPmmlOpType(opType: string): OpType;
