"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoDataFieldNodeFound = NoDataFieldNodeFound;
exports.NoParameterNodeFoundWithLabel = NoParameterNodeFoundWithLabel;
exports.NoPCellNodeFoundWithParameterName = NoPCellNodeFoundWithParameterName;

function NoDataFieldNodeFound(dataFieldName) {
  return new Error("No DataField node found with name ".concat(dataFieldName));
}

function NoParameterNodeFoundWithLabel(parameterLabel) {
  return new Error("No Parameter node found with name ".concat(parameterLabel));
}

function NoPCellNodeFoundWithParameterName(pCellParameterName) {
  return new Error("No PCell node found with parameter name ".concat(pCellParameterName));
}
//# sourceMappingURL=index.js.map