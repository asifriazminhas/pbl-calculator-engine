"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invalid_value_treatment_1 = require("../../pmml/mining-schema/invalid-value-treatment");
function parseDataFieldFromDataFieldPmmlNode(dataFieldNode, miningField) {
    return {
        name: dataFieldNode.$.name,
        interval: parseInterval(dataFieldNode),
        categories: parseValues(dataFieldNode),
        isRequired: parseIsRequired(miningField),
        metadata: {
            label: dataFieldNode.$.displayName,
            shortLabel: dataFieldNode.$['X-shortLabel'],
        },
    };
}
exports.parseDataFieldFromDataFieldPmmlNode = parseDataFieldFromDataFieldPmmlNode;
function parseValues(dataField) {
    if ('Value' in dataField) {
        if (dataField.Value === undefined) {
            return undefined;
        }
        else {
            return (dataField.Value instanceof Array
                ? dataField.Value
                : [dataField.Value]).map(valueNode => {
                return {
                    value: valueNode.$.value,
                    displayValue: valueNode.$.displayName,
                    description: valueNode.$.description,
                };
            });
        }
    }
    return undefined;
}
function parseInterval(dataField) {
    if ('Interval' in dataField) {
        return Object.assign({}, dataField.Interval.$.leftMargin
            ? {
                lowerMargin: {
                    margin: Number(dataField.Interval.$.leftMargin),
                    isOpen: false,
                },
            }
            : undefined, dataField.Interval.$.rightMargin
            ? {
                higherMargin: {
                    margin: Number(dataField.Interval.$.rightMargin),
                    isOpen: false,
                },
            }
            : undefined);
    }
    else {
        return undefined;
    }
}
function parseIsRequired(miningField) {
    return miningField
        ? miningField.$.invalidValueTreatment ===
            invalid_value_treatment_1.InvalidValueTreatment.ReturnInvalid
            ? true
            : false
        : false;
}
//# sourceMappingURL=data_field.js.map