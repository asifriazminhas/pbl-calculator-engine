/* tslint:disable no-shadowed-variable */

import 'source-map-support/register';

import * as test from 'tape';
import { expect } from 'chai';
// tslint:disable-next-line
import { oneLine } from 'common-tags';

import { formatCoefficentForComponent } from '../engine/data';
import * as moment from 'moment';
import { Covariate } from '../engine/data-field/covariate/covariate';
import { NonInteractionCovariate } from '../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate';

test(`Coefficent.formatCoefficent`, t => {
    const covariate: Covariate = new NonInteractionCovariate(
        {
            name: '',
            dataFieldType: 0,
            beta: 0,
            referencePoint: 0,
            groups: [],
        },
        undefined,
        undefined,
    );

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
