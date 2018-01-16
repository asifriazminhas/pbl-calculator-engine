"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const optimizations_1 = require("../engine/pmml-to-json-parser/optimizations");
const algorithm_type_1 = require("../engine/algorithm/algorithm-type");
const field_type_1 = require("../engine/field/field-type");
const model_type_1 = require("../engine/model/model-type");
function doRemoveUnsedColumnsAsertions(actualOptimizedAlgorithmJson, tables, t) {
    // tslint:disable-next-line
    const actualTableOneRows = actualOptimizedAlgorithmJson.tables['tableOne'];
    // tslint:disable-next-line
    const actualTableTwoRows = actualOptimizedAlgorithmJson.tables['tableTwo'];
    actualTableOneRows.forEach((tableOneRow, index) => {
        chai_1.expect(tableOneRow).to.deep.equal(
        // tslint:disable-next-line
        lodash_1.omit(tables['tableOne'][index], 'columnTwo'));
    });
    actualTableTwoRows.forEach((tableTwoRow, index) => {
        chai_1.expect(tableTwoRow).to.deep.equal(
        // tslint:disable-next-line
        lodash_1.omit(tables['tableTwo'][index], 'columnOne'));
    });
    t.pass(`Not used columns were correctly removed from both tables`);
}
function doRemoveUnusedFunctionsAssertions(optimizedAlgorithm, userFunctions, t) {
    chai_1.expect(optimizedAlgorithm.userFunctions).to.deep.equal(lodash_1.omit(userFunctions, 'testFunctionTwo'));
    t.pass(`userFunctions correctly optimized`);
}
test(`Model optimizations`, t => {
    const Tables = {
        tableOne: [
            {
                outputColumn: Math.random() + '',
                columnOne: Math.random() + '',
                columnTwo: Math.random() + '',
            },
            {
                outputColumn: Math.random() + '',
                columnOne: Math.random() + '',
                columnTwo: Math.random() + '',
            },
        ],
        tableTwo: [
            {
                outputColumn: Math.random() + '',
                columnOne: Math.random() + '',
                columnTwo: Math.random() + '',
            },
            {
                outputColumn: Math.random() + '',
                columnOne: Math.random() + '',
                columnTwo: Math.random() + '',
            },
        ],
    };
    const UserFunctions = {
        /* This function should be kept since derivedFieldThree depends on it */
        testFunctionOne: `userFunctions["testFunctionOne"] = (function() {userFunctions["testFunctionThree"]()})`,
        /* This function should be removed since no derived fields or user functions depend on it */
        testFunctionTwo: '',
        /* This function should be kept since testFunctionOne depends on it*/
        testFunctionThree: '',
    };
    const DerivedFields = [
        {
            fieldType: field_type_1.FieldType.DerivedField,
            // tslint:disable-next-line
            equation: `derived = getValueFromTable(tables['tableOne'], 'outputColumn', { 'columnOne': 'Age_cont' });`,
            derivedFrom: [],
            name: 'derivedFieldOne',
            displayName: '',
            extensions: {},
        },
        {
            fieldType: field_type_1.FieldType.DerivedField,
            // tslint:disable-next-line
            equation: `derived = getValueFromTable(tables['tableTwo'], 'outputColumn', { 'columnTwo': 'Age_cont' });`,
            derivedFrom: [],
            name: 'derivedFieldTwo',
            displayName: '',
            extensions: {},
        },
        {
            fieldType: field_type_1.FieldType.DerivedField,
            equation: `derived = userFunctions['testFunctionOne']()`,
            derivedFrom: [],
            name: 'derivedFieldThree',
            displayName: '',
            extensions: {},
        },
    ];
    const AlgorithmJson = {
        name: '',
        algorithmType: algorithm_type_1.AlgorithmType.SimpleAlgorithm,
        derivedFields: DerivedFields,
        version: '',
        description: '',
        userFunctions: UserFunctions,
        tables: Tables,
        output: '',
    };
    t.test(`Testing single algorithm model`, t => {
        const singleAlgorithmModelJson = {
            modelType: model_type_1.ModelType.SingleAlgorithm,
            algorithm: AlgorithmJson,
        };
        const optimizedSingleAlgorithmModelJson = optimizations_1.optimizeModel(singleAlgorithmModelJson);
        t.test(`Removing unused columns from table`, t => {
            doRemoveUnsedColumnsAsertions(optimizedSingleAlgorithmModelJson.algorithm, Tables, t);
            t.end();
        });
        t.test(`Removing unused functions`, t => {
            doRemoveUnusedFunctionsAssertions(optimizedSingleAlgorithmModelJson.algorithm, UserFunctions, t);
            t.end();
        });
    });
    t.test(`Testing multiple algorithm model`, t => {
        const multipleAlgorithmModelJson = {
            modelType: model_type_1.ModelType.MultipleAlgorithm,
            algorithms: [
                {
                    algorithm: AlgorithmJson,
                    predicate: {
                        equation: '',
                        variables: [],
                    },
                },
                {
                    algorithm: AlgorithmJson,
                    predicate: {
                        equation: '',
                        variables: [],
                    },
                },
            ],
        };
        const optimizedMultipleAlgorithmModelJson = optimizations_1.optimizeModel(multipleAlgorithmModelJson);
        t.test(`Removing unused columns`, t => {
            optimizedMultipleAlgorithmModelJson.algorithms.forEach(algorithm => {
                doRemoveUnsedColumnsAsertions(algorithm.algorithm, Tables, t);
            });
            t.end();
        });
        t.test(`Removing unused user functions`, t => {
            optimizedMultipleAlgorithmModelJson.algorithms.forEach(algorithm => doRemoveUnusedFunctionsAssertions(algorithm.algorithm, UserFunctions, t));
            t.end();
        });
    });
});
//# sourceMappingURL=model-optimization.spec.js.map