import * as chai from 'chai';
const { expect } = chai;
import * as fs from 'fs';
import * as path from 'path';
const xPath = require('xpath.js');
import * as xmlDom from 'xmldom';
const xmlDomParser = xmlDom.DOMParser;
var csvParse = require('csv-parse/lib/sync');

import { transformPhiatDictionaryToPmml, BaseDataField, ActiveUsageType, WebSpecificationsAlgorithmInfoCsvRow } from '../../../../models/transformers/pmml/web_specifications';
import { pmmlXmlStringsToJson } from '../../../../models/parsers/pmml/pmml';
import { CovariateJson } from '../../../../models/parsers/json/data_fields/covariate';
import { AlgorithmJson } from '../../../../models/parsers/json/algorithm';
import { AlgorithmType } from '../../../../models/parsers/json/algorithm_type';

describe(`Web specifications transformer`, function () {
    describe(`Converting to a GeneralRegressionModel`, async function () {
        let webSpecificationsCsv: Array<BaseDataField>;
        let webSpecificationsAlgorithmInfoCsv: Array<WebSpecificationsAlgorithmInfoCsvRow>;
        let webSpecificationsPmmlJson: AlgorithmJson;
        const baselineHazard = Math.random();

        before(async function () {
            const webSpecificationsCsvString = fs.readFileSync(
                path.join(
                    __dirname,
                    '../../../../../assets/testing_regression.csv'
                ),
                'utf8'
            );
            webSpecificationsCsv = csvParse(webSpecificationsCsvString, {
                columns: true
            });

            const webSpecificiationsAlgorithmInfoCsvString = fs.readFileSync(
                path.join(
                    __dirname,
                    '../../../../../assets/testing_regression_algorithm_info.csv'
                ),
                'utf8'
            );
            webSpecificationsAlgorithmInfoCsv = csvParse(
                webSpecificiationsAlgorithmInfoCsvString, {
                    columns: true
                }
            );

            const pmmlXmlString = transformPhiatDictionaryToPmml(
                webSpecificationsCsvString,
                '',
                'both',
                false,
                true,
                baselineHazard,
                webSpecificiationsAlgorithmInfoCsvString
            );
            webSpecificationsPmmlJson = await pmmlXmlStringsToJson(
                [pmmlXmlString]
            );
        });

        it(`should correctly set the covariates and their betas`, function () {
            const covariateCsvRows: Array<BaseDataField> = webSpecificationsCsv
                .filter((webSpecificationsCsvRow: BaseDataField) => {
                    return webSpecificationsCsvRow.usageType === ActiveUsageType;
                });
            
            covariateCsvRows.forEach((covariateCsvRow) => {
                const foundCovariateJson = webSpecificationsPmmlJson.covariates
                    .find((covariateJson) => {
                        return covariateJson.name === covariateCsvRow.Name;
                    });
                
                expect(foundCovariateJson).to.exist;

                expect((foundCovariateJson as CovariateJson).beta).to
                .equal(Number(covariateCsvRow.betacoefficent))
            });
        });

        it(`should correctly set the baselineHazard`, function () {
            expect(webSpecificationsPmmlJson.baselineHazard).to
                .equal(baselineHazard);
        });
        
        it(`should correctly set the type field`, function () {
            expect(webSpecificationsPmmlJson.type).to
                .equal(AlgorithmType.LogisticRegression);
        });
    });
});