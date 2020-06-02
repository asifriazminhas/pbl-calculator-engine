import test from 'tape';
import { Model } from '../engine/model/model';
import { expect } from 'chai';
import { CoxSurvivalAlgorithm } from '../engine/model';

test(`Covariate`, t => {
    const ModelJson = require('../../assets/test/model/model.json');
    const model = new Model<CoxSurvivalAlgorithm>(ModelJson);
    const CovariateToTestName = 'AgeC_rcs1';
    const covariateToTest = model.algorithms[0].algorithm.covariates.find(
        covariate => {
            return covariate.name === CovariateToTestName;
        },
    )!;

    t.test(`formatCoefficentForComponent`, t => {
        t.test(`When the coefficient is below the lower margin`, t => {
            expect(
                covariateToTest['formatCoefficentForComponent'](-31),
            ).to.equal(-31);
            t.pass(`Returns the lower margin`);
            t.end();
        });

        t.test(`When the coefficient is above the upper margin`, t => {
            expect(
                covariateToTest['formatCoefficentForComponent'](52),
            ).to.equal(52);
            t.pass(`Returns the upper margin`);
            t.end();
        });

        t.test(`When the coefficient is within the margins`, t => {
            expect(
                covariateToTest['formatCoefficentForComponent'](20),
            ).to.equal(20);
            t.pass(`Returns the coefficient arg`);
            t.end();
        });
    });
});
