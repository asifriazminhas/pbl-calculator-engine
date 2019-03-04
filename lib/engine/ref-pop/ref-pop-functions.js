"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var health_age_1 = require("./health-age");

var predicate_1 = require("../predicate/predicate");

var predicate_errors_1 = require("../predicate/predicate-errors");

var RefPopFunctions = function RefPopFunctions(model, refPop) {
  var _this = this;

  _classCallCheck(this, RefPopFunctions);

  this.getHealthAge = function (data) {
    var refPopToUse;

    if (_this.refPop[0].predicate) {
      try {
        refPopToUse = predicate_1.Predicate.getFirstTruePredicateObject(_this.refPop.map(function (currentRefProp) {
          return Object.assign({}, currentRefProp, {
            predicate: new predicate_1.Predicate(currentRefProp.predicate.equation, currentRefProp.predicate.variables)
          });
        }), data).refPop;
      } catch (err) {
        if (err instanceof predicate_errors_1.NoPredicateObjectFoundError) {
          throw new Error("No matched ref pop found for data ".concat(JSON.stringify(data, null, 2)));
        }

        throw err;
      }
    } else {
      refPopToUse = _this.refPop;
    }

    return health_age_1.getHealthAge(refPopToUse, data, _this.model.getAlgorithmForData(data));
  };

  this.model = model;
  this.refPop = refPop;
};

exports.RefPopFunctions = RefPopFunctions;
//# sourceMappingURL=ref-pop-functions.js.map