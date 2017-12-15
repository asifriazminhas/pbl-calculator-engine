import * as test from 'tape';
import { calculateCoefficent } from '../engine/derived-field';
import { Algorithm } from '../engine/algorithm/algorithm';
import {
    IBaseDerivedField,
    DerivedField,
    findDescendantDerivedField,
} from '../engine/derived-field/derived-field';
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

test(`.getDerivedFieldWithName`, t => {
    const childFields: DerivedField[] = [
        {
            fieldType: FieldType.DerivedField,
            equation: '',
            derivedFrom: [
                {
                    fieldType: FieldType.DerivedField,
                    equation: '',
                    derivedFrom: [
                        {
                            fieldType: FieldType.DerivedField,
                            equation: '',
                            derivedFrom: [],
                            name: '',
                            displayName: '',
                            extensions: {},
                        },
                    ],
                    displayName: '',
                    extensions: {},
                    name: 'fieldToFind',
                },
            ] as DerivedField[],
            name: '',
            displayName: '',
            extensions: {},
        },
        {
            fieldType: FieldType.DerivedField,
            name: '',
            displayName: '',
            extensions: {},
            equation: '',
            derivedFrom: [],
        },
    ];

    const derivedField: DerivedField = {
        fieldType: FieldType.DerivedField,
        equation: '',
        derivedFrom: childFields,
        name: '',
        displayName: '',
        extensions: {},
    };

    expect(
        findDescendantDerivedField(
            derivedField,
            childFields[0].derivedFrom[0].name,
        ),
    ).to.eql(childFields[0].derivedFrom[0]);
    t.pass(`Returned right derived field`);

    t.end();
});
