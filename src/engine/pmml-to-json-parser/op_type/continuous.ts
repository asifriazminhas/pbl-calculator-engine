import { ContinuousOpType } from '../../op-type';
import { IDataField, IContinuousDataField } from '../../pmml';
import { Field } from '../../field';

export function isContinuousDataField(dataField: IDataField): dataField is IContinuousDataField {
    return dataField.$.optype === 'continuous';
}

export function addContinuousFieldsIfContinuous<T extends Field>(
    dataField: T,
    dataFieldNode: IDataField
): T | T & ContinuousOpType {
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