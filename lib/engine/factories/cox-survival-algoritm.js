"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoxFactory = void 0;

var _coxSurvivalAlgorithm = require("../algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CoxFactory = /*#__PURE__*/function () {
  function CoxFactory() {
    _classCallCheck(this, CoxFactory);
  }

  _createClass(CoxFactory, null, [{
    key: "extendCox",
    value: function extendCox(cox, additionalProperties) {
      return Object.setPrototypeOf(Object.assign({}, cox, additionalProperties), _coxSurvivalAlgorithm.CoxSurvivalAlgorithm.prototype);
    }
  }]);

  return CoxFactory;
}();

exports.CoxFactory = CoxFactory;
//# sourceMappingURL=cox-survival-algoritm.js.map