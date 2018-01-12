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
    ];

    const AlgorithmJson: ISimpleAlgorithmJson = {
        name: '',
        algorithmType: AlgorithmType.SimpleAlgorithm,
        derivedFields: DerivedFields,
        version: '',
        description: '',
        userFunctions: {},
        tables: Tables,
        output: '',
    };

    t.test(`Testing single algorithm model`, t => {
        t.test(`Removing unused columns from table`, t => {
            const singleAlgorithmModelJson: SingleAlgorithmModelJson = {
                modelType: ModelType.SingleAlgorithm,
                algorithm: AlgorithmJson,
            };

            const optimizedSingleAlgorithmModelJson = optimizeModel(
                singleAlgorithmModelJson,
            ) as SingleAlgorithmModelJson;

            doRemoveUnsedColumnsAsertions(
                optimizedSingleAlgorithmModelJson.algorithm,
                Tables,
                t,
            );
            t.end();
        });
    });

    t.test(`Testing multiple algorithm model`, t => {
        t.test(`Removing unused columns`, t => {
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
    });
});
