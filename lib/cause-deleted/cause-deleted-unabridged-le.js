"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCauseDeleted = addCauseDeleted;

var _causeDeletedRisk = require("./cause-deleted-risk");

var _extend = require("../util/extend");

var _causeDeletedLe = require("./cause-deleted-le");

function addCauseDeleted(unAbridgedLE, riskFactorRef) {
  return (0, _extend.extendObject)(unAbridgedLE, {
    model: (0, _causeDeletedRisk.addCauseDeleted)(unAbridgedLE.model, riskFactorRef),
    calculateCDForIndividual: calculateCDForIndividual
  });
}

function calculateCDForIndividual(externalPredictors, riskFactors, individual) {
  // Update the current getQx with the cause deleted Qx value so that the
  // LE method uses it in it's call
  var oldQx = this['getQx'];
  this['getQx'] = _causeDeletedLe.getCauseDeletedQx.bind(this, externalPredictors, riskFactors);
  var individualCD = this.calculateForIndividual(individual);
  this['getQx'] = oldQx;
  return individualCD;
}
//# sourceMappingURL=cause-deleted-unabridged-le.js.map