import * as test from 'tape';
import { expect } from 'chai';
import { omit } from 'lodash';
import { optimizeModel } from '../parsers/pmml-to-json-parser/optimizations';
import { IDerivedFieldJson } from '../parsers/json/json-derived-field';
import { ICoxSurvivalAlgorithmJson } from '../parsers/json/json-cox-survival-algorithm';
import { TimeMetric } from '../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric';
import { IModelJson } from '../parsers/json/json-model';
import { AlgorithmType } from '../parsers/json/algorithm-type';

function doRemoveUnsedColumnsAsertions(
    actualOptimizedAlgorithmJson: ICoxSurvivalAlgorithmJson,
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
    optimizedAlgorithm: ICoxSurvivalAlgorithmJson,
    userFunctions: { [index: string]: string },
    t: test.Test,
) {
    expect(optimizedAlgorithm.userFunctions).to.deep.equal(
        omit(userFunctions, 'testFunctionTwo'),
    );
    t.pass(`userFunctions correctly optimized`);
}

test.skip(`Model optimizations`, t => {
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

    const metadata = {
        label: '',
        shortLabel: '',
    };
    const DerivedFields: IDerivedFieldJson[] = [
        {
            // tslint:disable-next-line
            equation: `derived = getValueFromTable(tables['tableOne'], 'outputColumn', { 'columnOne': 'Age_cont' });`,
            derivedFrom: [],
            name: 'derivedFieldOne',
            isRequired: false,
            isRecommended: false,
            metadata,
        },
        {
            // tslint:disable-next-line
            equation: `derived = getValueFromTable(tables['tableTwo'], 'outputColumn', { 'columnTwo': 'Age_cont' });`,
            derivedFrom: [],
            name: 'derivedFieldTwo',
            isRequired: false,
            isRecommended: false,
            metadata,
        },
        {
            equation: `derived = userFunctions['testFunctionOne']()`,
            derivedFrom: [],
            name: 'derivedFieldThree',
            isRequired: false,
            isRecommended: false,
            metadata,
        },
    ];

    const AlgorithmJson: ICoxSurvivalAlgorithmJson = {
        algorithmType: AlgorithmType.CoxSurvivalAlgorithm,
        name: '',
        derivedFields: DerivedFields,
        userFunctions: UserFunctions,
        tables: Tables,
        covariates: [],
        baseline: [],
        timeMetric: TimeMetric.Years,
        maximumTime: 5,
    };

    t.test(`Testing single algorithm model`, t => {
        const singleAlgorithmModelJson = {
            modelFields: [],
            name: '',
            algorithms: [
                {
                    algorithm: AlgorithmJson,
                    predicate: {
                        equation: 'true',
                        variables: [],
                    },
                },
            ],
        };

        const optimizedSingleAlgorithmModelJson = optimizeModel(
            singleAlgorithmModelJson,
        );

        t.test(`Removing unused columns from table`, t => {
            doRemoveUnsedColumnsAsertions(
                optimizedSingleAlgorithmModelJson.algorithms[0].algorithm,
                Tables,
                t,
            );
            t.end();
        });

        t.test(`Removing unused functions`, t => {
            doRemoveUnusedFunctionsAssertions(
                optimizedSingleAlgorithmModelJson.algorithms[0].algorithm,
                UserFunctions,
                t,
            );
            t.end();
        });
    });

    t.test(`Testing multiple algorithm model`, t => {
        const multipleAlgorithmModelJson: IModelJson<ICoxSurvivalAlgorithmJson> = {
            modelFields: [],
            name: '',
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
        ) as IModelJson<ICoxSurvivalAlgorithmJson>;
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
