"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Predicate = void 0;

var _undefined = require("../../util/undefined/undefined");

var _predicateErrors = require("./predicate-errors");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Predicate = /*#__PURE__*/function () {
  function Predicate(equation, variables) {
    _classCallCheck(this, Predicate);

    this.equation = equation;
    this.variables = variables;
  } // tslint:disable-next-line:member-ordering


  _createClass(Predicate, [{
    key: "getPredicateResult",
    value: function getPredicateResult(data) {
      var _this = this;

      var obj = data.filter(function (datum) {
        return _this.variables.indexOf(datum.name) > -1;
      }).reduce(function (currentObj, currentDatum) {
        return Object.assign({}, currentObj, _defineProperty({}, currentDatum.name, currentDatum.coefficent));
      }, {}); // tslint:disable-next-line

      obj; // tslint:disable-next-line

      var predicateResult = false;
      eval(this.equation);
      return predicateResult;
    }
  }], [{
    key: "getFirstTruePredicateObject",
    value: function getFirstTruePredicateObject(predicateObjs, data) {
      return (0, _undefined.throwErrorIfUndefined)(predicateObjs.find(function (predicateObj) {
        return predicateObj.predicate.getPredicateResult(data);
      }), new _predicateErrors.NoPredicateObjectFoundError(data));
    }
  }]);

  return Predicate;
}();

exports.Predicate = Predicate;
//# sourceMappingURL=predicate.js.map