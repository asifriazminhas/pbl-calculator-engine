import * as test from 'tape';
import { getRelativeDifference, runIntegrationTest } from './test-utils';
// tslint:disable-next-line:max-line-length
import { CoxSurvivalAlgorithm } from '../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { Data, findDatumWithName } from '../engine/data';
import { expect } from 'chai';

function testRcsForAlgorithm(
    algorithm: CoxSurvivalAlgorithm,
    data: Data,
    index: number,
) {
    const notFirstVariableRcsCovariate = algorithm.covariates.filter(
        currentCovariate => {
            return currentCovariate.customFunction !== undefined;
        },
    );
    const dataWithoutSecondVariableCovariates = data.filter(datum => {
        return notFirstVariableRcsCovariate.find(covariate => {
            return covariate.name === datum.name;
        })
            ? false
            : true;
    });

    notFirstVariableRcsCovariate.forEach(currentNotFirstVaribleRcsCovariate => {
        const actualCoefficient = currentNotFirstVaribleRcsCovariate.calculateCoefficient(
            dataWithoutSecondVariableCovariates,
            algorithm.userFunctions,
            algorithm.tables,
        ) as number;

        const expectedCoefficient = findDatumWithName(
            currentNotFirstVaribleRcsCovariate.name,
            data,
        ).coefficent as number;

        expect(
            getRelativeDifference(expectedCoefficient, actualCoefficient),
            `
                Name: ${currentNotFirstVaribleRcsCovariate.name}
                Expected: ${expectedCoefficient}
                Actual: ${actualCoefficient}
                index: ${index}
            `,
        ).to.be.lessThan(10);
    });
}

test.only(`RCS Function`, async t => {
    await runIntegrationTest(
        'score-data',
        'score-data',
        'RCS Function',
        ['RESPECT', 'MPoRT', 'SPoRT', 'MPoRTv2'],
        testRcsForAlgorithm,
        t,
    );
});
