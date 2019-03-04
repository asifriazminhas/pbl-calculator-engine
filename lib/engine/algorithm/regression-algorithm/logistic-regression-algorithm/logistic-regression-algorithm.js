"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var regression_algorithm_1 = require("../regression-algorithm");

var LogsiticRegressionAlgorithm =
/*#__PURE__*/
function (_regression_algorithm) {
  _inherits(LogsiticRegressionAlgorithm, _regression_algorithm);

  function LogsiticRegressionAlgorithm() {
    _classCallCheck(this, LogsiticRegressionAlgorithm);

    return _possibleConstructorReturn(this, _getPrototypeOf(LogsiticRegressionAlgorithm).apply(this, arguments));
  }

  _createClass(LogsiticRegressionAlgorithm, [{
    key: "buildDataNameReport",
    value: function buildDataNameReport() {
      throw new Error(this.buildDataNameReport.name + ' is not implemented');
    }
  }, {
    key: "getRisk",
    value: function getRisk(data) {
      return this.evaluate(data);
    }
  }, {
    key: "evaluate",
    value: function evaluate(data) {
      var logit = this.calculateScore(data);
      var elogit = Math.exp(logit);
      return elogit / (1 + elogit);
    }
  }]);

  return LogsiticRegressionAlgorithm;
}(regression_algorithm_1.RegressionAlgorithm);

exports.LogsiticRegressionAlgorithm = LogsiticRegressionAlgorithm;
//# sourceMappingURL=logistic-regression-algorithm.js.map