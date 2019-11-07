import * as test from 'tape';
import {
    Data,
    isEqual as isDataOneEqualToDataTwo,
    findDatumWithName,
} from '../engine/data/data';
import { getLeafFieldsForDerivedField } from '../engine/data-field/derived-field/derived-field';
import { expect } from 'chai';
import { runIntegrationTest } from './test-utils';
import { Covariate } from '../engine/data-field/covariate/covariate';
import { IUserFunctions } from '../engine/algorithm/user-functions/user-functions';
import { ITables } from '../engine/algorithm/tables/tables';

function formatTestingDataCsvColumn(column: any): string | number | undefined {
    if (column === 'NA') {
        return undefined;
    } else if (isNaN(column)) {
        return column;
    } else {
        return Number(column);
    }
}

function getTestingDataForCovariate(
    covariate: Covariate,
    allData: Data,
): {
    inputData: Data;
    expectedOutput: number | null;
} {
    if (covariate.derivedField) {
        const leafFields = getLeafFieldsForDerivedField(covariate.derivedField);
        const leadFieldNames = leafFields.map(leafField => leafField.name);

        const inputData = allData
            .filter(datum => {
                return leadFieldNames.indexOf(datum.name) > -1;
            })
            .map(datum => {
                return Object.assign({}, datum, {
                    coefficent: formatTestingDataCsvColumn(datum.coefficent),
                });
            });

        const expectedOutput = formatTestingDataCsvColumn(
            findDatumWithName(covariate.name, allData).coefficent,
        ) as number | null;

        return {
            inputData,
            expectedOutput,
        };
    } else {
        return {
            inputData: [],
            expectedOutput: null,
        };
    }
}

function testCovariateTransformations(
    covariate: Covariate,
    inputData: Data,
    expectedOutput: number | null,
    userFunctions: IUserFunctions,
    tables: ITables,
) {
    if (!covariate.derivedField) {
        return;
    }

    // tslint:disable-next-line
    isDataOneEqualToDataTwo;
    // tslint:disable-next-line
    /*(const DataToDebug = [
        { name: 'age', coefficent: 20 },
        { name: 'lpa_lpa0', coefficent: 'Yes' },
        { name: 'lpa_lpa1', coefficent: 'Yes' },
        { name: 'lpam_lpa1', coefficent: 'lpa60' },
        { name: 'lpat_lpa1', coefficent: 5 },
        { name: 'lpa_lpa2', coefficent: 'Yes' },
        { name: 'lpam_lpa2', coefficent: 'lpa61' },
        { name: 'lpat_lpa2', coefficent: 70 },
        { name: 'lpa_lpa3', coefficent: 'Yes' },
        { name: 'lpam_lpa3', coefficent: 'lpa60' },
        { name: 'lpat_lpa3', coefficent: 20 },
        { name: 'lpa_lpa4', coefficent: 'Yes' },
        { name: 'lpam_lpa4', coefficent: 'lpa30' },
        { name: 'lpat_lpa4', coefficent: 70 },
        { name: 'lpa_lpa5', coefficent: 'Yes' },
        { name: 'lpam_lpa5', coefficent: 'lpa61' },
        { name: 'lpat_lpa5', coefficent: 2 },
        { name: 'lpa_lpa6', coefficent: 'Yes' },
        { name: 'lpam_lpa6', coefficent: 'lpa30' },
        { name: 'lpat_lpa6', coefficent: 20 },
        { name: 'lpa_lpa7', coefficent: 'Yes' },
        { name: 'lpam_lpa7', coefficent: 'lpa61' },
        { name: 'lpat_lpa7', coefficent: 70 },
        { name: 'lpa_lpa8', coefficent: 'Yes' },
        { name: 'lpam_lpa8', coefficent: 'lpa60' },
        { name: 'lpat_lpa8', coefficent: 5 },
        { name: 'lpa_lpa9', coefficent: 'Yes' },
        { name: 'lpam_lpa9', coefficent: 'lpa30' },
        { name: 'lpat_lpa9', coefficent: 5 },
        { name: 'lpa_lpa10', coefficent: 'Yes' },
        { name: 'lpam_lpa10', coefficent: 'lpa30' },
        { name: 'lpat_lpa10', coefficent: 15 },
        { name: 'lpa_lpa11', coefficent: 'Yes' },
        { name: 'lpam_lpa11', coefficent: 'lpa61' },
        { name: 'lpat_lpa11', coefficent: 5 },
        { name: 'lpa_lpa12', coefficent: 'Yes' },
        { name: 'lpam_lpa12', coefficent: 'lpa61' },
        { name: 'lpat_lpa12', coefficent: 4 },
        { name: 'lpa_lpa13', coefficent: 'Yes' },
        { name: 'lpam_lpa13', coefficent: 'lpa61' },
        { name: 'lpat_lpa13', coefficent: 4 },
        { name: 'lpa_lpa14', coefficent: 'Yes' },
        { name: 'lpam_lpa14', coefficent: 'lpa61' },
        { name: 'lpat_lpa14', coefficent: 1 },
        { name: 'lpa_lpa15', coefficent: 'Yes' },
        { name: 'lpam_lpa15', coefficent: 'lpa61' },
        { name: 'lpat_lpa15', coefficent: 1 },
        { name: 'lpa_lpa16', coefficent: 'Yes' },
        { name: 'lpam_lpa16', coefficent: 'lpa60' },
        { name: 'lpat_lpa16', coefficent: 10 },
        { name: 'lpa_lpa17', coefficent: 'Yes' },
        { name: 'lpam_lpa17', coefficent: 'lpa60' },
        { name: 'lpat_lpa17', coefficent: 2 },
        { name: 'lpa_lpa18', coefficent: 'Yes' },
        { name: 'lpam_lpa18', coefficent: 'lpa30' },
        { name: 'lpat_lpa18', coefficent: 2 },
        { name: 'lpa_lpa19', coefficent: 'Yes' },
        { name: 'lpam_lpa19', coefficent: 'lpa60' },
        { name: 'lpat_lpa19', coefficent: 6 },
        { name: 'lpa_lpa20', coefficent: 'Yes' },
        { name: 'lpam_lpa20', coefficent: 'lpa30' },
        { name: 'lpat_lpa20', coefficent: 3 },
        { name: 'lpa_lpa21', coefficent: 'No' },
        { name: 'lpam_lpa21' },
        { name: 'lpat_lpa21' },
        { name: 'lpa_lpa22', coefficent: 'Yes' },
        { name: 'lpam_lpa22', coefficent: 'lpa30' },
        { name: 'lpat_lpa22', coefficent: 2 },
    ];
    const CovariateToDebug = 'AgeCXPhysicalActivityC_int';
    if (
        !isDataOneEqualToDataTwo(DataToDebug, inputData) ||
        covariate.name !== CovariateToDebug
    ) {
        return;
    }*/

    const derivedField = covariate.derivedField;

    const actualOutput = derivedField.calculateCoefficent(
        inputData,
        userFunctions,
        tables,
    );

    if (isNaN(actualOutput as number) && expectedOutput === undefined) {
        return;
    }
    if ((actualOutput as number) === 0 && (expectedOutput as number) === 0) {
        return;
    }

    const diffError =
        ((expectedOutput as number) - (actualOutput as number)) /
        (expectedOutput as number);

    // tslint:disable-next-line
    expect(
        diffError < 0.00001 || diffError === 0,
        `Derived Field: ${(derivedField as any).name}
        Input Data: ${JSON.stringify(inputData)}
        Actual Output: ${actualOutput}
        ExpectedOutput: ${expectedOutput}
        DiffError: ${diffError}`,
    ).to.be.true;
}

test.skip(`Testing local transformations`, async t => {
    runIntegrationTest(
        'local-transformations',
        'local-transformations',
        'Local Transformations',
        ['Sodium', 'SPoRT', 'RESPECT'],
        (algorithm, data) => {
            algorithm.covariates.forEach(covariate => {
                const {
                    inputData,
                    expectedOutput,
                } = getTestingDataForCovariate(covariate, data);

                testCovariateTransformations(
                    covariate,
                    inputData,
                    expectedOutput,
                    algorithm.userFunctions,
                    algorithm.tables,
                );
            });
        },
        t,
    );
});
