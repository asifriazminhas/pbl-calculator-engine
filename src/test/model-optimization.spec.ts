import * as test from 'tape';
import { expect } from 'chai';
import { SingleAlgorithmModelJson } from '../engine/single-algorithm-model/single-algorithm-model-json';
import { omit } from 'lodash';
import { optimizeModel } from '../engine/pmml-to-json-parser/optimizations';
import { AlgorithmJsonTypes } from '../engine/algorithm/algorithm-json-types';
import { ISimpleAlgorithmJson } from '../engine/simple-algorithm/simple-algorithm-json';
import { AlgorithmType } from '../engine/algorithm/algorithm-type';
import { FieldType } from '../engine/field/field-type';
import { DerivedFieldJson } from '../engine/derived-field/json-derived-field/json-derived-field';
import { ModelType } from '../engine/model/model-type';
import { MultipleAlgorithmModelJson } from '../engine/multiple-algorithm-model/multiple-algorithm-model-json';

function doRemoveUnsedColumnsAsertions(
    actualOptimizedAlgorithmJson: AlgorithmJsonTypes,
    tables: { [index: string]: Array<{ [index: string]: string }> },
    t: test.Test,
) {
    // tslint:disable-next-line
    const actualTableOneRows = actualOptimizedAlgorithmJson.tables['tableOne'];
    // tslint:disable-next-line
    const actualTableTwoRows = actualOptimizedAlgorithmJson.tables['tableTwo'];

    actualTableOneRows.forEach((tableOneRow, index) => {
        expect(tableOneRow).to.deep.equal(
            // tslint:disable-next-line
            omit(tables['tableOne'][index], 'columnTwo'),
        );
    });
    actualTableTwoRows.forEach((tableTwoRow, index) => {
        expect(tableTwoRow).to.deep.equal(
            // tslint:disable-next-line
            omit(tables['tableTwo'][index], 'columnOne'),
        );
    });
    t.pass(`Not used columns were correctly removed from both tables`);
}

function doRemoveUnusedFunctionsAssertions(
    optimizedAlgorithm: AlgorithmJsonTypes,
    userFunctions: { [index: string]: string },
    t: test.Test,
) {
    expect(optimizedAlgorithm.userFunctions).to.deep.equal(
        omit(userFunctions, 'testFunctionTwo'),
    );
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

    const DerivedFields: DerivedFieldJson[] = [
        {
            fieldType: FieldType.DerivedField,
            // tslint:disable-next-line
            equation: `derived = getValueFromTable(tables['tableOne'], 'outputColumn', { 'columnOne': 'Age_cont' });`,
            derivedFrom: [],
            name: 'derivedFieldOne',
            displayName: '',
            extensions: {},
        },
        {
            fieldType: FieldType.DerivedField,
            // tslint:disable-next-line
            equation: `derived = getValueFromTable(tables['tableTwo'], 'outputColumn', { 'columnTwo': 'Age_cont' });`,
            derivedFrom: [],
            name: 'derivedFieldTwo',
            displayName: '',
            extensions: {},
        },
        {
            fieldType: FieldType.DerivedField,
            equation: `derived = userFunctions['testFunctionOne']()`,
            derivedFrom: [],
            name: 'derivedFieldThree',
            displayName: '',
            extensions: {},
        },
    ];

    const AlgorithmJson: ISimpleAlgorithmJson = {
        name: '',
        algorithmType: AlgorithmType.SimpleAlgorithm,
        derivedFields: DerivedFields,
        version: '',
        description: '',
        userFunctions: UserFunctions,
        tables: Tables,
        output: '',
    };

    t.test(`Testing single algorithm model`, t => {
        const singleAlgorithmModelJson: SingleAlgorithmModelJson = {
            modelType: ModelType.SingleAlgorithm,
            algorithm: AlgorithmJson,
        };

        const optimizedSingleAlgorithmModelJson = optimizeModel(
            singleAlgorithmModelJson,
        ) as SingleAlgorithmModelJson;

        t.test(`Removing unused columns from table`, t => {
            doRemoveUnsedColumnsAsertions(
                optimizedSingleAlgorithmModelJson.algorithm,
                Tables,
                t,
            );
            t.end();
        });

        t.test(`Removing unused functions`, t => {
            doRemoveUnusedFunctionsAssertions(
                optimizedSingleAlgorithmModelJson.algorithm,
                UserFunctions,
                t,
            );
            t.end();
        });
    });

    t.test(`Testing multiple algorithm model`, t => {
        const multipleAlgorithmModelJson: MultipleAlgorithmModelJson = {
            modelType: ModelType.MultipleAlgorithm,
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

        const optimizedMultipleAlgorithmModelJson = optimizeModel(
            multipleAlgorithmModelJson,
        ) as MultipleAlgorithmModelJson;
        t.test(`Removing unused columns`, t => {
            optimizedMultipleAlgorithmModelJson.algorithms.forEach(
                algorithm => {
                    doRemoveUnsedColumnsAsertions(
                        algorithm.algorithm,
                        Tables,
                        t,
                    );
                },
            );

            t.end();
        });

        t.test(`Removing unused user functions`, t => {
            optimizedMultipleAlgorithmModelJson.algorithms.forEach(algorithm =>
                doRemoveUnusedFunctionsAssertions(
                    algorithm.algorithm,
                    UserFunctions,
                    t,
                ),
            );

            t.end();
        });
    });
});
