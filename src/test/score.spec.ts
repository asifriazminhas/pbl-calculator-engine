import * as test from 'tape';
import { runIntegrationTest, getRelativeDifference } from './test-utils';
import { Data, findDatumWithName } from '../engine/data/data';
import { expect } from 'chai';
import { InteractionCovariate } from '../engine/data-field/covariate/interaction-covariate/interaction-covariate';
// tslint:disable-next-line:max-line-length
import { CoxSurvivalAlgorithm } from '../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
import { NoDatumFoundError } from '../engine/errors';

function checkDataForAlgorithm(data: Data, cox: CoxSurvivalAlgorithm) {
    cox.covariates
        .filter(covariate => !(covariate instanceof InteractionCovariate))
        .forEach(covariate => {
            findDatumWithName(covariate.name, data);
        });
}

function testCalculatedScoreForDataAndExpectedScore(
    coxAlgorithm: CoxSurvivalAlgorithm,
    data: Data,
) {
    // Debugging code
    /*if (findDatumWithName('ran_id', data).coefficent === 17840) {
        return;
    }*/

    checkDataForAlgorithm(data, coxAlgorithm);

    let expectedScore;
    try {
        expectedScore = Number(findDatumWithName('s', data).coefficent);
    } catch (err) {
        if (!(err instanceof NoDatumFoundError)) {
            throw err;
        }
    }
    let expectedBin;
    try {
        expectedBin = Number(findDatumWithName('bin', data).coefficent);
    } catch (err) {
        if (!(err instanceof NoDatumFoundError)) {
            throw err;
        }
    }

    if (coxAlgorithm.bins) {
        const binData = coxAlgorithm.bins.getBinDataForScore(
            Math.round(coxAlgorithm.calculateScore(data) * 10000000) / 10000000,
        );
        const binNumber = Object.keys(coxAlgorithm.bins.binsData)
            .map(Number)
            .find(currentBinNumber => {
                return (
                    coxAlgorithm.bins!.binsData[currentBinNumber] === binData
                );
            });

        expect(
            binNumber,
            `
            ran_id: ${findDatumWithName('ran_id', data).coefficent}
        `,
        ).to.equal(expectedBin);
    } else {
        const actualScore = coxAlgorithm.getSurvivalToTime(data);

        const percentDiff = getRelativeDifference(
            expectedScore as number,
            actualScore,
        );
        const MaximumPercentDiff = 10;

        expect(percentDiff).to.be.lessThan(
            10,
            `
            Percent difference greater than ${MaximumPercentDiff}
            Expected Score: ${expectedScore}
            Actual Score: ${actualScore}
            Data: ${JSON.stringify(data)}
        `,
        );
    }
}

test(`Testing Scoring`, async t => {
    return runIntegrationTest(
        'score-data',
        'score-data',
        'Scoring',
        ['Sodium', 'SPoRT', 'RESPECT'],
        testCalculatedScoreForDataAndExpectedScore,
        t,
    );
});
