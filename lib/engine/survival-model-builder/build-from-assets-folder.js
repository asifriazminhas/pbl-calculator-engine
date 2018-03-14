"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const web_specifications_1 = require("../pmml-transformers/web-specifications");
const limesurvey_1 = require("../pmml-transformers/limesurvey");
const pmml_1 = require("../pmml-to-json-parser/pmml");
const path = require("path");
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
const model_1 = require("../model");
const survival_model_functions_1 = require("./survival-model-functions");
const bins_1 = require("../cox/bins/bins");
const bins_json_1 = require("../cox/bins/bins-json");
const algorithm_type_1 = require("../algorithm/algorithm-type");
function getPmmlFileStringsSortedByPriorityInFolder(assetsFolderPath) {
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
        .map(pmmlFileName => fs.readFileSync(`${assetsFolderPath}/${pmmlFileName}.xml`, 'utf8'));
}
function getBinsDataAndLookup(algorithmDirectoryPath) {
    const binsDataCsvPath = `${algorithmDirectoryPath}/bins-data.csv`;
    const binsLookupCsvPath = `${algorithmDirectoryPath}/bin-lookup.csv`;
    return {
        binsData: fs.existsSync(binsDataCsvPath)
            ? bins_1.convertBinsDataCsvToBinsData(fs.readFileSync(binsDataCsvPath, 'utf8'))
            : undefined,
        binsLookup: fs.existsSync(binsLookupCsvPath)
            ? bins_json_1.convertBinsLookupCsvToBinsLookupJson(fs.readFileSync(binsLookupCsvPath, 'utf8'))
            : undefined,
    };
}
function buildSingleAlgorithmModelJson(assetsFolderPath, limesurveyPmmlString, webSpecifictaionsCsvString, webSpecifictationsCategoriesCsvString, algorithmName, algorithmInfo) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // Get the pmml file strings in the directory sorted by priority
        const pmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(assetsFolderPath);
        let webSpecificationsPmml;
        if (webSpecifictaionsCsvString) {
            // Convert webSpecificationsCsvString to Pmml file for both genders
            webSpecificationsPmml = web_specifications_1.transformPhiatDictionaryToPmml(algorithmName, webSpecifictaionsCsvString, webSpecifictationsCategoriesCsvString, algorithmInfo, 'both', false, false);
        }
        // Return SingleAlgorithmModelJson
        const singleAlgorithmJson = (yield pmml_1.pmmlXmlStringsToJson([
            pmmlFileStrings
                .concat(webSpecificationsPmml ? webSpecificationsPmml : [])
                .concat(limesurveyPmmlString ? limesurveyPmmlString : []),
        ], []));
        if (singleAlgorithmJson.algorithm.algorithmType === algorithm_type_1.AlgorithmType.Cox) {
            return Object.assign({}, singleAlgorithmJson, {
                algorithm: Object.assign({}, singleAlgorithmJson.algorithm, getBinsDataAndLookup(assetsFolderPath), {
                    timeMetric: algorithmInfo.TimeMetric,
                    maximumTime: Number(algorithmInfo.MaximumTime),
                }),
            });
        }
        else {
            return singleAlgorithmJson;
        }
    });
}
function buildMultipleAlgorithmModelJson(assetsFolderPath, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, limesurveyPmml, algorithmName, algorithmInfo) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // get the pmml file strings sorted by priority for the male algorithm
        const malePmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(`${assetsFolderPath}/male`);
        let maleWebSpecificationsPmml;
        if (webSpecificationsCsvString) {
            // get the web specifications pmml string for the male model
            maleWebSpecificationsPmml = web_specifications_1.transformPhiatDictionaryToPmml(algorithmName, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, algorithmInfo, 'Male', false, false);
        }
        // make the array of pmml strings for the male model
        const maleAlgorithmPmmlFileString = malePmmlFileStrings
            .concat(maleWebSpecificationsPmml ? maleWebSpecificationsPmml : [])
            .concat(limesurveyPmml ? limesurveyPmml : []);
        // get the pmml file string sorted by priority for the female algorithm
        const femalePmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(`${assetsFolderPath}/female`);
        let femaleWebSpecificationsPmml;
        if (webSpecificationsCsvString) {
            // get the web specifications pmml string for the female model
            femaleWebSpecificationsPmml = web_specifications_1.transformPhiatDictionaryToPmml(algorithmName, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, algorithmInfo, 'Female', false, false);
        }
        // make the array of pmml string for the female model
        const femaleAlgorithmPmmlStrings = femalePmmlFileStrings
            .concat(femaleWebSpecificationsPmml ? femaleWebSpecificationsPmml : [])
            .concat(limesurveyPmml ? limesurveyPmml : []);
        // Construct and return the MultipleAlgorithmJson object
        const multipleAlgorithmModel = (yield pmml_1.pmmlXmlStringsToJson([maleAlgorithmPmmlFileString, femaleAlgorithmPmmlStrings], [
            {
                equation: `predicateResult = obj['sex'] === 'male'`,
                variables: ['sex'],
            },
            {
                equation: `predicateResult = obj['sex'] === 'female'`,
                variables: ['sex'],
            },
        ]));
        multipleAlgorithmModel.algorithms.forEach(({ algorithm }) => {
            algorithm.timeMetric = algorithmInfo.TimeMetric;
            algorithm.maximumTime = Number(algorithmInfo.MaximumTime);
        });
        return multipleAlgorithmModel;
    });
}
function getBuildFromAssetsFolder() {
    return {
        buildFromAssetsFolder: (assetsFolderPath) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Get the name of the algorithm from the assetsFolderPath
            const currentAlgorithmName = path.basename(assetsFolderPath);
            let limesurveyPmml;
            if (fs.existsSync(`${assetsFolderPath}/limesurvey.txt`)) {
                // Get the limesurvye txt file string
                const limesurveyTxtString = fs.readFileSync(`${assetsFolderPath}/limesurvey.txt`, 'utf8');
                limesurveyPmml = limesurvey_1.limesurveyTxtStringToPmmlString(limesurveyTxtString);
            }
            let webSpecificationsCsvString;
            let webSpecificationsCategoriesCsvString;
            if (fs.existsSync(`${assetsFolderPath}/web_specifications.csv`)) {
                // Get web specifications csv file string
                webSpecificationsCsvString = fs.readFileSync(`${assetsFolderPath}/web_specifications.csv`, 'utf8');
                // Get the web specifications categories csv file string
                webSpecificationsCategoriesCsvString = fs.readFileSync(`${assetsFolderPath}/web_specifications_categories.csv`, 'utf8');
            }
            // Parse the algorithm info csv file
            const algorithmsInfoTable = csvParse(fs.readFileSync(`${assetsFolderPath}/algorithm_info.csv`, 'utf8'), {
                columns: true,
            });
            // Get the row with the algorithm we need construct
            const currentAlgorithmInfoFile = algorithmsInfoTable.find(algorithmInfoRow => algorithmInfoRow.AlgorithmName === currentAlgorithmName);
            if (!currentAlgorithmInfoFile) {
                throw new Error(`No info found for algorithm with name ${currentAlgorithmName}`);
            }
            /*Call the right method depending on whether it's a
            MultipleAlgorithm or a SingleAlgorithm type of model*/
            let modelJson;
            if (currentAlgorithmInfoFile.GenderSpecific === 'true') {
                modelJson = yield buildMultipleAlgorithmModelJson(assetsFolderPath, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, limesurveyPmml, currentAlgorithmName, currentAlgorithmInfoFile);
            }
            else {
                modelJson = yield buildSingleAlgorithmModelJson(assetsFolderPath, limesurveyPmml, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, currentAlgorithmName, currentAlgorithmInfoFile);
            }
            const model = model_1.parseModelJsonToModel(modelJson);
            return new survival_model_functions_1.SurvivalModelFunctions(model, modelJson);
        }),
    };
}
exports.getBuildFromAssetsFolder = getBuildFromAssetsFolder;
//# sourceMappingURL=build-from-assets-folder.js.map