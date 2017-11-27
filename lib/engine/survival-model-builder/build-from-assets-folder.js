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
function buildSingleAlgorithmModelJson(assetsFolderPath, limesurveyPmmlString, webSpecifictaionsCsvString, webSpecifictationsCategoriesCsvString, algorithmName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // Get the pmml file strings in the directory sorted by priority
        const pmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(assetsFolderPath);
        // Convert webSpecificationsCsvString to Pmml file for both genders
        const webSpecificationsPmml = web_specifications_1.transformPhiatDictionaryToPmml(algorithmName, webSpecifictaionsCsvString, webSpecifictationsCategoriesCsvString, 'both', false, false, 0);
        // Return SingleAlgorithmModelJson
        return (yield pmml_1.pmmlXmlStringsToJson([pmmlFileStrings.concat([limesurveyPmmlString, webSpecificationsPmml])], []));
    });
}
function buildMultipleAlgorithmModelJson(assetsFolderPath, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, limesurveyPmml, algorithmName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // get the pmml file strings sorted by priority for the male algorithm
        const malePmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(`${assetsFolderPath}/male`);
        // get the web specifications pmml string for the male model
        const maleWebSpecificationsPmml = web_specifications_1.transformPhiatDictionaryToPmml(algorithmName, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, 'Male', false, false, 0);
        // make the array of pmml strings for the male model
        const maleAlgorithmPmmlFileString = malePmmlFileStrings.concat([
            maleWebSpecificationsPmml,
            limesurveyPmml,
        ]);
        // get the pmml file string sorted by priority for the female algorithm
        const femalePmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(`${assetsFolderPath}/female`);
        // get the web specifications pmml string for the female model
        const femaleWebSpecificationsPmml = web_specifications_1.transformPhiatDictionaryToPmml(algorithmName, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, 'Female', false, false, 0);
        // make the array of pmml string for the female model
        const femaleAlgorithmPmmlStrings = femalePmmlFileStrings.concat([
            limesurveyPmml,
            femaleWebSpecificationsPmml,
        ]);
        // Construct and return the MultipleAlgorithmJson object
        return (yield pmml_1.pmmlXmlStringsToJson([maleAlgorithmPmmlFileString, femaleAlgorithmPmmlStrings], [
            {
                equation: `predicateResult = obj['sex'] === 'male'`,
                variables: ['sex'],
            },
            {
                equation: `predicateResult = obj['sex'] === 'female'`,
                variables: ['sex'],
            },
        ]));
    });
}
function getBuildFromAssetsFolder() {
    return {
        buildFromAssetsFolder: (assetsFolderPath) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Get the name of the algorithm from the assetsFolderPath
            const currentAlgorithmName = path.basename(assetsFolderPath);
            // Get the limesurvye txt file string
            const limesurveyTxtString = fs.readFileSync(`${assetsFolderPath}/limesurvey.txt`, 'utf8');
            const limesurveyPmml = limesurvey_1.limesurveyTxtStringToPmmlString(limesurveyTxtString);
            // Get web specifications csv file string
            const webSpecificationsCsvString = fs.readFileSync(`${assetsFolderPath}/web_specifications.csv`, 'utf8');
            // Get the web specifications categories csv file string
            const webSpecificationsCategoriesCsvString = fs.readFileSync(`${assetsFolderPath}/web_specifications_categories.csv`, 'utf8');
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
                modelJson = yield buildMultipleAlgorithmModelJson(assetsFolderPath, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, limesurveyPmml, currentAlgorithmName);
            }
            else {
                modelJson = yield buildSingleAlgorithmModelJson(assetsFolderPath, limesurveyPmml, webSpecificationsCsvString, webSpecificationsCategoriesCsvString, currentAlgorithmName);
            }
            const model = model_1.parseModelJsonToModel(modelJson);
            return new survival_model_functions_1.SurvivalModelFunctions(model, modelJson);
        }),
    };
}
exports.getBuildFromAssetsFolder = getBuildFromAssetsFolder;
//# sourceMappingURL=build-from-assets-folder.js.map