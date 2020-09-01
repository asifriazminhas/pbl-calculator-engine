"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RefPopFunctions = void 0;

var _healthAge = require("./health-age");

var _predicate = require("../predicate/predicate");

var _predicateErrors = require("../predicate/predicate-errors");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RefPopFunctions = function RefPopFunctions(model, refPop) {
  var _this = this;

  _classCallCheck(this, RefPopFunctions);

  this.getHealthAge = function (data) {
    var refPopToUse;

    if (_this.refPop[0].predicate) {
      try {
        refPopToUse = _predicate.Predicate.getFirstTruePredicateObject(_this.refPop.map(function (currentRefProp) {
          return Object.assign({}, currentRefProp, {
            predicate: new _predicate.Predicate(currentRefProp.predicate.equation, currentRefProp.predicate.variables)
          });
        }), data).refPop;
      } catch (err) {
        if (err instanceof _predicateErrors.NoPredicateObjectFoundError) {
          throw new Error("No matched ref pop found for data ".concat(JSON.stringify(data, null, 2)));
        }

        throw err;
      }
    } else {
      refPopToUse = _this.refPop;
    }

    return (0, _healthAge.getHealthAge)(refPopToUse, data, _this.model.getAlgorithmForData(data));
  };

  this.model = model;
  this.refPop = refPop;
};

exports.RefPopFunctions = RefPopFunctions;
//# sourceMappingURL=ref-pop-functions.js.map