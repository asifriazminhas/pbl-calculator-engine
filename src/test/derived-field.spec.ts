import test from 'tape';
import { expect } from 'chai';
import {
    DerivedField,
    findDescendantDerivedField,
} from '../engine/data-field/derived-field/derived-field';
import { DataField } from '../engine/data-field/data-field';
import { IUserFunctions } from '../engine/algorithm/user-functions/user-functions';
import { ITables } from '../engine/algorithm/tables/tables';

test(`.calculateCoefficent`, t => {
    const userFunctions: IUserFunctions = {};
    const tableName = 'tableOne';
    const outputColumn = 'out';

    const tables: ITables = {
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
    const metadata = {
        label: '',
        shortLabel: '',
    };
    const derivedField: DerivedField = new DerivedField(
        {
            name: 'derivedField',
            equation: `derived = getValueFromTable(
            tables['${tableName}'],
            '${outputColumn}', {
                'columnOne': obj['fieldOne'],
                'columnTwo': 'b'
            },
        )`,
            derivedFrom: [],
            isRequired: false,
            isRecommended: false,
            metadata,
        },
        [
            new DataField({
                name: 'fieldOne',
                isRequired: false,
                isRecommended: false,
                metadata,
            }),
        ],
    );
    const data = [
        {
            name: 'fieldOne',
            coefficent: 'a',
        },
    ];

    expect(
        derivedField.calculateCoefficent(data, userFunctions, tables),
    ).to.equal(1);
    t.pass(`Correctly calculated coefficent with table condition`);

    t.end();
});

test(`.getDerivedFieldWithName`, t => {
    const metadata = {
        label: '',
        shortLabel: '',
    };

    const childFields: DerivedField[] = [
        new DerivedField(
            {
                equation: '',
                name: '',
                derivedFrom: [],
                isRequired: false,
                isRecommended: false,
                metadata,
            },
            [
                new DerivedField(
                    {
                        equation: '',
                        derivedFrom: [],
                        name: 'fieldToFind',
                        isRequired: false,
                        isRecommended: false,
                        metadata,
                    },
                    [
                        new DerivedField(
                            {
                                equation: '',
                                derivedFrom: [],
                                name: '',
                                isRequired: false,
                                isRecommended: false,
                                metadata,
                            },
                            [],
                        ),
                    ],
                ),
            ],
        ),
        new DerivedField(
            {
                name: '',
                equation: '',
                derivedFrom: [],
                isRequired: false,
                isRecommended: false,
                metadata,
            },
            [],
        ),
    ];

    const derivedField: DerivedField = new DerivedField(
        {
            equation: '',
            derivedFrom: [],
            name: '',
            isRequired: false,
            isRecommended: false,
            metadata,
        },
        childFields,
    );

    expect(
        findDescendantDerivedField(
            derivedField,
            childFields[0].derivedFrom[0].name,
        ),
    ).to.eql(childFields[0].derivedFrom[0]);
    t.pass(`Returned right derived field`);

    t.end();
});

test(`.calculateDataToCalculateCoefficent`, t => {
    t.test(`When the derived from item is a DataField`, t => {
        const metadata = {
            label: '',
            shortLabel: '',
        };
        const derivedFromDataField = new DataField({
            name: 'testOne',
            isRequired: false,
            isRecommended: false,
            metadata,
        });
        const derivedField: DerivedField = new DerivedField(
            {
                name: '',
                equation: '',
                derivedFrom: [],
                isRequired: false,
                isRecommended: false,
                metadata,
            },
            [derivedFromDataField],
        );

        t.test(`When the DataField is not in the data argument`, t => {
            const actualData = derivedField.calculateDataToCalculateCoefficent(
                [],
                {},
                {},
            );

            expect(actualData).to.deep.equal([
                {
                    name: derivedFromDataField.name,
                    coefficent: undefined,
                },
            ]);
            t.pass(
                `Returned Data object has a Datum object for the derived from DataField correctly set`,
            );

            t.end();
        });
    });
});
