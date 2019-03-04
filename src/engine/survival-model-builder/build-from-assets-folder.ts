import * as fs from 'fs';
import { transformPhiatDictionaryToPmml } from '../pmml-transformers/web-spec/web-spec-v1';
import * as path from 'path';
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
import { SurvivalModelFunctions } from './survival-model-functions';
import {
    IAlgorithmInfoCsvRow,
    AlgorithmInfoCsv,
} from '../pmml-transformers/algorithm-info';
import {
    IBinsLookupJsonItem,
    PositiveInfinityString,
    NegativeInfinityString,
} from '../../parsers/json/json-bins';
import { IBinsData } from '../algorithm/regression-algorithm/cox-survival-algorithm/bins/bins';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';
import { Model } from '../model/model';
import { IModelJson } from '../../parsers/json/json-model';
import { pmmlXmlStringsToJson } from '../../parsers/pmml-to-json-parser/pmml';

export type BuildFromAssetsFolderFunction = (
    assetsFolderPath: string,
) => Promise<SurvivalModelFunctions>;

export interface IBuildFromAssetsFolder {
    buildFromAssetsFolder: BuildFromAssetsFolderFunction;
}

export type BinsDataCsv = IBinsDataCsvRow[];

export interface IBinsDataCsvRow {
    Percent: string;
    [index: string]: string;
}

export function convertBinsDataCsvToBinsData(
    binsDataCsvString: string,
): IBinsData {
    const binsDataCsv: BinsDataCsv = csvParse(binsDataCsvString, {
        columns: true,
    });

    /* This object has all the bins numbers as the field names but the actual
    values are just empty objects i.e. the data for each percent is not in there */
    const binsDataWithoutPercents: IBinsData =
        /* Start with getting all the column names in the first csv row */
        Object.keys(binsDataCsv[0])
            /* Remove the Percent column. All the other colums are the bin
            numbers as strings */
            .filter(binsDataCsvColumn => binsDataCsvColumn !== 'Percent')
            /* Convert them to a number */
            .map(Number)
            /* Convert it to the object */
            .reduce(
                (currentBinsData, currentBinDataCsvBinNumber) => {
                    /* Return an object which is a concatination of the
                    previous objects along with the current bin number */
                    return {
                        ...currentBinsData,
                        [currentBinDataCsvBinNumber]: [],
                    };
                },
                {} as IBinsData,
            );

    const binNumbers = Object.keys(binsDataCsv[0])
        .filter(binsDataCsvColumn => {
            return binsDataCsvColumn !== 'Percent';
        })
        .map(Number);

    binsDataCsv.forEach(binsDataCsvRow => {
        binNumbers.forEach(binNumber => {
            binsDataWithoutPercents[binNumber].push({
                survivalPercent: Number(binsDataCsvRow.Percent),
                time: isNaN(Number(binsDataCsvRow[String(binNumber)]))
                    ? undefined
                    : Number(binsDataCsvRow[String(binNumber)]),
            });
        });
    });

    return binsDataWithoutPercents;
}

export interface IBinsLookupCsvRow {
    BinNumber: string;
    MinXscore: string;
    MaxXscore: string;
}

function validateBinsLookupCsvRowScore(score: string): boolean {
    return !isNaN(Number(score))
        ? true
        : score === PositiveInfinityString || score === NegativeInfinityString;
}

function validateBinsLookupCsvRowBinNumber(
    binNumber: IBinsLookupCsvRow['BinNumber'],
): boolean {
    return !isNaN(Number(binNumber));
}

export function convertBinsLookupCsvToBinsLookupJson(
    binsLookupCsvString: string,
): IBinsLookupJsonItem[] {
    const binsLookupCsv: IBinsLookupCsvRow[] = csvParse(binsLookupCsvString, {
        columns: true,
    });

    return binsLookupCsv.map((binsLookupCsvRow, index) => {
        const rowNumber = index + 2;

        if (!validateBinsLookupCsvRowScore(binsLookupCsvRow.MaxXscore)) {
            throw new Error(
                `Invalid MaxXscore value ${binsLookupCsvRow.MaxXscore} in row ${rowNumber}`,
            );
        }

        if (!validateBinsLookupCsvRowScore(binsLookupCsvRow.MinXscore)) {
            throw new Error(
                `Invalid MinXscore value ${binsLookupCsvRow.MinXscore} in row ${rowNumber}`,
            );
        }

        if (!validateBinsLookupCsvRowBinNumber(binsLookupCsvRow.BinNumber)) {
            throw new Error(
                `Invalid Bin Number value ${binsLookupCsvRow.BinNumber} in row ${rowNumber}`,
            );
        }

        return {
            binNumber: Number(binsLookupCsvRow.BinNumber),
            minScore: isNaN(Number(binsLookupCsvRow.MinXscore))
                ? binsLookupCsvRow.MinXscore as 'infinity'
                : Number(binsLookupCsvRow.MinXscore),
            maxScore: isNaN(Number(binsLookupCsvRow.MaxXscore))
                ? binsLookupCsvRow.MaxXscore as 'infinity'
                : Number(binsLookupCsvRow.MaxXscore),
        };
    });
}

function getPmmlFileStringsSortedByPriorityInFolder(
    assetsFolderPath: string,
): string[] {
    // Get the names of all the files in the assets directory
    const assetFileNames = fs.readdirSync(assetsFolderPath);

    return assetFileNames
        .filter(pmmlFileName => pmmlFileName.indexOf('.xml') > -1)
        .map(pmmlFileName => pmmlFileName.split('.')[0])
        .map(pmmlFileName => Number(pmmlFileName))
        .sort((pmmlFileNameOne, pmmlFileNameTwo) => {
            return pmmlFileNameOne > pmmlFileNameTwo ? 1 : -1;
        })
        .map(pmmlFileName => '' + pmmlFileName)
        .map(pmmlFileName =>
            fs.readFileSync(`${assetsFolderPath}/${pmmlFileName}.xml`, 'utf8'),
        );
}

async function buildSingleAlgorithmModelJson(
    assetsFolderPath: string,
    webSpecifictaionsCsvString: string | undefined,
    webSpecifictationsCategoriesCsvString: string | undefined,
    algorithmName: string,
    algorithmInfo: IAlgorithmInfoCsvRow,
): Promise<IModelJson> {
    // Get the pmml file strings in the directory sorted by priority
    const pmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(
        assetsFolderPath,
    );

    let webSpecificationsPmml;
    if (webSpecifictaionsCsvString) {
        // Convert webSpecificationsCsvString to Pmml file for both genders
        webSpecificationsPmml = transformPhiatDictionaryToPmml(
            algorithmName,
            webSpecifictaionsCsvString,
            webSpecifictationsCategoriesCsvString as string,
            algorithmInfo,
            'both',
            false,
            false,
        );
    }

    // Return SingleAlgorithmModelJson
    const singleAlgorithmJson = await pmmlXmlStringsToJson(
        [
            pmmlFileStrings.concat(
                webSpecificationsPmml ? webSpecificationsPmml : [],
            ),
        ],
        [
            {
                equation: 'true',
                variables: [],
            },
        ],
    );

    if (fs.existsSync(`${assetsFolderPath}/bins-data.csv`)) {
        singleAlgorithmJson.algorithms[0].algorithm.bins = {
            binsData: convertBinsDataCsvToBinsData(
                fs.readFileSync(`${assetsFolderPath}/bins-data.csv`, 'utf8'),
            ),
            binsLookup: convertBinsLookupCsvToBinsLookupJson(
                fs.readFileSync(`${assetsFolderPath}/bin-lookup.csv`, 'utf8'),
            ),
        };
    }

    return singleAlgorithmJson;
}

async function buildMultipleAlgorithmModelJson(
    assetsFolderPath: string,
    webSpecificationsCsvString: string | undefined,
    webSpecificationsCategoriesCsvString: string | undefined,
    algorithmName: string,
    algorithmInfo: IAlgorithmInfoCsvRow,
): Promise<IModelJson> {
    // get the pmml file strings sorted by priority for the male algorithm
    const malePmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(
        `${assetsFolderPath}/male`,
    );

    let maleWebSpecificationsPmml;
    if (webSpecificationsCsvString) {
        // get the web specifications pmml string for the male model
        maleWebSpecificationsPmml = transformPhiatDictionaryToPmml(
            algorithmName,
            webSpecificationsCsvString,
            webSpecificationsCategoriesCsvString as string,
            algorithmInfo,
            'Male',
            false,
            false,
        );
    }

    // make the array of pmml strings for the male model
    const maleAlgorithmPmmlFileString = malePmmlFileStrings.concat(
        maleWebSpecificationsPmml ? maleWebSpecificationsPmml : [],
    );

    // get the pmml file string sorted by priority for the female algorithm
    const femalePmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(
        `${assetsFolderPath}/female`,
    );

    let femaleWebSpecificationsPmml;
    if (webSpecificationsCsvString) {
        // get the web specifications pmml string for the female model
        femaleWebSpecificationsPmml = transformPhiatDictionaryToPmml(
            algorithmName,
            webSpecificationsCsvString,
            webSpecificationsCategoriesCsvString as string,
            algorithmInfo,
            'Female',
            false,
            false,
        );
    }

    // make the array of pmml string for the female model
    const femaleAlgorithmPmmlStrings = femalePmmlFileStrings.concat(
        femaleWebSpecificationsPmml ? femaleWebSpecificationsPmml : [],
    );

    // Construct and return the MultipleAlgorithmJson object
    const multipleAlgorithmModel = (await pmmlXmlStringsToJson(
        [maleAlgorithmPmmlFileString, femaleAlgorithmPmmlStrings],
        [
            {
                equation: `predicateResult = obj['sex'] === 'male'`,
                variables: ['sex'],
            },
            {
                equation: `predicateResult = obj['sex'] === 'female'`,
                variables: ['sex'],
            },
        ],
    )) as IModelJson;
    multipleAlgorithmModel.algorithms.forEach(({ algorithm }) => {
        (algorithm as ICoxSurvivalAlgorithmJson).timeMetric =
            algorithmInfo.TimeMetric;
        (algorithm as ICoxSurvivalAlgorithmJson).maximumTime = Number(
            algorithmInfo.MaximumTime,
        );
    });

    return multipleAlgorithmModel;
}

export function getBuildFromAssetsFolder(): IBuildFromAssetsFolder {
    return {
        buildFromAssetsFolder: async assetsFolderPath => {
            // Get the name of the algorithm from the assetsFolderPath
            const currentAlgorithmName = path.basename(assetsFolderPath);

            let webSpecificationsCsvString;
            let webSpecificationsCategoriesCsvString;
            if (fs.existsSync(`${assetsFolderPath}/web_specifications.csv`)) {
                // Get web specifications csv file string
                webSpecificationsCsvString = fs.readFileSync(
                    `${assetsFolderPath}/web_specifications.csv`,
                    'utf8',
                );

                // Get the web specifications categories csv file string
                webSpecificationsCategoriesCsvString = fs.readFileSync(
                    `${assetsFolderPath}/web_specifications_categories.csv`,
                    'utf8',
                );
            }

            // Parse the algorithm info csv file
            const algorithmsInfoTable: AlgorithmInfoCsv = csvParse(
                fs.readFileSync(
                    `${assetsFolderPath}/algorithm_info.csv`,
                    'utf8',
                ),
                {
                    columns: true,
                },
            );

            // Get the row with the algorithm we need construct
            const currentAlgorithmInfoFile = algorithmsInfoTable.find(
                algorithmInfoRow =>
                    algorithmInfoRow.AlgorithmName === currentAlgorithmName,
            );
            if (!currentAlgorithmInfoFile) {
                throw new Error(
                    `No info found for algorithm with name ${currentAlgorithmName}`,
                );
            }

            /*Call the right method depending on whether it's a
            MultipleAlgorithm or a SingleAlgorithm type of model*/
            let modelJson: IModelJson;
            if (currentAlgorithmInfoFile.GenderSpecific === 'true') {
                modelJson = await buildMultipleAlgorithmModelJson(
                    assetsFolderPath,
                    webSpecificationsCsvString,
                    webSpecificationsCategoriesCsvString,
                    currentAlgorithmName,
                    currentAlgorithmInfoFile,
                );
            } else {
                modelJson = await buildSingleAlgorithmModelJson(
                    assetsFolderPath,
                    webSpecificationsCsvString,
                    webSpecificationsCategoriesCsvString,
                    currentAlgorithmName,
                    currentAlgorithmInfoFile,
                );
            }

            const model = new Model(modelJson);

            return new SurvivalModelFunctions(model, modelJson);
        },
    };
}
