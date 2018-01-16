import { JsonModelTypes } from '../model/json-model-types';
import { ModelType } from '../model/model-type';
import { AlgorithmJsonTypes } from '../algorithm/algorithm-json-types';
import {
    ILiteralAST,
    ICallExpressionAST,
    IIdentifierAST,
    IMemberExpressionAST,
    IObjectExpressionAst,
} from './interfaces/ast';
// tslint:disable-next-line
const astTypes = require('ast-types');
import { parseScript } from 'esprima';
import { IAlgorithmJson } from '../algorithm/algorithm-json';

function isUserFunctionsFunctionCall(node: ICallExpressionAST) {
    return (
        node.callee.type === 'MemberExpression' &&
        node.callee.object.name === 'userFunctions'
    );
}

function getUserFunctionNameFromCallExpressionAst(node: ICallExpressionAST) {
    return ((node.callee as IMemberExpressionAST).property as ILiteralAST)
        .value as string;
}

function getTableColumnsUsedFromTableCallExpression(
    tableCallExpressionAst: ICallExpressionAST,
) {
    const outputColumn = (tableCallExpressionAst.arguments[1] as ILiteralAST)
        .value as string;
    const otherColumns = (tableCallExpressionAst
        .arguments[2] as IObjectExpressionAst).properties.map(property => {
        return property.key.value as string;
    });

    return otherColumns.concat(outputColumn);
}

function optimizeTables(
    algorithm: AlgorithmJsonTypes,
): IAlgorithmJson<any>['tables'] {
    return Object.keys(
        algorithm.tables,
    ).reduce((newTables, currentTableName) => {
        const table = algorithm.tables[currentTableName];

        let tableColumnsUsed: string[] = [];

        algorithm.derivedFields.forEach(derivedField => {
            astTypes.visit(parseScript(derivedField.equation), {
                // tslint:disable-next-line
                visitCallExpression: function(path: {
                    value: ICallExpressionAST;
                }) {
                    /* Check if the method call is one which returns values from a table */
                    if (
                        (path.value.callee as IIdentifierAST).name ===
                            'getValueFromTable' &&
                        ((path.value.arguments[0] as IMemberExpressionAST)
                            .property as ILiteralAST).value === currentTableName
                    ) {
                        const tableColummsUsedForCurrentTableCall = getTableColumnsUsedFromTableCallExpression(
                            path.value,
                        );

                        tableColumnsUsed = tableColumnsUsed.concat(
                            tableColummsUsedForCurrentTableCall.filter(
                                tableColumn => {
                                    return tableColumnsUsed.find(
                                        tableColumnUsed => {
                                            return (
                                                tableColumnUsed === tableColumn
                                            );
                                        },
                                    )
                                        ? false
                                        : true;
                                },
                            ),
                        );

                        return false;
                    }

                    return this.traverse(path);
                },
            });
        });

        return Object.assign({}, newTables, {
            [currentTableName]: table.map(tableRow => {
                return tableColumnsUsed.reduce(
                    (newTableRow, tableColumnUsed) => {
                        return Object.assign({}, newTableRow, {
                            [tableColumnUsed]: tableRow[tableColumnUsed],
                        });
                    },
                    {},
                );
            }),
        });
    }, {});
}

function optimizeUserFunctions(
    algorithm: AlgorithmJsonTypes,
): IAlgorithmJson<any>['userFunctions'] {
    return Object.keys(algorithm.userFunctions)
        .filter(userFunctionNameToCheck => {
            let isUserFunctionUsed: boolean = false;

            algorithm.derivedFields.forEach(derivedField => {
                astTypes.visit(parseScript(derivedField.equation), {
                    // tslint:disable-next-line
                    visitCallExpression: function(path: {
                        value: ICallExpressionAST;
                    }) {
                        if (isUserFunctionsFunctionCall(path.value)) {
                            if (
                                getUserFunctionNameFromCallExpressionAst(
                                    path.value,
                                ) === userFunctionNameToCheck
                            ) {
                                isUserFunctionUsed = true;
                                return false;
                            }
                        }

                        return this.traverse(path);
                    },
                });
            });
            Object.keys(algorithm.userFunctions).forEach(userFunctionName => {
                astTypes.visit(
                    parseScript(algorithm.userFunctions[userFunctionName]),
                    {
                        // tslint:disable-next-line
                        visitCallExpression: function(path: {
                            value: ICallExpressionAST;
                        }) {
                            if (isUserFunctionsFunctionCall(path.value)) {
                                if (
                                    getUserFunctionNameFromCallExpressionAst(
                                        path.value,
                                    ) === userFunctionNameToCheck
                                ) {
                                    isUserFunctionUsed = true;
                                    return false;
                                }
                            }

                            return this.traverse(path);
                        },
                    },
                );
            });

            return isUserFunctionUsed;
        })
        .reduce((optimizedUserFunctions, userFunctionName) => {
            return Object.assign({}, optimizedUserFunctions, {
                [userFunctionName]: algorithm.userFunctions[userFunctionName],
            });
        }, {});
}

function optimizeAlgorithm(algorithm: AlgorithmJsonTypes): AlgorithmJsonTypes {
    return Object.assign({}, algorithm, {
        tables: optimizeTables(algorithm),
        userFunctions: optimizeUserFunctions(algorithm),
    });
}

export function optimizeModel(model: JsonModelTypes): JsonModelTypes {
    if (model.modelType === ModelType.SingleAlgorithm) {
        return Object.assign({}, model, {
            algorithm: optimizeAlgorithm(model.algorithm),
        });
    } else {
        return Object.assign({}, model, {
            algorithms: model.algorithms.map(algorithmAndPredicate => {
                return Object.assign({}, algorithmAndPredicate, {
                    algorithm: optimizeAlgorithm(
                        algorithmAndPredicate.algorithm,
                    ),
                });
            }),
        });
    }
}
