import {
    ILiteralAST,
    ICallExpressionAST,
    IMemberExpressionAST,
    IObjectExpressionAst,
} from './interfaces/ast';
// tslint:disable-next-line
const astTypes = require('ast-types');
import { parseScript } from 'esprima';
import { ITables } from '../../engine/algorithm/tables/tables';
import { IUserFunctions } from '../../engine/algorithm/user-functions/user-functions';
import { IModelJson } from '../../parsers/json/json-model';
import { JsonAlgorithms } from '../json/json-algorithms';

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

function isGetValueFromTableCall(ast: ICallExpressionAST) {
    if (ast.callee.type === 'MemberExpression') {
        if (ast.callee.property.type === 'Literal') {
            if (ast.callee.property.value === 'getValueFromTable') {
                return true;
            }
        }
    }

    return false;
}

function optimizeTables(algorithm: JsonAlgorithms): ITables {
    return Object.keys(algorithm.tables).reduce(
        (newTables, currentTableName) => {
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
                            isGetValueFromTableCall(path.value) &&
                            ((path.value.arguments[0] as IMemberExpressionAST)
                                .property as ILiteralAST).value ===
                                currentTableName
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
                                                    tableColumnUsed ===
                                                    tableColumn
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
        },
        {},
    );
}

function optimizeUserFunctions(algorithm: JsonAlgorithms): IUserFunctions {
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

function optimizeAlgorithm(algorithm: JsonAlgorithms): JsonAlgorithms {
    return Object.assign({}, algorithm, {
        tables: optimizeTables(algorithm),
        userFunctions: optimizeUserFunctions(algorithm),
    });
}

export function optimizeModel<T extends JsonAlgorithms>(
    model: IModelJson<T>,
): IModelJson<T> {
    return Object.assign({}, model, {
        algorithms: model.algorithms.map(algorithm => {
            return Object.assign({}, algorithm, {
                algorithm: optimizeAlgorithm(algorithm.algorithm),
            });
        }),
    });
}
