import { OpTypes } from '../../common/op-types';
import { GenericField } from '../../common/generic-types';
import { IDataField } from '../../pmml';
export declare function addCategoricalOrContinuousFields<T extends GenericField>(field: T, dataFieldNode: IDataField): T;
export declare function getOpTypeFromPmmlOpType(opType: string): OpTypes;
