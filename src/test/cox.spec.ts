import * as test from 'tape';
import { expect } from 'chai';

import { AlgorithmType } from '../engine/algorithm';
import { TimeMetric } from '../engine/cox/time-metric';
import { DataFieldType } from '../parsers/json/data-field-type';
import { Data } from '../engine/data';
import { ICoxWithBins, getSurvivalToTimeWithBins } from '../engine/cox/cox';
import * as moment from 'moment';
/* tslint:disable-next-line */
import { NonInteractionCovariate } from '../engine/data-field/covariate/non-interaction-covariats/non-interaction-covariate';

test(`getSurvivalToTimeForCoxWithBins function`, t => {
    const covariate = new NonInteractionCovariate(
        {
            dataFieldType: DataFieldType.NonInteractionCovariate,
            beta: 10,
            referencePoint: undefined,
            name: 'covariateOne',
        },
        undefined,
        undefined,
    );

    const maximumTime = 1800;

    const coxWithBins: ICoxWithBins = {
        algorithmType: AlgorithmType.Cox,
        timeMetric: TimeMetric.Days,
        maximumTime: 1800,
        name: '',
        version: '',
        description: '',
        userFunctions: {},
        tables: {},
        covariates: [covariate],
        baseline: 1,
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
    };

    const data: Data = [
        {
            name: covariate.name,
            coefficent: 1,
        },
    ];

    const time = moment();
    time.add('days', maximumTime / 2);

    expect(
        getSurvivalToTimeWithBins(coxWithBins, data, time),
        `Invalid survival value returned`,
    ).to.equal(0.49);

    t.pass(`Survival correctly calculated`);
    t.end();
});
