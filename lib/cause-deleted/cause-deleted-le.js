"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCauseDeletedQx = getCauseDeletedQx;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCauseDeletedQx(externalPredictors, riskFactors, profile) {
  var OneYearFromToday = (0, _moment.default)();
  OneYearFromToday.add(1, 'year');
  return this.model.getAlgorithmForData(profile).getCauseDeletedRisk(externalPredictors, riskFactors, profile);
}
//# sourceMappingURL=cause-deleted-le.js.map