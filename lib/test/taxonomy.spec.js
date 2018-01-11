"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const test = require("tape");
const chai_1 = require("chai");
const taxonomy_1 = require("../engine/pmml-to-json-parser/taxonomy");
const bluebird = require("bluebird");
const xml2js_1 = require("xml2js");
const promisifiedParseXmlString = bluebird.promisify(xml2js_1.parseString);
test(`Testing parsing PMML Taxonomy`, (t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const TaxonomyPmml = `
    <PMML>
        <Taxonomy name="TestOne">
            <InlineTable>
                <row>
                    <columnOne>A</columnOne>
                    <columnTwo>B</columnTwo>
                </row>
                <row>
                    <columnOne>C</columnOne>
                    <columnTwo>D</columnTwo>
                </row>
            </InlineTable>
        </Taxonomy>
        <Taxonomy name="TestTwo">
            <InlineTable>
                <row>
                    <columnOne>E</columnOne>
                    <columnTwo>F</columnTwo>
                </row>
            </InlineTable>
        </Taxonomy>
    </PMML>
    `;
    const pmml = yield promisifiedParseXmlString(TaxonomyPmml, {
        explicitArray: false,
        explicitChildren: true,
        preserveChildrenOrder: true,
    });
    const taxonomyPmml = pmml.PMML.Taxonomy;
    const parsedTaxonomy = taxonomy_1.parseTaxonomy(pmml.PMML.Taxonomy);
    const tableNames = Object.keys(parsedTaxonomy);
    chai_1.expect(tableNames).to.eql([taxonomyPmml[0].$.name, taxonomyPmml[1].$.name]);
    t.pass(`Table names are correctly set`);
    chai_1.expect(parsedTaxonomy[tableNames[0]]).to.eql([
        {
            columnOne: 'A',
            columnTwo: 'B',
        },
        {
            columnOne: 'C',
            columnTwo: 'D',
        },
    ]);
    chai_1.expect(parsedTaxonomy[tableNames[1]]).to.eql([
        { columnOne: 'E', columnTwo: 'F' },
    ]);
    t.pass(`Table values are correctly set`);
    chai_1.expect(taxonomy_1.parseTaxonomy(undefined)).to.eql({});
    t.pass(`Empty obnject returned when taxonomy is undefined`);
    t.end();
}));
//# sourceMappingURL=taxonomy.spec.js.map