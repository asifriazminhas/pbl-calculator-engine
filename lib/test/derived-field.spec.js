"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const derived_field_1 = require("../engine/derived-field/derived-field");
const derived_field_2 = require("../engine/derived-field/derived-field");
const field_type_1 = require("../engine/field/field-type");
const chai_1 = require("chai");
const op_type_1 = require("../engine/op-type/op-type");
test(`.calculateCoefficent`, t => {
    const userFunctions = {};
    const tableName = 'tableOne';
    const outputColumn = 'out';
    const tables = {
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
    const derivedField = {
        fieldType: field_type_1.FieldType.DerivedField,
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
                fieldType: field_type_1.FieldType.DataField,
                name: 'fieldOne',
            },
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
    chai_1.expect(derived_field_1.calculateCoefficent(derivedField, data, userFunctions, tables)).to.equal('1');
    t.pass(`Correctly calculated coefficent with table condition`);
    t.end();
});
test(`.getDerivedFieldWithName`, t => {
    const childFields = [
        {
            fieldType: field_type_1.FieldType.DerivedField,
            equation: '',
            derivedFrom: [
                {
                    fieldType: field_type_1.FieldType.DerivedField,
                    equation: '',
                    derivedFrom: [
                        {
                            fieldType: field_type_1.FieldType.DerivedField,
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
            ],
            name: '',
            displayName: '',
            extensions: {},
        },
        {
            fieldType: field_type_1.FieldType.DerivedField,
            name: '',
            displayName: '',
            extensions: {},
            equation: '',
            derivedFrom: [],
        },
    ];
    const derivedField = {
        fieldType: field_type_1.FieldType.DerivedField,
        equation: '',
        derivedFrom: childFields,
        name: '',
        displayName: '',
        extensions: {},
    };
    chai_1.expect(derived_field_2.findDescendantDerivedField(derivedField, childFields[0].derivedFrom[0].name)).to.eql(childFields[0].derivedFrom[0]);
    t.pass(`Returned right derived field`);
    t.end();
});
test(`.calculateDataToCalculateCoefficent`, t => {
    t.test(`When the derived from item is a DataField`, t => {
        const derivedFromDataField = {
            fieldType: field_type_1.FieldType.DataField,
            name: 'testOne',
            displayName: '',
            extensions: {},
        };
        const derivedField = {
            name: '',
            fieldType: field_type_1.FieldType.DerivedField,
            equation: '',
            derivedFrom: [derivedFromDataField],
            displayName: '',
            extensions: {},
            opType: op_type_1.OpType.Continuous,
            min: null,
            max: null,
        };
        t.test(`When the DataField is not in the data argument`, t => {
            const actualData = derived_field_2.calculateDataToCalculateCoefficent(derivedField, [], {}, {});
            chai_1.expect(actualData).to.deep.equal([
                {
                    name: derivedFromDataField.name,
                    coefficent: null,
                },
            ]);
            t.pass(`Returned Data object has a Datum object for the derived from DataField correctly set`);
            t.end();
        });
    });
});
//# sourceMappingURL=derived-field.spec.js.map