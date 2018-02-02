import * as fs from 'fs';
import { transformPhiatDictionaryToPmml } from '../pmml-transformers/web-specifications';
import { limesurveyTxtStringToPmmlString } from '../pmml-transformers/limesurvey';
import { pmmlXmlStringsToJson } from '../pmml-to-json-parser/pmml';
import * as path from 'path';
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
import { JsonModelTypes } from '../model';
import { SingleAlgorithmModelJson } from '../single-algorithm-model';
import { MultipleAlgorithmModelJson } from '../multiple-algorithm-model';
import { parseModelJsonToModel } from '../model';
import { SurvivalModelFunctions } from './survival-model-functions';
import { ModelTypes } from '../model/model-types';
import { Cox } from '../cox/index';
import { GeneralRegressionModelType } from '../pmml/general_regression_model/general_regression_model';
import { IAlgorithmInfoCsvRow } from '../pmml-transformers/algorithm-info';
import {
    BinsLookup,
    convertBinsDataCsvToBinsData,
    convertBinsLookupCsvToBinsLookup,
    IBinsData,
} from '../cox/bins';
import { AlgorithmType } from '../algorithm/algorithm-type';

export type BuildFromAssetsFolderFunction = (
    assetsFolderPath: string,
) => Promise<SurvivalModelFunctions>;

export interface IBuildFromAssetsFolder {
    buildFromAssetsFolder: BuildFromAssetsFolderFunction;
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

function getBinsDataAndLookup(
    algorithmDirectoryPath: string,
): { binsData?: IBinsData; binsLookup?: BinsLookup } {
    const binsDataCsvPath = `${algorithmDirectoryPath}/bins-data.csv`;
    const binsLookupCsvPath = `${algorithmDirectoryPath}/bin-lookup.csv`;

    return {
        binsData: fs.existsSync(binsDataCsvPath)
            ? convertBinsDataCsvToBinsData(
                  fs.readFileSync(binsDataCsvPath, 'utf8'),
              )
            : undefined,
        binsLookup: fs.existsSync(binsLookupCsvPath)
            ? convertBinsLookupCsvToBinsLookup(
                  fs.readFileSync(binsLookupCsvPath, 'utf8'),
              )
            : undefined,
    };
}

async function buildSingleAlgorithmModelJson(
    assetsFolderPath: string,
    limesurveyPmmlString: string | undefined,
    webSpecifictaionsCsvString: string | undefined,
    webSpecifictationsCategoriesCsvString: string | undefined,
    algorithmName: string,
    algorithmInfo: IAlgorithmInfoCsvRow,
): Promise<SingleAlgorithmModelJson> {
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
    const singleAlgorithmJson = (await pmmlXmlStringsToJson(
        [
            pmmlFileStrings
                .concat(webSpecificationsPmml ? webSpecificationsPmml : [])
                .concat(limesurveyPmmlString ? limesurveyPmmlString : []),
        ],
        [],
    )) as SingleAlgorithmModelJson;

    if (singleAlgorithmJson.algorithm.algorithmType === AlgorithmType.Cox) {
        return Object.assign({}, singleAlgorithmJson, {
            algorithm: Object.assign(
                {},
                singleAlgorithmJson.algorithm,
                getBinsDataAndLookup(assetsFolderPath),
            ),
        });
    } else {
        return singleAlgorithmJson;
    }
}

async function buildMultipleAlgorithmModelJson(
    assetsFolderPath: string,
    webSpecificationsCsvString: string | undefined,
    webSpecificationsCategoriesCsvString: string | undefined,
    limesurveyPmml: string | undefined,
    algorithmName: string,
    algorithmInfo: IAlgorithmInfoCsvRow,
): Promise<MultipleAlgorithmModelJson> {
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
    const maleAlgorithmPmmlFileString = malePmmlFileStrings
        .concat(maleWebSpecificationsPmml ? maleWebSpecificationsPmml : [])
        .concat(limesurveyPmml ? limesurveyPmml : []);

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
    const femaleAlgorithmPmmlStrings = femalePmmlFileStrings
        .concat(femaleWebSpecificationsPmml ? femaleWebSpecificationsPmml : [])
        .concat(limesurveyPmml ? limesurveyPmml : []);

    // Construct and return the MultipleAlgorithmJson object
    return (await pmmlXmlStringsToJson(
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
    )) as MultipleAlgorithmModelJson;
}

export function getBuildFromAssetsFolder(): IBuildFromAssetsFolder {
    return {
        buildFromAssetsFolder: async assetsFolderPath => {
            // Get the name of the algorithm from the assetsFolderPath
            const currentAlgorithmName = path.basename(assetsFolderPath);

            let limesurveyPmml;
            if (fs.existsSync(`${assetsFolderPath}/limesurvey.txt`)) {
                // Get the limesurvye txt file string
                const limesurveyTxtString = fs.readFileSync(
                    `${assetsFolderPath}/limesurvey.txt`,
                    'utf8',
                );
                limesurveyPmml = limesurveyTxtStringToPmmlString(
                    limesurveyTxtString,
                );
            }

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
            const algorithmsInfoTable: Array<{
                AlgorithmName: string;
                GenderSpecific: 'true' | 'false';
                BaselineHazard: string;
                RegressionType: GeneralRegressionModelType;
            }> = csvParse(
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
            let modelJson: JsonModelTypes;
            if (currentAlgorithmInfoFile.GenderSpecific === 'true') {
                modelJson = await buildMultipleAlgorithmModelJson(
                    assetsFolderPath,
                    webSpecificationsCsvString,
                    webSpecificationsCategoriesCsvString,
                    limesurveyPmml,
                    currentAlgorithmName,
                    currentAlgorithmInfoFile,
                );
            } else {
                modelJson = await buildSingleAlgorithmModelJson(
                    assetsFolderPath,
                    limesurveyPmml,
                    webSpecificationsCsvString,
                    webSpecificationsCategoriesCsvString,
                    currentAlgorithmName,
                    currentAlgorithmInfoFile,
                );
            }

            const model = parseModelJsonToModel(modelJson);

            return new SurvivalModelFunctions(
                model as ModelTypes<Cox>,
                modelJson,
            );
        },
    };
}
