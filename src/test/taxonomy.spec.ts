import * as test from 'tape';
import { expect } from 'chai';
import { ICustomPmml } from '../engine/pmml/pmml';
import { parseTaxonomy } from '../engine/pmml-to-json-parser/taxonomy';
import * as bluebird from 'bluebird';
import { parseString } from 'xml2js';
import { ITaxonomy } from '../engine/pmml/taxonomy';
const promisifiedParseXmlString: any = bluebird.promisify(parseString);

test(`Testing parsing PMML Taxonomy`, async t => {
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

    const pmml: {
        PMML: ICustomPmml;
    } = await promisifiedParseXmlString(TaxonomyPmml, {
        explicitArray: false,
        explicitChildren: true,
        preserveChildrenOrder: true,
    });

    const taxonomyPmml = pmml.PMML.Taxonomy as ITaxonomy[];

    const parsedTaxonomy = parseTaxonomy(pmml.PMML.Taxonomy);

    const tableNames = Object.keys(parsedTaxonomy);
    expect(tableNames).to.eql([taxonomyPmml[0].$.name, taxonomyPmml[1].$.name]);
    t.pass(`Table names are correctly set`);

    expect(parsedTaxonomy[tableNames[0]]).to.eql([
        {
            columnOne: 'A',
            columnTwo: 'B',
        },
        {
            columnOne: 'C',
            columnTwo: 'D',
        },
    ]);
    expect(parsedTaxonomy[tableNames[1]]).to.eql([
        { columnOne: 'E', columnTwo: 'F' },
    ]);
    t.pass(`Table values are correctly set`);

    expect(parseTaxonomy(undefined)).to.eql({});
    t.pass(`Empty obnject returned when taxonomy is undefined`);

    t.end();
});
