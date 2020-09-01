"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataFieldNode = getDataFieldNode;
exports.ContinuousOptype = exports.CategoricalOptype = void 0;
var CategoricalOptype = 'categorical';
exports.CategoricalOptype = CategoricalOptype;
var ContinuousOptype = 'continuous';
exports.ContinuousOptype = ContinuousOptype;

function getDataFieldNode(dataField) {
  var dataFieldEle = {
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
  } else {
    return Object.assign({}, dataFieldEle, {
      Value: dataField.values.map(function (value) {
        return {
          '@value': value.value,
          '@displayName': value.displayName
        };
      })
    });
  }
}
//# sourceMappingURL=common.js.map