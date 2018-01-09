/* tslint:disable no-shadowed-variable */

import 'source-map-support/register';

import * as test from 'tape';
import { expect } from 'chai';
// tslint:disable-next-line
import { oneLine } from 'common-tags';

import { formatCoefficentForComponent } from '../engine/data';
import { Covariate } from '../engine/covariate';
import * as moment from 'moment';

test(`Coefficent.formatCoefficent`, t => {
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

    const coefficentsForReferenceTest = [null, undefined, 'NA', 'a'];
    coefficentsForReferenceTest.forEach(coefficent => {
        expect(formatCoefficentForComponent(coefficent, covariate)).to.eql(
            covariate.referencePoint,
        );
    });
    t.pass(`Correctly returns reference point`);

    const coefficentsForErrorTest = [moment(), new Date()];
    coefficentsForErrorTest.forEach(coefficent => {
        expect(() => {
            formatCoefficentForComponent(coefficent, covariate);
        }).to.throw();
    });
    t.pass(oneLine`Correctly throws an error`);

    const coefficentsForNumberTest = [1, '23'];
    coefficentsForNumberTest.forEach(coefficent => {
        expect(formatCoefficentForComponent(coefficent, covariate)).to.equal(
            Number(coefficent),
        );
    });
    t.pass(`Correctly returns a number`);

    t.end();
});
