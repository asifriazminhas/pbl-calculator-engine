"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDataFieldFromDataFieldPmmlNode = parseDataFieldFromDataFieldPmmlNode;

var _invalidValueTreatment = require("../../pmml/mining-schema/invalid-value-treatment");

function parseDataFieldFromDataFieldPmmlNode(dataFieldNode, miningField) {
  return {
    name: dataFieldNode.$.name,
    intervals: parseIntervals(dataFieldNode),
    categories: parseValues(dataFieldNode),
    isRequired: parseIsRequired(dataFieldNode, miningField),
    isRecommended: parseIsRecommended(dataFieldNode),
    metadata: {
      label: dataFieldNode.$.displayName,
      shortLabel: dataFieldNode.$['X-shortLabel']
    }
  };
}

function parseValues(dataField) {
  if ('Value' in dataField) {
    if (dataField.Value === undefined) {
      return undefined;
    } else {
      return (dataField.Value instanceof Array ? dataField.Value : [dataField.Value]).map(function (valueNode) {
        return {
          value: valueNode.$.value,
          displayValue: valueNode.$.displayName,
          description: valueNode.$.description
        };
      });
    }
  }

  return undefined;
}

function parseIntervals(dataField) {
  if ('Interval' in dataField) {
    return (dataField.Interval instanceof Array ? dataField.Interval : [dataField.Interval]).map(function (interval) {
      return Object.assign({
        description: interval.$['X-description']
      }, interval.$.leftMargin ? {
        lowerMargin: {
          margin: Number(interval.$.leftMargin),
          isOpen: false
        }
      } : undefined, interval.$.rightMargin ? {
        higherMargin: {
          margin: Number(interval.$.rightMargin),
          isOpen: false
        }
      } : undefined);
    });
  } else {
    return undefined;
  }
}

function parseIsRequired(dataFieldNode, miningField) {
  if (dataFieldNode && dataFieldNode.$['X-required']) {
    return dataFieldNode.$['X-required'] === 'true' ? true : false;
  }

  if (miningField) {
    return miningField.$.invalidValueTreatment === _invalidValueTreatment.InvalidValueTreatment.ReturnInvalid ? true : false;
  }

  return false;
}

function parseIsRecommended(dataFieldNode) {
  return dataFieldNode.$['X-recommended'] === 'true' ? true : false;
}
//# sourceMappingURL=data_field.js.map