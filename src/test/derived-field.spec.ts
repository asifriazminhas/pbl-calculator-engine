import * as test from 'tape';
import { calculateCoefficent } from '../engine/derived-field';
import { Algorithm } from '../engine/algorithm/algorithm';
import { IBaseDerivedField } from '../engine/derived-field/derived-field';
import { FieldType } from '../engine/field/field-type';
import { DataField } from '../engine/data-field/data-field';
import { expect } from 'chai';

test(`.calculateCoefficent`, t => {
    const userFunctions: Algorithm<any>['userFunctions'] = {};
    const tableName = 'tableOne';
    const outputColumn = 'out';

    const tables: Algorithm<any>['tables'] = {
        [tableName]: [
            {
                columnOne: 'a',
                columnTwo: 'b',
                [outputColumn]: '1',
            },
            {
                columnOne: 'c',
                columnTwo: 'd',
                [outputColumn]: '2',
            },
        ],
    };
    const derivedField: IBaseDerivedField = {
        fieldType: FieldType.DerivedField,
        name: 'derivedField',
        equation: `derived = getValueFromTable(
            tables['${tableName}'],
            '${outputColumn}', {
                'columnOne': obj['fieldOne'],
                'columnTwo': 'b'
            }
        )`,
        derivedFrom: [
            {
                fieldType: FieldType.DataField,
                name: 'fieldOne',
            } as DataField,
        ],
        displayName: '',
        extensions: {},
    };
    const data = [
        {
            name: 'fieldOne',
            coefficent: 'a',
        },
    ];

    expect(
        calculateCoefficent(derivedField, data, userFunctions, tables),
    ).to.equal('1');
    t.pass(`Correctly calculated coefficent with table condition`);

    t.end();
});
