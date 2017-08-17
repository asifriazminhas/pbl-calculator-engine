"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isContinuousDataField(dataField) {
    return dataField.$.optype === 'continuous';
}
exports.isContinuousDataField = isContinuousDataField;
function addContinuousFieldsIfContinuous(dataField, dataFieldNode) {
    if (isContinuousDataField(dataFieldNode) && dataFieldNode.Interval) {
        return Object.assign({}, dataField, {
            opType: dataFieldNode.$.optype,
            minValue: Number(dataFieldNode.Interval.$.leftMargin),
            maxValue: Number(dataFieldNode.Interval.$.rightMargin)
        });
    }
    else {
        return dataField;
    }
}
exports.addContinuousFieldsIfContinuous = addContinuousFieldsIfContinuous;
//# sourceMappingURL=continuous.js.map