"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const test = require("tape");
const test_utils_1 = require("./test-utils");
const pmml_1 = require("../engine/pmml-to-json-parser/pmml");
const chai_1 = require("chai");
const lodash_1 = require("lodash");
function doTableAssertions(actualModelJson, tables, t) {
    tables.forEach(table => {
        table.rows.forEach((row, index) => {
            chai_1.expect(actualModelJson.algorithm.tables[table.name][index]).to.deep.equal(lodash_1.omit(row, 'columnTwo'));
        });
    });
    t.pass(`Tables are correctly set`);
}
test(`Parsing PMML to JSON`, (t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
    const pmmlString = test_utils_1.getPmmlString(DerivedFields, Tables);
    const model = (yield pmml_1.pmmlXmlStringsToJson([[pmmlString]], []));
    doTableAssertions(model, Tables, t);
    t.end();
}));
//# sourceMappingURL=pmml-to-json-parser.spec.js.map