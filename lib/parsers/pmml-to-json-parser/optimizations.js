"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
}); // tslint:disable-next-line

var astTypes = require('ast-types');

var esprima_1 = require("esprima");

function isUserFunctionsFunctionCall(node) {
  return node.callee.type === 'MemberExpression' && node.callee.object.name === 'userFunctions';
}

function getUserFunctionNameFromCallExpressionAst(node) {
  return node.callee.property.value;
}

function getTableColumnsUsedFromTableCallExpression(tableCallExpressionAst) {
  var outputColumn = tableCallExpressionAst.arguments[1].value;
  var otherColumns = tableCallExpressionAst.arguments[2].properties.map(function (property) {
    return property.key.value;
  });
  return otherColumns.concat(outputColumn);
}

function optimizeTables(algorithm) {
  return Object.keys(algorithm.tables).reduce(function (newTables, currentTableName) {
    var table = algorithm.tables[currentTableName];
    var tableColumnsUsed = [];
    algorithm.derivedFields.forEach(function (derivedField) {
      astTypes.visit(esprima_1.parseScript(derivedField.equation), {
        // tslint:disable-next-line
        visitCallExpression: function visitCallExpression(path) {
          /* Check if the method call is one which returns values from a table */
          if (path.value.callee.name === 'getValueFromTable' && path.value.arguments[0].property.value === currentTableName) {
            var tableColummsUsedForCurrentTableCall = getTableColumnsUsedFromTableCallExpression(path.value);
            tableColumnsUsed = tableColumnsUsed.concat(tableColummsUsedForCurrentTableCall.filter(function (tableColumn) {
              return tableColumnsUsed.find(function (tableColumnUsed) {
                return tableColumnUsed === tableColumn;
              }) ? false : true;
            }));
            return false;
          }

          return this.traverse(path);
        }
      });
    });
    return Object.assign({}, newTables, _defineProperty({}, currentTableName, table.map(function (tableRow) {
      return tableColumnsUsed.reduce(function (newTableRow, tableColumnUsed) {
        return Object.assign({}, newTableRow, _defineProperty({}, tableColumnUsed, tableRow[tableColumnUsed]));
      }, {});
    })));
  }, {});
}

function optimizeUserFunctions(algorithm) {
  return Object.keys(algorithm.userFunctions).filter(function (userFunctionNameToCheck) {
    var isUserFunctionUsed = false;
    algorithm.derivedFields.forEach(function (derivedField) {
      astTypes.visit(esprima_1.parseScript(derivedField.equation), {
        // tslint:disable-next-line
        visitCallExpression: function visitCallExpression(path) {
          if (isUserFunctionsFunctionCall(path.value)) {
            if (getUserFunctionNameFromCallExpressionAst(path.value) === userFunctionNameToCheck) {
              isUserFunctionUsed = true;
              return false;
            }
          }

          return this.traverse(path);
        }
      });
    });
    Object.keys(algorithm.userFunctions).forEach(function (userFunctionName) {
      astTypes.visit(esprima_1.parseScript(algorithm.userFunctions[userFunctionName]), {
        // tslint:disable-next-line
        visitCallExpression: function visitCallExpression(path) {
          if (isUserFunctionsFunctionCall(path.value)) {
            if (getUserFunctionNameFromCallExpressionAst(path.value) === userFunctionNameToCheck) {
              isUserFunctionUsed = true;
              return false;
            }
          }

          return this.traverse(path);
        }
      });
    });
    return isUserFunctionUsed;
  }).reduce(function (optimizedUserFunctions, userFunctionName) {
    return Object.assign({}, optimizedUserFunctions, _defineProperty({}, userFunctionName, algorithm.userFunctions[userFunctionName]));
  }, {});
}

function optimizeAlgorithm(algorithm) {
  return Object.assign({}, algorithm, {
    tables: optimizeTables(algorithm),
    userFunctions: optimizeUserFunctions(algorithm)
  });
}

function optimizeModel(model) {
  return Object.assign({}, model, {
    algorithms: model.algorithms.map(function (algorithm) {
      return Object.assign({}, algorithm, {
        algorithm: optimizeAlgorithm(algorithm.algorithm)
      });
    })
  });
}

exports.optimizeModel = optimizeModel;
//# sourceMappingURL=optimizations.js.map