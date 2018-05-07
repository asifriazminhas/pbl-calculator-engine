import * as test from 'tape';
import { getRelativeDifference, runIntegrationTest } from './test-utils';
// tslint:disable-next-line:max-line-length
import { CoxSurvivalAlgorithm } from '../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { Data, findDatumWithName } from '../engine/data';
import { expect } from 'chai';

function testRcsForAlgorithm(algorithm: CoxSurvivalAlgorithm, data: Data) {
    const notFirstVariableRcsCovariate = algorithm.covariates.filter(
        currentCovariate => {
            return currentCovariate.customFunction !== undefined;
        },
    );

    notFirstVariableRcsCovariate.forEach(currentNotFirstVaribleRcsCovariate => {
        const actualCoefficient = currentNotFirstVaribleRcsCovariate.calculateCoefficient(
            data,
            algorithm.userFunctions,
            algorithm.tables,
        ) as number;

        const expectedCoefficient = findDatumWithName(
            currentNotFirstVaribleRcsCovariate.name,
            data,
        ).coefficent as number;

        expect(
            getRelativeDifference(expectedCoefficient, actualCoefficient),
        ).to.be.lessThan(10);
    });
}

test(`RCS Function`, async t => {
    await runIntegrationTest(
        'score-data',
        'score-data',
        'RCS Function',
        ['RESPECT', 'MPoRT'],
        testRcsForAlgorithm,
        t,
    );
});
