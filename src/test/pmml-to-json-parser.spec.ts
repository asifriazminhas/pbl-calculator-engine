import * as test from 'tape';
import { getPmmlString } from './test-utils';
import { pmmlXmlStringsToJson } from '../engine/pmml-to-json-parser/pmml';
import { SingleAlgorithmModelJson } from '../engine/single-algorithm-model/single-algorithm-model-json';
import { expect } from 'chai';
import { omit } from 'lodash';

function doTableAssertions(
    actualModelJson: SingleAlgorithmModelJson,
    tables: Array<{ name: string; rows: Array<{ [index: string]: string }> }>,
    t: test.Test,
) {
    tables.forEach(table => {
        table.rows.forEach((row, index) => {
            expect(
                actualModelJson.algorithm.tables[table.name][index],
            ).to.deep.equal(omit(row, 'columnTwo'));
        });
    });

    t.pass(`Tables are correctly set`);
}

test(`Parsing PMML to JSON`, async t => {
    const Tables = [
        {
            name: 'tableOne',
            rows: [
                {
                    outputColumn: String(Math.random()),
                    columnOne: String(Math.random()),
                    columnTwo: String(Math.random()),
                },
                {
                    outputColumn: String(Math.random()),
                    columnOne: String(Math.random()),
                    columnTwo: String(Math.random()),
                },
            ],
        },
    ];
    const DerivedFields = [
        {
            name: 'derivedFieldOne',
            mapValues: {
                tableName: Tables[0].name,
                outputColumn: 'outputColumn',
                fieldColumnPairs: [
                    {
                        column: 'columnOne',
                        constant: '1',
                    },
                ],
            },
        },
    ];

    const pmmlString = getPmmlString(DerivedFields, Tables);

    const model = (await pmmlXmlStringsToJson(
        [[pmmlString]],
        [],
    )) as SingleAlgorithmModelJson;

    doTableAssertions(model, Tables, t);

    t.end();
});
