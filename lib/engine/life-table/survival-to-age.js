"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function getSurvivalToAge(lifeTable, toAge) {
  var startAgelx = lifeTable[0].lx;
  var endAgeLifeTableRow = lifeTable.find(function (lifeTableRow) {
    return lifeTableRow.age === toAge;
  });

  if (!endAgeLifeTableRow) {
    throw new Error("No life table row found for age ".concat(toAge));
  }

  return endAgeLifeTableRow.lx / startAgelx;
}

exports.getSurvivalToAge = getSurvivalToAge;
//# sourceMappingURL=survival-to-age.js.map