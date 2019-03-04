"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function NoDataFieldNodeFound(dataFieldName) {
  return new Error("No DataField node found with name ".concat(dataFieldName));
}

exports.NoDataFieldNodeFound = NoDataFieldNodeFound;

function NoParameterNodeFoundWithLabel(parameterLabel) {
  return new Error("No Parameter node found with name ".concat(parameterLabel));
}

exports.NoParameterNodeFoundWithLabel = NoParameterNodeFoundWithLabel;

function NoPCellNodeFoundWithParameterName(pCellParameterName) {
  return new Error("No PCell node found with parameter name ".concat(pCellParameterName));
}

exports.NoPCellNodeFoundWithParameterName = NoPCellNodeFoundWithParameterName;
//# sourceMappingURL=index.js.map