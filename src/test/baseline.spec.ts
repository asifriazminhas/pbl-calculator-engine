import test from 'tape';
import { expect } from 'chai';
import { NoBaselineFoundForAge } from '../engine/errors/no-baseline-hazard-found';
import { Baseline } from '../engine/algorithm/regression-algorithm/baseline/baseline';

test(`getBaselineForData function`, t => {
    t.test(`When baseline is a number`, t => {
        const baseline = 1;

        expect(new Baseline(baseline).getBaselineForData([])).to.equal(
            baseline,
        );

        t.pass(`Should return the value of the baseline field`);
        t.end();
    });

    t.test(`When the baseline is an object`, t => {
        const baseline = [
            {
                age: 29,
                baseline: 1,
            },
        ];
        const baselineInstance = new Baseline(baseline);

        t.test(
            `When the baseline object does not have a value for the coefficient of the found age datum`,
            t => {
                expect(
                    baselineInstance.getBaselineForData.bind(baselineInstance, [
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
                    baselineInstance.getBaselineForData([
                        {
                            name: 'age',
                            coefficent: 29,
                        },
                    ]),
                ).to.equal(baseline[0].baseline);

                t.pass(`Should return the number value`);
                t.end();
            },
        );
    });
});
