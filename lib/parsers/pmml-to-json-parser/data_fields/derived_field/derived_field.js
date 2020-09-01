"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDerivedFields = parseDerivedFields;

var escodegen = _interopRequireWildcard(require("escodegen"));

var _node_parser = require("./node_parser");

var _data_field = require("../data_field");

var _dataFieldType = require("../../../../parsers/json/data-field-type");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// tslint:disable-next-line
var astTypes = require('ast-types');

function getAstForDerivedField(derivedField, userDefinedFunctionNames) {
  var right = null;

  if (derivedField.Apply) {
    right = (0, _node_parser.getASTForApply)(derivedField.Apply, userDefinedFunctionNames, true);
  } else if (derivedField.Constant) {
    right = (0, _node_parser.getASTForConstant)(derivedField.Constant);
  } else if (derivedField.FieldRef) {
    right = (0, _node_parser.getASTForFieldRef)(derivedField.FieldRef, true);
  } else if (derivedField.MapValues) {
    right = (0, _node_parser.getAstForMapValues)(derivedField.MapValues, false);
  } else {
    throw new Error("Unknown root node in derived field");
  } // Make the line of code 'var {derivedFieldName};'


  var declarationAst = {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'Identifier',
        name: 'derived'
      },
      right: right
    }
  };
  return declarationAst;
}

function getDerivedFromForAst(ast, pmml) {
  var derivedFrom = [];
  var ObjIdentifier = 'obj';
  var IdentifiersToNotInclude = ['derived', 'func', ObjIdentifier, 'NA', 'userFunctions', 'tables', 'getValueFromTable', 'undefined'];
  astTypes.visit(ast, {
    // Code like obj['age'] is a MemberExpression so to extract for example age we need to visit them
    visitMemberExpression: function visitMemberExpression(path) {
      // Check whether the AST represents accessing a property of a variable called 'obj'
      if (path.node.object.name === ObjIdentifier) {
        // The name of the field being accessed on obj
        var objectPropertyName = path.node.property.value; // Check whether it is NA

        if (IdentifiersToNotInclude.indexOf(objectPropertyName) === -1) {
          derivedFrom.push(objectPropertyName);
        }
      }

      this.traverse(path);
    },
    visitIdentifier: function visitIdentifier(path) {
      var variableName = path.node.name;

      if (IdentifiersToNotInclude.indexOf(variableName) === -1) {
        derivedFrom.push(variableName);
      }

      this.traverse(path);
    }
  });
  return derivedFrom // Remove duplicates
  .filter(function (derivedFromItem, index, currentDerivedFrom) {
    return currentDerivedFrom.indexOf(derivedFromItem) === index;
  })
  /* Depending on whether we find a DerivedField for the current
  derivedFromItem return iteself or a DataField based on it */
  .map(function (derivedFromItem) {
    var derivedFieldForCurrentDerivedFrom = pmml.findDerivedFieldWithName(derivedFromItem);
    var covariateForCurrentDerivedFrom;

    if (pmml.pmmlXml.PMML.GeneralRegressionModel) {
      // tslint:disable-next-line:max-line-length
      covariateForCurrentDerivedFrom = pmml.pmmlXml.PMML.GeneralRegressionModel.CovariateList.Predictor.find(function (predictor) {
        return predictor.$.name === derivedFromItem;
      });
    }

    if (covariateForCurrentDerivedFrom) {
      return derivedFromItem;
    } else if (derivedFieldForCurrentDerivedFrom) {
      return derivedFromItem;
    } else {
      var dataFieldForCurrentDerivedField = pmml.findDataFieldWithName(derivedFromItem);

      if (dataFieldForCurrentDerivedField) {
        return Object.assign({}, (0, _data_field.parseDataFieldFromDataFieldPmmlNode)(dataFieldForCurrentDerivedField, undefined), {
          fieldType: _dataFieldType.DataFieldType.DataField
        });
      } else {
        return {
          fieldType: _dataFieldType.DataFieldType.DataField,
          name: derivedFromItem,
          extensions: {},
          isRequired: false,
          isRecommended: false,
          metadata: {
            label: '',
            shortLabel: ''
          }
        };
      }
    }
  });
}

function parseDerivedFields(pmml, userDefinedFunctionNames) {
  if (pmml.pmmlXml.PMML.LocalTransformations.DerivedField) {
    var DerivedField = pmml.pmmlXml.PMML.LocalTransformations.DerivedField instanceof Array ? pmml.pmmlXml.PMML.LocalTransformations.DerivedField : [pmml.pmmlXml.PMML.LocalTransformations.DerivedField]; // All the derived predictors for this algorithm

    return DerivedField.map(function (derivedField) {
      var dataFieldForCurrentDerivedField = pmml.findDataFieldWithName(derivedField.$.name);
      var ast = getAstForDerivedField(derivedField, userDefinedFunctionNames);
      return Object.assign({
        fieldType: _dataFieldType.DataFieldType.DerivedField,
        name: derivedField.$.name,
        equation: escodegen.generate(ast),
        derivedFrom: getDerivedFromForAst(ast, pmml),
        extensions: {},
        isRequired: false,
        isRecommended: false
      }, dataFieldForCurrentDerivedField ? (0, _data_field.parseDataFieldFromDataFieldPmmlNode)(dataFieldForCurrentDerivedField, undefined) : {
        metadata: {
          label: '',
          shortLabel: ''
        }
      }, {
        fieldType: _dataFieldType.DataFieldType.DerivedField
      });
    });
  } else {
    return [];
  }
}
//# sourceMappingURL=derived_field.js.map