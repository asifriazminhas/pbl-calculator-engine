import { parseCoxJsonToCox } from '../engine/json-parser/cox';
import { Cox } from '../engine/cox/cox';
import { AlgorithmBuilder } from '../engine/algorithm-builder/algorithm-builder';
import { calculateCoefficent } from '../engine/cox/derived-field';
import * as path from 'path';
var csvParse = require('csv-parse/lib/sync');
const assetsDir = path.join(__dirname, '../../assets/test');
import { expect } from 'chai';
import * as fs from 'fs';
import { Data } from '../engine/common/data';
import { } from '../engine/cox/covariate';

describe.only(`Testing local transformations`, function() {
    function formatInputData(inputData: {
        [index: string]: any
    }): Data {
        return Object.keys(inputData)
            .map((inputDataKey) => {
                const inputDatum = inputData[inputDataKey];
                let formattedDatum = null;

                if(inputDatum === 'NA') {
                    formattedDatum = null;
                }
                else if(isNaN(inputDatum)) {
                    formattedDatum = inputDatum;
                }
                else {
                    formattedDatum = Number(inputDatum);
                }

                return {
                    name: inputDataKey,
                    coefficent: formattedDatum
                };
            });
    }

    before(async function() {
        const coxJson = (await AlgorithmBuilder
            .buildSurvivalAlgorithm()
            .buildFromAssetsFolder(
                path.join(
                    `${assetsDir}/algorithms/mport`
                )
            ))
            .toJson();
        const cox = parseCoxJsonToCox(coxJson);
        
        const localTransformationsTestingData: Array<{
            [index: string]: string
        }> = csvParse(
            fs.readFileSync(
                path.join(`${assetsDir}/local-transformations/smoketest.csv`),
                'utf8'
            ),
            {
                columns: true
            }
        );

        const nonCovariateColumnsInTestingData = Object
            .keys(localTransformationsTestingData[0])
            .filter((localTransformationsTestingDataColumnName) => {
                const covariateWithSameColumnName = cox
                    .covariates
                    .find(covariate => covariate.name === localTransformationsTestingDataColumnName);

                return covariateWithSameColumnName ? false : true;
            });
        const covariateColumnsInTestingData = Object
            .keys(localTransformationsTestingData[0])
            .filter((localTransformationsTestingDataColumnName) => {
                return nonCovariateColumnsInTestingData
                    .indexOf(localTransformationsTestingDataColumnName) === -1 && localTransformationsTestingDataColumnName != "";
            });

        const testingDataWithoutCovariateColumns: Array<any> = [];
        localTransformationsTestingData
            .forEach((localTransformationsTestingDatum) => {
                const testingDatum: any = {};
                nonCovariateColumnsInTestingData.forEach((columnName) => {
                    testingDatum[columnName] = localTransformationsTestingDatum[columnName]
                });

                testingDataWithoutCovariateColumns.push(testingDatum)
            });

        const testingDataWithCovariateColumns: Array<any> = [];
        localTransformationsTestingData
            .forEach((localTransformationsTestingDatum) => {
                const testingDatum: any = {};
                covariateColumnsInTestingData.forEach((columnName) => {
                    testingDatum[columnName] = localTransformationsTestingDatum[columnName]
                });

                testingDataWithCovariateColumns.push(testingDatum)
            });

        this.input = testingDataWithoutCovariateColumns;
        this.output = testingDataWithCovariateColumns;
        this.cox = cox;
    });

    it(`should properly the local transformations`, function() {
        const cox: Cox = this.cox;
        const outputKeys: Array<string> = Object.keys(this.output[0]);
        const derivedFieldForEachOutputKey = outputKeys
            .map((outputKey) => {
                const covariateFound = cox
                    .covariates
                    .find(covariate => covariate.name === outputKey);
                if(!covariateFound) {
                    throw new Error('')
                }

                if(!covariateFound.derivedField) {
                    throw new Error('')
                }

                return covariateFound.derivedField;
            });

        this.input.forEach((inputData: any, index: number) => {
            const outputForCurrentInput = this.output[index];
            const data: Data = formatInputData(inputData)

            derivedFieldForEachOutputKey
                .forEach((derivedField) => {
                    const actualOutput = calculateCoefficent(
                        derivedField, data, cox.userFunctions
                    );
                    let expectedOutput = outputForCurrentInput[derivedField.name];
                    if(expectedOutput === 'NA') {
                        expectedOutput = null
                    }

                    let diffError = (expectedOutput - (actualOutput as number))/expectedOutput;
                    if(expectedOutput == 0 && actualOutput == 0) {
                        diffError = 0;
                    }
                    else if(expectedOutput === null && actualOutput === null) {
                        diffError = 0;
                    }

                    expect(diffError < 0.00001 || diffError === 0, `DerivedField ${derivedField.name}. Input Row: ${index}. Actual Output: ${actualOutput}. ExpectedOutput: ${expectedOutput}. DiffError: ${diffError}`).to.be.true
                });
        });
    });
});