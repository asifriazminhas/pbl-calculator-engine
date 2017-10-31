import { GenericContinuousOpType } from '../../common/generic-types';
import { IDataField, IContinuousDataField } from '../../pmml';
import { GenericField } from '../../field';

export function isContinuousDataField(dataField: IDataField): dataField is IContinuousDataField {
    return dataField.$.optype === 'continuous';
}

export function addContinuousFieldsIfContinuous<T extends GenericField>(
    dataField: T,
    dataFieldNode: IDataField
): T | T & GenericContinuousOpType {
    if (isContinuousDataField(dataFieldNode) && dataFieldNode.Interval) {
        return Object.assign({}, dataField, {
            opType: dataFieldNode.$.optype,
            minValue: Number(dataFieldNode.Interval.$.leftMargin),
            maxValue: Number(dataFieldNode.Interval.$.rightMargin)
        });
    } else {
        return dataField;
    }
}