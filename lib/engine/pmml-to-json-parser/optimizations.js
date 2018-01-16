"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_type_1 = require("../model/model-type");
// tslint:disable-next-line
const astTypes = require('ast-types');
const esprima_1 = require("esprima");
function isUserFunctionsFunctionCall(node) {
    return (node.callee.type === 'MemberExpression' &&
        node.callee.object.name === 'userFunctions');
}
function getUserFunctionNameFromCallExpressionAst(node) {
    return node.callee.property
        .value;
}
function getTableColumnsUsedFromTableCallExpression(tableCallExpressionAst) {
    const outputColumn = tableCallExpressionAst.arguments[1]
        .value;
    const otherColumns = tableCallExpressionAst
        .arguments[2].properties.map(property => {
        return property.key.value;
    });
    return otherColumns.concat(outputColumn);
}
function optimizeTables(algorithm) {
    return Object.keys(algorithm.tables).reduce((newTables, currentTableName) => {
        const table = algorithm.tables[currentTableName];
        let tableColumnsUsed = [];
        algorithm.derivedFields.forEach(derivedField => {
            astTypes.visit(esprima_1.parseScript(derivedField.equation), {
                // tslint:disable-next-line
                visitCallExpression: function (path) {
                    /* Check if the method call is one which returns values from a table */
                    if (path.value.callee.name ===
                        'getValueFromTable' &&
                        path.value.arguments[0]
                            .property.value === currentTableName) {
                        const tableColummsUsedForCurrentTableCall = getTableColumnsUsedFromTableCallExpression(path.value);
                        tableColumnsUsed = tableColumnsUsed.concat(tableColummsUsedForCurrentTableCall.filter(tableColumn => {
                            return tableColumnsUsed.find(tableColumnUsed => {
                                return (tableColumnUsed === tableColumn);
                            })
                                ? false
                                : true;
                        }));
                        return false;
                    }
                    return this.traverse(path);
                },
            });
        });
        return Object.assign({}, newTables, {
            [currentTableName]: table.map(tableRow => {
                return tableColumnsUsed.reduce((newTableRow, tableColumnUsed) => {
                    return Object.assign({}, newTableRow, {
                        [tableColumnUsed]: tableRow[tableColumnUsed],
                    });
                }, {});
            }),
        });
    }, {});
}
function optimizeUserFunctions(algorithm) {
    return Object.keys(algorithm.userFunctions)
        .filter(userFunctionNameToCheck => {
        let isUserFunctionUsed = false;
        algorithm.derivedFields.forEach(derivedField => {
            astTypes.visit(esprima_1.parseScript(derivedField.equation), {
                // tslint:disable-next-line
                visitCallExpression: function (path) {
                    if (isUserFunctionsFunctionCall(path.value)) {
                        if (getUserFunctionNameFromCallExpressionAst(path.value) === userFunctionNameToCheck) {
                            isUserFunctionUsed = true;
                            return false;
                        }
                    }
                    return this.traverse(path);
                },
            });
        });
        Object.keys(algorithm.userFunctions).forEach(userFunctionName => {
            astTypes.visit(esprima_1.parseScript(algorithm.userFunctions[userFunctionName]), {
                // tslint:disable-next-line
                visitCallExpression: function (path) {
                    if (isUserFunctionsFunctionCall(path.value)) {
                        if (getUserFunctionNameFromCallExpressionAst(path.value) === userFunctionNameToCheck) {
                            isUserFunctionUsed = true;
                            return false;
                        }
                    }
                    return this.traverse(path);
                },
            });
        });
        return isUserFunctionUsed;
    })
        .reduce((optimizedUserFunctions, userFunctionName) => {
        return Object.assign({}, optimizedUserFunctions, {
            [userFunctionName]: algorithm.userFunctions[userFunctionName],
        });
    }, {});
}
function optimizeAlgorithm(algorithm) {
    return Object.assign({}, algorithm, {
        tables: optimizeTables(algorithm),
        userFunctions: optimizeUserFunctions(algorithm),
    });
}
function optimizeModel(model) {
    if (model.modelType === model_type_1.ModelType.SingleAlgorithm) {
        return Object.assign({}, model, {
            algorithm: optimizeAlgorithm(model.algorithm),
        });
    }
    else {
        return Object.assign({}, model, {
            algorithms: model.algorithms.map(algorithmAndPredicate => {
                return Object.assign({}, algorithmAndPredicate, {
                    algorithm: optimizeAlgorithm(algorithmAndPredicate.algorithm),
                });
            }),
        });
    }
}
exports.optimizeModel = optimizeModel;
//# sourceMappingURL=optimizations.js.map