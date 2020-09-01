"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCauseDeleted = addCauseDeleted;

var _causeDeletedRisk = require("./cause-deleted-risk");

var _extend = require("../util/extend");

var _causeDeletedLe = require("./cause-deleted-le");

/**
 * Adds cause deleted methods to the Abridged life expectancy object
 *
 * @export
 * @param {AbridgedLifeExpectancy} abridgedLE Object to extend
 * @param {CauseDeletedRef} riskFactorRef A JSON array containing the
 * reference exposure values to use for each algorithm when calculating
 * cause deleted
 * @returns {ICauseDeletedAbridgedLE}
 */
function addCauseDeleted(abridgedLE, riskFactorRef) {
  return (0, _extend.extendObject)(abridgedLE, {
    model: (0, _causeDeletedRisk.addCauseDeleted)(abridgedLE.model, riskFactorRef),
    calculateCDForIndividual: calculateCDForIndividual,
    calculateCDForPopulation: calculateCDForPopulation
  });
}

function calculateCDForIndividual(externalPredictors, riskFactors, individual) {
  // Update the current getQx with the cause deleted Qx value so that the
  // LE method uses it in it's call
  var oldGetQx = this['getQx'];
  this['getQx'] = _causeDeletedLe.getCauseDeletedQx.bind(this, externalPredictors, riskFactors);
  var causeDeletedLE = this.calculateForIndividual(individual);
  this['getQx'] = oldGetQx;
  return causeDeletedLE;
}

function calculateCDForPopulation(externalPredictors, riskFactors, population) {
  // Update the current getQx with the cause deleted Qx value so that the
  // LE method uses it in it's call
  var oldGetQx = this['getQx'];
  this['getQx'] = _causeDeletedLe.getCauseDeletedQx.bind(this, externalPredictors, riskFactors);
  var causeDeletedLE = this.calculateForPopulation(population);
  this['getQx'] = oldGetQx;
  return causeDeletedLE;
}
//# sourceMappingURL=cause-deleted-abridged-le.js.map