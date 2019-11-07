import * as test from 'tape';
import { getMockDerivedField } from '../test-utils/derived-field-util';
import { expect } from 'chai';

test(`DerivedField.calculateCoefficient`, t => {
    t.test(
        `should return a number if evaluated value is one, regardless of type`,
        t => {
            const derivedField = getMockDerivedField({
                equation: 'derived = "1"',
            });

            expect(derivedField.calculateCoefficent([], {}, {})).to.equal(1);

            t.pass(`Pass`);
            t.end();
        },
    );

    t.test(`should return a string if evaluated value is one`, t => {
        const expectedCoefficient = 'string value';

        const derivedField = getMockDerivedField({
            equation: `derived = "${expectedCoefficient}"`,
        });

        expect(derivedField.calculateCoefficent([], {}, {})).to.equal(
            expectedCoefficient,
        );

        t.pass('Pass');
        t.end();
    });
});
