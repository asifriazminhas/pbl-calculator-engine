"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoricalOptype = 'categorical';
exports.ContinuousOptype = 'continuous';
function getDataFieldNode(dataField) {
    const dataFieldEle = {
        '@name': dataField.name,
        '@optype': dataField.optype,
        '@dataType': 'double',
        '@displayName': dataField.displayName
    };
    if (dataField.optype === 'continuous') {
        return Object.assign({}, dataFieldEle, {
            Interval: {
                '@closure': dataField.interval.closure,
                '@leftMargin': dataField.interval.leftMargin,
                '@rightMargin': dataField.interval.rightMargin
            }
        });
    }
    else {
        return Object.assign({}, dataFieldEle, {
            Value: dataField.values
                .map((value) => {
                return {
                    '@value': value.value,
                    '@displayName': value.displayName
                };
            })
        });
    }
}
exports.getDataFieldNode = getDataFieldNode;
//# sourceMappingURL=common.js.map