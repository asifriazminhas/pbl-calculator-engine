"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findDescendantDerivedField = findDescendantDerivedField;

var _nonInteractionCovariate = require("../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate");

var _interactionCovariate = require("../engine/data-field/covariate/interaction-covariate/interaction-covariate");

var _derivedField = require("../engine/data-field/derived-field/derived-field");

// tslint:disable-next-line:max-line-length
function findDescendantDerivedField(derivedField, name) {
  var foundDerivedField;
  derivedField.derivedFrom.every(function (derivedFromItem) {
    if (derivedFromItem.name === name) {
      if (derivedFromItem instanceof _derivedField.DerivedField) {
        foundDerivedField = derivedFromItem;
      }
    } else {
      if (derivedFromItem instanceof _nonInteractionCovariate.NonInteractionCovariate && derivedFromItem.derivedField) {
        foundDerivedField = findDescendantDerivedField(derivedFromItem.derivedField, name);
      } else if (derivedFromItem instanceof _interactionCovariate.InteractionCovariate) {
        foundDerivedField = findDescendantDerivedField(derivedFromItem.derivedField, name);
      } else if (derivedFromItem instanceof _derivedField.DerivedField) {
        foundDerivedField = findDescendantDerivedField(derivedFromItem, name);
      }
    }

    return foundDerivedField ? false : true;
  });
  return foundDerivedField;
}
//# sourceMappingURL=derived-field-dep-graph.js.map