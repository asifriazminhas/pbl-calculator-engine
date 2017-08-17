import { GenericField, GenericContinuousOpType } from '../../common/generic-types';
import { IDataField, IContinuousDataField } from '../../pmml';
export declare function isContinuousDataField(dataField: IDataField): dataField is IContinuousDataField;
export declare function addContinuousFieldsIfContinuous<T extends GenericField>(dataField: T, dataFieldNode: IDataField): T | T & GenericContinuousOpType;
