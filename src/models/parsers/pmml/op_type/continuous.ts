import { GenericDataField } from '../../../common';
import { ContinuousFieldJson } from '../../json/optype';
import { IDataField, IContinuousDataField } from '../../../pmml';

export function isContinuousDataField(dataField: IDataField): dataField is IContinuousDataField {
    return dataField.$.optype === 'continuous';
}

export function addContinuousFieldsIfContinuous<T extends GenericDataField>(
    dataField: T,
    dataFieldNode: IDataField
): T | T & ContinuousFieldJson {
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