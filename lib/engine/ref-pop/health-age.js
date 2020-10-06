"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHealthAge = getHealthAge;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHealthAge(refPop, data, cox) {
  var oneYearFromToday = (0, _moment.default)();
  oneYearFromToday.add(1, 'year');
  var oneYearRisk = cox.getRiskToTime(data, oneYearFromToday);
  return refPop.reduce(function (currentRefPopRow, refPopRow) {
    if (Math.abs(refPopRow.outcomeRisk - oneYearRisk) < Math.abs(currentRefPopRow.outcomeRisk - oneYearRisk)) {
      return refPopRow;
    }

    return currentRefPopRow;
  }, refPop[0]).age;
}
//# sourceMappingURL=health-age.js.map