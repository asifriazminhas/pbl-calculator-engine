"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _omit2 = _interopRequireDefault(require("lodash/omit"));

var test = _interopRequireWildcard(require("tape"));

var _chai = require("chai");

var _optimizations = require("../parsers/pmml-to-json-parser/optimizations");

var _timeMetric = require("../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric");

var _algorithmType = require("../parsers/json/algorithm-type");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doRemoveUnsedColumnsAsertions(actualOptimizedAlgorithmJson, tables, t) {
  // tslint:disable-next-line
  var actualTableOneRows = actualOptimizedAlgorithmJson.tables['tableOne']; // tslint:disable-next-line

  var actualTableTwoRows = actualOptimizedAlgorithmJson.tables['tableTwo'];
  actualTableOneRows.forEach(function (tableOneRow, index) {
    (0, _chai.expect)(tableOneRow).to.deep.equal( // tslint:disable-next-line
    (0, _omit2.default)(tables['tableOne'][index], 'columnTwo'));
  });
  actualTableTwoRows.forEach(function (tableTwoRow, index) {
    (0, _chai.expect)(tableTwoRow).to.deep.equal( // tslint:disable-next-line
    (0, _omit2.default)(tables['tableTwo'][index], 'columnOne'));
  });
  t.pass("Not used columns were correctly removed from both tables");
}

function doRemoveUnusedFunctionsAssertions(optimizedAlgorithm, userFunctions, t) {
  (0, _chai.expect)(optimizedAlgorithm.userFunctions).to.deep.equal((0, _omit2.default)(userFunctions, 'testFunctionTwo'));
  t.pass("userFunctions correctly optimized");
}

test.skip("Model optimizations", function (t) {
  var Tables = {
    tableOne: [{
      outputColumn: Math.random() + '',
      columnOne: Math.random() + '',
      columnTwo: Math.random() + ''
    }, {
      outputColumn: Math.random() + '',
      columnOne: Math.random() + '',
      columnTwo: Math.random() + ''
    }],
    tableTwo: [{
      outputColumn: Math.random() + '',
      columnOne: Math.random() + '',
      columnTwo: Math.random() + ''
    }, {
      outputColumn: Math.random() + '',
      columnOne: Math.random() + '',
      columnTwo: Math.random() + ''
    }]
  };
  var UserFunctions = {
    /* This function should be kept since derivedFieldThree depends on it */
    testFunctionOne: "userFunctions[\"testFunctionOne\"] = (function() {userFunctions[\"testFunctionThree\"]()})",

    /* This function should be removed since no derived fields or user functions depend on it */
    testFunctionTwo: '',

    /* This function should be kept since testFunctionOne depends on it*/
    testFunctionThree: ''
  };
  var metadata = {
    label: '',
    shortLabel: ''
  };
  var DerivedFields = [{
    // tslint:disable-next-line
    equation: "derived = getValueFromTable(tables['tableOne'], 'outputColumn', { 'columnOne': 'Age_cont' });",
    derivedFrom: [],
    name: 'derivedFieldOne',
    isRequired: false,
    isRecommended: false,
    metadata: metadata
  }, {
    // tslint:disable-next-line
    equation: "derived = getValueFromTable(tables['tableTwo'], 'outputColumn', { 'columnTwo': 'Age_cont' });",
    derivedFrom: [],
    name: 'derivedFieldTwo',
    isRequired: false,
    isRecommended: false,
    metadata: metadata
  }, {
    equation: "derived = userFunctions['testFunctionOne']()",
    derivedFrom: [],
    name: 'derivedFieldThree',
    isRequired: false,
    isRecommended: false,
    metadata: metadata
  }];
  var AlgorithmJson = {
    algorithmType: _algorithmType.AlgorithmType.CoxSurvivalAlgorithm,
    name: '',
    derivedFields: DerivedFields,
    userFunctions: UserFunctions,
    tables: Tables,
    covariates: [],
    baseline: [],
    timeMetric: _timeMetric.TimeMetric.Years,
    maximumTime: 5
  };
  t.test("Testing single algorithm model", function (t) {
    var singleAlgorithmModelJson = {
      modelFields: [],
      name: '',
      algorithms: [{
        algorithm: AlgorithmJson,
        predicate: {
          equation: 'true',
          variables: []
        }
      }]
    };
    var optimizedSingleAlgorithmModelJson = (0, _optimizations.optimizeModel)(singleAlgorithmModelJson);
    t.test("Removing unused columns from table", function (t) {
      doRemoveUnsedColumnsAsertions(optimizedSingleAlgorithmModelJson.algorithms[0].algorithm, Tables, t);
      t.end();
    });
    t.test("Removing unused functions", function (t) {
      doRemoveUnusedFunctionsAssertions(optimizedSingleAlgorithmModelJson.algorithms[0].algorithm, UserFunctions, t);
      t.end();
    });
  });
  t.test("Testing multiple algorithm model", function (t) {
    var multipleAlgorithmModelJson = {
      modelFields: [],
      name: '',
      algorithms: [{
        algorithm: AlgorithmJson,
        predicate: {
          equation: '',
          variables: []
        }
      }, {
        algorithm: AlgorithmJson,
        predicate: {
          equation: '',
          variables: []
        }
      }]
    };
    var optimizedMultipleAlgorithmModelJson = (0, _optimizations.optimizeModel)(multipleAlgorithmModelJson);
    t.test("Removing unused columns", function (t) {
      optimizedMultipleAlgorithmModelJson.algorithms.forEach(function (algorithm) {
        doRemoveUnsedColumnsAsertions(algorithm.algorithm, Tables, t);
      });
      t.end();
    });
    t.test("Removing unused user functions", function (t) {
      optimizedMultipleAlgorithmModelJson.algorithms.forEach(function (algorithm) {
        return doRemoveUnusedFunctionsAssertions(algorithm.algorithm, UserFunctions, t);
      });
      t.end();
    });
  });
});
//# sourceMappingURL=model-optimization.spec.js.map