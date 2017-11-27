import { ContinuousOpType } from '../../op-type';
import { IDataField, IContinuousDataField } from '../../pmml';
import { Field } from '../../field';
export declare function isContinuousDataField(dataField: IDataField): dataField is IContinuousDataField;
export declare function addContinuousFieldsIfContinuous<T extends Field>(dataField: T, dataFieldNode: IDataField): T | T & ContinuousOpType;
