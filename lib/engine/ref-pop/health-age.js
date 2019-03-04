"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function getHealthAge(refPop, data, cox) {
  var oneYearRisk = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : cox.getRiskToTime(data);
  return refPop.reduce(function (currentRefPopRow, refPopRow) {
    if (Math.abs(refPopRow.outcomeRisk - oneYearRisk) < Math.abs(currentRefPopRow.outcomeRisk - oneYearRisk)) {
      return refPopRow;
    }

    return currentRefPopRow;
  }, refPop[0]).age;
}

exports.getHealthAge = getHealthAge;
//# sourceMappingURL=health-age.js.map