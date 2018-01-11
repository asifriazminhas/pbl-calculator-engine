"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isCategoricalDataField(dataField) {
    return dataField.$.optype === 'categorical';
}
exports.isCategoricalDataField = isCategoricalDataField;
function parseCategories(categoricalDataFieldNode) {
    if (categoricalDataFieldNode.Value instanceof Array) {
        return categoricalDataFieldNode.Value.map(value => {
            return {
                value: value.$.value,
                displayValue: value.$.displayName,
                description: value.$.description,
            };
        });
    }
    else {
        return [
            {
                value: categoricalDataFieldNode.Value.$.value,
                displayValue: categoricalDataFieldNode.Value.$.displayName,
                description: categoricalDataFieldNode.Value.$.description,
            },
        ];
    }
}
exports.parseCategories = parseCategories;
function addCategoricalFieldsIfCategorical(dataField, dataFieldNode) {
    if (isCategoricalDataField(dataFieldNode)) {
        return Object.assign({}, dataField, {
            opType: dataFieldNode.$.optype,
            categories: parseCategories(dataFieldNode),
        });
    }
    else {
        return dataField;
    }
}
exports.addCategoricalFieldsIfCategorical = addCategoricalFieldsIfCategorical;
//# sourceMappingURL=categorical.js.map