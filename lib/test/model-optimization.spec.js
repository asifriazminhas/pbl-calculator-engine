"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var test = require("tape");

var chai_1 = require("chai");

var lodash_1 = require("lodash");

var optimizations_1 = require("../parsers/pmml-to-json-parser/optimizations");

var time_metric_1 = require("../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric");

function doRemoveUnsedColumnsAsertions(actualOptimizedAlgorithmJson, tables, t) {
  // tslint:disable-next-line
  var actualTableOneRows = actualOptimizedAlgorithmJson.tables['tableOne']; // tslint:disable-next-line

  var actualTableTwoRows = actualOptimizedAlgorithmJson.tables['tableTwo'];
  actualTableOneRows.forEach(function (tableOneRow, index) {
    chai_1.expect(tableOneRow).to.deep.equal( // tslint:disable-next-line
    lodash_1.omit(tables['tableOne'][index], 'columnTwo'));
  });
  actualTableTwoRows.forEach(function (tableTwoRow, index) {
    chai_1.expect(tableTwoRow).to.deep.equal( // tslint:disable-next-line
    lodash_1.omit(tables['tableTwo'][index], 'columnOne'));
  });
  t.pass("Not used columns were correctly removed from both tables");
}

function doRemoveUnusedFunctionsAssertions(optimizedAlgorithm, userFunctions, t) {
  chai_1.expect(optimizedAlgorithm.userFunctions).to.deep.equal(lodash_1.omit(userFunctions, 'testFunctionTwo'));
  t.pass("userFunctions correctly optimized");
}

test("Model optimizations", function (t) {
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
    metadata: metadata
  }, {
    // tslint:disable-next-line
    equation: "derived = getValueFromTable(tables['tableTwo'], 'outputColumn', { 'columnTwo': 'Age_cont' });",
    derivedFrom: [],
    name: 'derivedFieldTwo',
    isRequired: false,
    metadata: metadata
  }, {
    equation: "derived = userFunctions['testFunctionOne']()",
    derivedFrom: [],
    name: 'derivedFieldThree',
    isRequired: false,
    metadata: metadata
  }];
  var AlgorithmJson = {
    name: '',
    derivedFields: DerivedFields,
    userFunctions: UserFunctions,
    tables: Tables,
    covariates: [],
    baseline: [],
    timeMetric: time_metric_1.TimeMetric.Years,
    maximumTime: 5
  };
  t.test("Testing single algorithm model", function (t) {
    var singleAlgorithmModelJson = {
      name: '',
      algorithms: [{
        algorithm: AlgorithmJson,
        predicate: {
          equation: 'true',
          variables: []
        }
      }]
    };
    var optimizedSingleAlgorithmModelJson = optimizations_1.optimizeModel(singleAlgorithmModelJson);
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
    var optimizedMultipleAlgorithmModelJson = optimizations_1.optimizeModel(multipleAlgorithmModelJson);
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