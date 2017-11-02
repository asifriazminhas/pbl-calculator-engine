/* tslint:disable no-shadowed-variable */

import 'source-map-support/register';

import * as test from 'tape';
// tslint:disable-next-line
const tapSpec = require('tap-spec');
test
    .createStream()
    .pipe(tapSpec())
    .pipe(process.stdout);
import { expect } from 'chai';
// tslint:disable-next-line
import { oneLine } from 'common-tags';

import { formatCoefficentForComponent } from '../engine/data';
import { Covariate } from '../engine/covariate';
import * as moment from 'moment';

test(`Coefficent`, t => {
    t.test(`formatCoefficent`, t => {
        const covariate: Covariate = {
            name: '',
            displayName: '',
            extensions: {},
            fieldType: 0,
            derivedField: undefined,
            customFunction: undefined,
            beta: 0,
            referencePoint: 0,
        };

        t.test(
            `should return covariate reference if coefficent is null, undefined or NA`,
            t => {
                const coefficents = [null, undefined, 'NA'];

                coefficents.forEach(coefficent => {
                    expect(
                        formatCoefficentForComponent(coefficent, covariate),
                    ).to.eql(covariate.referencePoint);
                });

                t.pass('');
                t.end();
            },
        );

        t.test(
            oneLine`should throw an error if the coefficent is an instanceof
            moment Date or is a value that cannot be coerced into a number`,
            t => {
                const coefficents = [moment(), new Date(), 'as', NaN];

                coefficents.forEach(coefficent => {
                    expect(() => {
                        formatCoefficentForComponent(coefficent, covariate);
                    }).to.throw();
                });

                t.pass('');
                t.end();
            },
        );

        t.test(
            `should return the coefficent as a number if it can be one`,
            t => {
                const coefficents = [1, '23'];

                coefficents.forEach(coefficent => {
                    expect(
                        formatCoefficentForComponent(coefficent, covariate),
                    ).to.equal(Number(coefficent));
                });

                t.pass('');
                t.end();
            },
        );
    });

    t.end();
});
