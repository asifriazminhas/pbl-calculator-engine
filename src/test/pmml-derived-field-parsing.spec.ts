import * as test from 'tape';
import { PmmlParser } from '../engine/pmml';
import { parseDerivedFields } from '../engine/pmml-to-json-parser/data_fields/derived_field/derived_field';
import { expect } from 'chai';
import { Pmml } from '../engine/pmml/pmml';
import { IDerivedFieldJson } from '../parsers/json/json-derived-field';
import { DataField } from '../engine/data-field/data-field';

process.on('unhandledRejection', (error: Error) => {
    console.error(error);
});

interface IBaseFieldColumnPair {
    column: string;
}
interface IFieldFieldColumnPair extends IBaseFieldColumnPair {
    field: string;
}
interface IConstantFieldColumnPair extends IBaseFieldColumnPair {
    constant: string;
}
type FieldColumnPair = IFieldFieldColumnPair | IConstantFieldColumnPair;

async function getPmmlForTest({
    tableName,
    derivedFieldName,
    outputColumn,
    fieldColumnPairs,
}: {
    tableName: string;
    derivedFieldName: string;
    outputColumn: string;
    fieldColumnPairs: FieldColumnPair[];
}): Promise<Pmml> {
    const fieldColumnPairsString = fieldColumnPairs
        .map(fieldColumnPair => {
            const fieldOrConstantString = (fieldColumnPair as IFieldFieldColumnPair)
                .field
                ? `field="${(fieldColumnPair as IFieldFieldColumnPair).field}"`
                : `constant="${(fieldColumnPair as IConstantFieldColumnPair)
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

    return await PmmlParser.parsePmmlFromPmmlXmlStrings([pmmlString]);
}

function doAssertions(
    t: test.Test,
    derivedFieldsToTest: IDerivedFieldJson[],
    fieldColumnPairs: FieldColumnPair[],
    tableName: string,
    outputColumn: string,
) {
    expect(derivedFieldsToTest.length).to.equal(1);
    t.pass(`Returned expected number of derived fields`);

    expect(
        (derivedFieldsToTest[0].derivedFrom as DataField[]).map(
            dataField => dataField.name,
        ),
    ).to.eql(
        fieldColumnPairs
            .map(fieldColumnPair => {
                return (fieldColumnPair as IFieldFieldColumnPair).field;
            })
            .filter(derivedFrom => derivedFrom !== undefined),
    );
    t.pass(`derivedFrom field is correctly set`);

    const objectToPassIn = fieldColumnPairs
        .map(fieldColumnPair => {
            return `${fieldColumnPairs.length > 1
                ? ''
                : ' '}${fieldColumnPairs.length > 1
                ? '\n    '
                : ''}'${fieldColumnPair.column}': ${(fieldColumnPair as IFieldFieldColumnPair)
                .field
                ? `obj['${(fieldColumnPair as IFieldFieldColumnPair)
                      .field}']${fieldColumnPairs.length > 1 ? '' : ' '}`
                : `'${(fieldColumnPair as IConstantFieldColumnPair)
                      .constant}'${fieldColumnPairs.length > 1 ? '\n' : ''}`}`;
        })
        .join(',');

    expect(derivedFieldsToTest[0].equation).to.equal(
        `derived = getValueFromTable(tables['${tableName}'], '${outputColumn}', {${objectToPassIn}});`,
    );
    t.pass(`equation field is correctly set`);
}

async function testMultipleFieldColumnPair(t: test.Test) {
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
    const pmml = await getPmmlForTest({
        derivedFieldName,
        tableName,
        outputColumn,
        fieldColumnPairs,
    });
    const derivedFields = parseDerivedFields(pmml, []);

    doAssertions(t, derivedFields, fieldColumnPairs, tableName, outputColumn);
}

async function testSingleFieldColumnPair(t: test.Test) {
    const derivedFieldName = 'derivedFieldTestOne';
    const tableName = 'SodiumData';
    const outputColumn = 'sodiumPerServing';

    const fieldColumnPairs = [{ column: 'sex', field: 'sex' }];

    const pmml = await getPmmlForTest({
        derivedFieldName,
        tableName,
        outputColumn,
        fieldColumnPairs,
    });
    const derivedFields = parseDerivedFields(pmml, []);

    doAssertions(t, derivedFields, fieldColumnPairs, tableName, outputColumn);
}

test(`Parsing derived field from PMML`, t => {
    t.test(`Testing single FieldColumnPairs`, async t => {
        await testSingleFieldColumnPair(t);

        t.end();
    });

    t.test(`Testing multiple FieldColumnPairs`, async t => {
        await testMultipleFieldColumnPair(t);

        t.end();
    });
});
