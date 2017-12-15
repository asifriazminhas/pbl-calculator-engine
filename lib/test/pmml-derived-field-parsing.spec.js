"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const test = require("tape");
const pmml_1 = require("../engine/pmml");
const derived_field_1 = require("../engine/pmml-to-json-parser/data_fields/derived_field/derived_field");
const chai_1 = require("chai");
process.on('unhandledRejection', (error) => {
    console.error(error);
});
function getPmmlForTest({ tableName, derivedFieldName, outputColumn, fieldColumnPairs, }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fieldColumnPairsString = fieldColumnPairs
            .map(fieldColumnPair => {
            const fieldOrConstantString = fieldColumnPair
                .field
                ? `field="${fieldColumnPair.field}"`
                : `constant="${fieldColumnPair
                    .constant}"`;
            return `<FieldColumnPair column="${fieldColumnPair.column}" ${fieldOrConstantString} />`;
        })
            .join('');
        const pmmlString = `<PMML>
        <DataDictionary>
            <DataField name="dataFieldOne"/>
            <DataField name="dataFieldTwo"/>
        </DataDictionary>
        <LocalTransformations>
            <DerivedField name="${derivedFieldName}" optype="continuous">
                <MapValues outputColumn="${outputColumn}">
                    ${fieldColumnPairsString}
                    <TableLocator location="taxonomy" name="${tableName}"/>
                </MapValues>
            </DerivedField>
        </LocalTransformations>
    </PMML>`;
        return yield pmml_1.PmmlParser.parsePmmlFromPmmlXmlStrings([pmmlString]);
    });
}
function doAssertions(t, derivedFieldsToTest, fieldColumnPairs, tableName, outputColumn) {
    chai_1.expect(derivedFieldsToTest.length).to.equal(1);
    t.pass(`Returned expected number of derived fields`);
    chai_1.expect(derivedFieldsToTest[0].derivedFrom.map(dataField => dataField.name)).to.eql(fieldColumnPairs
        .map(fieldColumnPair => {
        return fieldColumnPair.field;
    })
        .filter(derivedFrom => derivedFrom !== undefined));
    t.pass(`derivedFrom field is correctly set`);
    const objectToPassIn = fieldColumnPairs
        .map(fieldColumnPair => {
        return `${fieldColumnPairs.length > 1
            ? ''
            : ' '}${fieldColumnPairs.length > 1
            ? '\n    '
            : ''}'${fieldColumnPair.column}': ${fieldColumnPair
            .field
            ? `obj['${fieldColumnPair
                .field}']${fieldColumnPairs.length > 1 ? '' : ' '}`
            : `'${fieldColumnPair
                .constant}'${fieldColumnPairs.length > 1 ? '\n' : ''}`}`;
    })
        .join(',');
    chai_1.expect(derivedFieldsToTest[0].equation).to.equal(`derived = getValueFromTable(tables['${tableName}'], '${outputColumn}', {${objectToPassIn}});`);
    t.pass(`equation field is correctly set`);
}
function testMultipleFieldColumnPair(t) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const derivedFieldName = 'derivedFieldTestTwo';
        const tableName = 'testTableTwo';
        const outputColumn = 'testTwoOutputColumn';
        const fieldColumnPairs = [
            {
                column: 'sex',
                field: 'sexTwo',
            },
            {
                column: 'age',
                constant: '2',
            },
        ];
        const pmml = yield getPmmlForTest({
            derivedFieldName,
            tableName,
            outputColumn,
            fieldColumnPairs,
        });
        const derivedFields = derived_field_1.parseDerivedFields(pmml, []);
        doAssertions(t, derivedFields, fieldColumnPairs, tableName, outputColumn);
    });
}
function testSingleFieldColumnPair(t) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const derivedFieldName = 'derivedFieldTestOne';
        const tableName = 'SodiumData';
        const outputColumn = 'sodiumPerServing';
        const fieldColumnPairs = [{ column: 'sex', field: 'sex' }];
        const pmml = yield getPmmlForTest({
            derivedFieldName,
            tableName,
            outputColumn,
            fieldColumnPairs,
        });
        const derivedFields = derived_field_1.parseDerivedFields(pmml, []);
        doAssertions(t, derivedFields, fieldColumnPairs, tableName, outputColumn);
    });
}
test(`Parsing derived field from PMML`, t => {
    t.test(`Testing single FieldColumnPairs`, (t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield testSingleFieldColumnPair(t);
        t.end();
    }));
    t.test(`Testing multiple FieldColumnPairs`, (t) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield testMultipleFieldColumnPair(t);
        t.end();
    }));
});
//# sourceMappingURL=pmml-derived-field-parsing.spec.js.map