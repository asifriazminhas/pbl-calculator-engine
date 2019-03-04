"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var xmlbuilder_1 = require("../../util/xmlbuilder");

var Pmml =
/*#__PURE__*/
function () {
  function Pmml(pmmlXml) {
    _classCallCheck(this, Pmml);

    this.pmmlXml = pmmlXml;
  }

  _createClass(Pmml, [{
    key: "findDataFieldWithName",
    value: function findDataFieldWithName(dataFieldName) {
      return this.pmmlXml.PMML.DataDictionary ? this.pmmlXml.PMML.DataDictionary.DataField ? this.pmmlXml.PMML.DataDictionary.DataField.find(function (dataField) {
        return dataField.$.name === dataFieldName;
      }) : undefined : undefined;
    }
  }, {
    key: "findParameterWithLabel",
    value: function findParameterWithLabel(parameterLabel) {
      return this.pmmlXml.PMML.GeneralRegressionModel.ParameterList.Parameter.find(function (parameter) {
        return parameter.$.label === parameterLabel;
      });
    }
  }, {
    key: "findPCellWithParameterName",
    value: function findPCellWithParameterName(parameterName) {
      return this.pmmlXml.PMML.GeneralRegressionModel.ParamMatrix.PCell.find(function (pCell) {
        return pCell.$.parameterName === parameterName;
      });
    }
  }, {
    key: "findDerivedFieldWithName",
    value: function findDerivedFieldWithName(derivedFieldName) {
      var DerivedField = this.pmmlXml.PMML.LocalTransformations.DerivedField;
      return DerivedField instanceof Array ? DerivedField.find(function (derivedField) {
        return derivedField.$.name === derivedFieldName;
      }) : DerivedField.$.name === derivedFieldName ? DerivedField : undefined;
    }
  }, {
    key: "toString",
    value: function toString() {
      return xmlbuilder_1.buildXmlFromXml2JsObject({
        PMML: this.pmmlXml.PMML
      }).end({
        pretty: true
      });
    }
  }]);

  return Pmml;
}();

exports.Pmml = Pmml;
//# sourceMappingURL=pmml.js.map