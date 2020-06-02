/* tslint:disable:no-shadowed-variable */

import test from 'tape';
import { Model, CoxSurvivalAlgorithm } from '../engine/model';
import { CompleteLifeTable } from '../engine/life-table/life-table';
import { AbridgedLifeExpectancy } from '../engine/abridged-life-expectancy/abridged-life-expectancy';
import { getRelativeDifference } from './test-utils';
import { expect } from 'chai';
import { TestAssetsFolderPath } from './constants';

test(`Life table calculations`, t => {
    t.test(`Abridged life table calculations`, t => {
        // Reference life table
        // tslint:disable-next-line:max-line-length
        const refLifeTable = require(`${TestAssetsFolderPath}/life-table/abridged-life-table/ref-abridged-life-table.json`);
        const abridgedLifeExpectancy = new AbridgedLifeExpectancy(
            {} as Model<CoxSurvivalAlgorithm>,
            refLifeTable,
        );

        // tslint:disable-next-line:max-line-length
        const expectedLifeTable: CompleteLifeTable = require(`${TestAssetsFolderPath}/life-table/abridged-life-table/male-complete-life-table.json`);
        const actualLifeTable = abridgedLifeExpectancy[
            'getCompleteLifeTable'
        ](refLifeTable.male, 80, [80, 75]);

        expectedLifeTable.forEach((expectedLifeTableRow, index) => {
            expect(
                getRelativeDifference(
                    actualLifeTable[index].ex,
                    expectedLifeTableRow.ex,
                ),
            ).to.be.lessThan(
                1,
                `
                    Expected Value: ${expectedLifeTableRow.ex}
                    Actual Value:   ${actualLifeTable[index].ex}
                `,
            );
        });

        t.pass(`Abridged life table correctly calculated`);
        t.end();
    });
});
