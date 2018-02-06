import * as test from 'tape';
import { expect } from 'chai';
import {
    IBaselineMixin,
    getBaselineForData,
} from '../engine/regression-algorithm/baseline/baseline';
import { NoBaselineFoundForAge } from '../engine/errors/no-baseline-hazard-found';

test(`getBaselineForData function`, t => {
    t.test(`When baseline is a number`, t => {
        const baseline: IBaselineMixin = {
            baseline: 1,
        };

        expect(getBaselineForData(baseline, [])).to.equal(baseline.baseline);

        t.pass(`Should return the value of the baseline field`);
        t.end();
    });

    t.test(`When the baseline is an object`, t => {
        const baseline: IBaselineMixin = {
            baseline: {
                29: 1,
            },
        };

        t.test(
            `When the baseline object does not have a value for the coefficient of the found age datum`,
            t => {
                expect(
                    getBaselineForData.bind(null, baseline, [
                        {
                            name: 'age',
                            coefficent: 30,
                        },
                    ]),
                ).to.throw(NoBaselineFoundForAge);

                t.pass(`Should throw a NoBaselineFoundForAge error`);
                t.end();
            },
        );

        t.test(
            `When the baseline object has a number value for the coefficient of the found age datum`,
            t => {
                expect(
                    getBaselineForData(baseline, [
                        {
                            name: 'age',
                            coefficent: 29,
                        },
                    ]),
                ).to.equal(
                    // @ts-ignore
                    baseline.baseline[29],
                );

                t.pass(`Should return the number value`);
                t.end();
            },
        );
    });
});
