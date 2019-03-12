import * as test from 'tape';
import { expect } from 'chai';
import { DataFieldType } from '../parsers/json/data-field-type';
import { Data } from '../engine/data';
import * as moment from 'moment';
/* tslint:disable-next-line */
import { NonInteractionCovariate } from '../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate';
import { TimeMetric } from '../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric';
import { ICoxSurvivalAlgorithmJson } from '../parsers/json/json-cox-survival-algorithm';
// tslint:disable-next-line:max-line-length
import { CoxSurvivalAlgorithm } from '../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';

test(`getSurvivalToTimeForCoxWithBins function`, t => {
    const covariate = new NonInteractionCovariate(
        {
            dataFieldType: DataFieldType.NonInteractionCovariate,
            beta: 10,
            referencePoint: undefined,
            name: 'covariateOne',
            groups: [],
            isRequired: false,
            isRecommended: false,
            metadata: {
                label: '',
                shortLabel: '',
            },
        },
        undefined,
        undefined,
    );

    const maximumTime = 1800;

    const coxWithBinsJson: ICoxSurvivalAlgorithmJson = {
        timeMetric: TimeMetric.Days,
        maximumTime: 1800,
        name: '',
        userFunctions: {},
        tables: {},
        covariates: [],
        baseline: 1,
        derivedFields: [],
        bins: {
            binsData: {
                5: [
                    {
                        survivalPercent: 100,
                        time: 0,
                    },
                    {
                        survivalPercent: 50,
                        time: maximumTime / 2,
                    },
                    {
                        survivalPercent: 49,
                        time: maximumTime / 2,
                    },
                    {
                        survivalPercent: 5,
                        time: maximumTime,
                    },
                ],
            },
            binsLookup: [
                {
                    minScore: 0,
                    maxScore: 20,
                    binNumber: 5,
                },
            ],
        },
    };

    const coxWithBins = new CoxSurvivalAlgorithm(coxWithBinsJson);

    const data: Data = [
        {
            name: covariate.name,
            coefficent: 1,
        },
    ];

    const time = moment();
    time.add('days', maximumTime / 2);

    expect(
        coxWithBins.getSurvivalToTime(data, time),
        `Invalid survival value returned`,
    ).to.equal(0.49);

    t.pass(`Survival correctly calculated`);
    t.end();
});
