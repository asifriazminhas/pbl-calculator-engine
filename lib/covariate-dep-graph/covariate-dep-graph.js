"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CovariateDepGraph = void 0;

var _dependencyGraph = require("dependency-graph");

var _v = _interopRequireDefault(require("uuid/v1"));

var _covariate = require("../engine/data-field/covariate/covariate");

var _derivedField = require("../engine/data-field/derived-field/derived-field");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var CovariateDepGraph = /*#__PURE__*/function (_DepGraph) {
  _inherits(CovariateDepGraph, _DepGraph);

  var _super = _createSuper(CovariateDepGraph);

  function CovariateDepGraph(covariate) {
    var _this;

    _classCallCheck(this, CovariateDepGraph);

    _this = _super.call(this);
    _this.covariateUuid = (0, _v.default)();

    _this.addNode(_this.covariateUuid, {
      field: covariate
    });

    _this.addNodesForCovariate(covariate, _this.covariateUuid);

    return _this;
  }

  _createClass(CovariateDepGraph, [{
    key: "addNodesForCovariate",
    value: function addNodesForCovariate(covariate, nodeUuid) {
      if (covariate.derivedField) {
        this.addNodesForDerivedField(covariate.derivedField, nodeUuid);
      } else if (covariate.customFunction) {
        var newNodeUuid = this.addNewField(covariate.customFunction.firstVariableCovariate);
        this.addDependency(nodeUuid, newNodeUuid);
        this.addNodesForCovariate(covariate.customFunction.firstVariableCovariate, newNodeUuid);
      }
    }
  }, {
    key: "addNodesForDerivedField",
    value: function addNodesForDerivedField(derivedField, nodeUuid) {
      var _this2 = this;

      derivedField.derivedFrom.forEach(function (derivedFromField) {
        var newNodeUuid = _this2.addNewField(derivedFromField);

        _this2.addDependency(nodeUuid, newNodeUuid);

        if (derivedFromField instanceof _derivedField.DerivedField) {
          _this2.addNodesForDerivedField(derivedFromField, newNodeUuid);
        } else if (derivedFromField instanceof _covariate.Covariate) {
          _this2.addNodesForCovariate(derivedFromField, newNodeUuid);
        }
      });
    }
  }, {
    key: "addNewField",
    value: function addNewField(field) {
      var fieldNodeUuid = (0, _v.default)();
      this.addNode(fieldNodeUuid, {
        field: field
      });
      return fieldNodeUuid;
    }
  }]);

  return CovariateDepGraph;
}(_dependencyGraph.DepGraph);

exports.CovariateDepGraph = CovariateDepGraph;
//# sourceMappingURL=covariate-dep-graph.js.map