"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataFieldType = void 0;
var DataFieldType;
exports.DataFieldType = DataFieldType;

(function (DataFieldType) {
  DataFieldType[DataFieldType["DataField"] = 0] = "DataField";
  DataFieldType[DataFieldType["DerivedField"] = 1] = "DerivedField";
  DataFieldType[DataFieldType["NonInteractionCovariate"] = 2] = "NonInteractionCovariate";
  DataFieldType[DataFieldType["InteractionCovariate"] = 3] = "InteractionCovariate";
})(DataFieldType || (exports.DataFieldType = DataFieldType = {}));
//# sourceMappingURL=data-field-type.js.map