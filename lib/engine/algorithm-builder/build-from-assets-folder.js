"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const get_risk_1 = require("./get-risk");
const get_survival_to_time_1 = require("./get-survival-to-time");
const add_life_table_1 = require("./add-life-table");
const add_ref_pop_1 = require("./add-ref-pop");
const fs = require("fs");
const web_specifications_1 = require("../pmml-transformers/web-specifications");
const limesurvey_1 = require("../pmml-transformers/limesurvey");
const cox_1 = require("../json-parser/cox");
const pmml_1 = require("../pmml-to-json-parser/pmml");
const to_json_1 = require("./to-json");
const algorithm_evaluator_1 = require("../algorithm-evaluator");
const add_algorithm_1 = require("./add-algorithm");
function curryBuildFromAssetsFolder() {
    return (assetsFolderPath) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        //Get the names of all the files in the assets directory
        const assetFileNames = fs.readdirSync(assetsFolderPath);
        const webSpecificationCsv = fs.readFileSync(`${assetsFolderPath}/web_specification.csv`, 'utf8');
        const webSpecificationCategoriesCsv = fs.readFileSync(`${assetsFolderPath}/web_specification_categories.csv`, 'utf8');
        const webSpecificationsPmml = web_specifications_1.transformPhiatDictionaryToPmml(webSpecificationCsv, webSpecificationCategoriesCsv, "Male", false, false, 0);
        const limesurveyFile = fs.readFileSync(`${assetsFolderPath}/limesurvey.txt`, 'utf8');
        const limesurveyPmml = limesurvey_1.limesurveyTxtStringToPmmlString(limesurveyFile);
        const pmmlFileNamesSortedByPriority = assetFileNames
            .filter(pmmlFileName => pmmlFileName.indexOf('.xml') > -1)
            .map(pmmlFileName => pmmlFileName.split('.')[0])
            .map(pmmlFileName => Number(pmmlFileName))
            .sort((pmmlFileNameOne, pmmlFileNameTwo) => {
            return pmmlFileNameOne > pmmlFileNameTwo ? 1 : -1;
        });
        const coxJson = yield pmml_1.pmmlXmlStringsToJson(pmmlFileNamesSortedByPriority
            .map((pmmlFileNameNumber) => {
            return fs.readFileSync(`${assetsFolderPath}/${pmmlFileNameNumber}.xml`, 'utf8');
        })
            .concat([
            limesurveyPmml,
            webSpecificationsPmml
        ]));
        const cox = cox_1.parseCoxJsonToCox(coxJson);
        return {
            getSurvivalToTime: get_survival_to_time_1.curryGetSurvivalToTimeFunction(cox),
            getRisk: get_risk_1.curryGetRiskFunction(cox),
            addLifeTable: add_life_table_1.curryAddLifeTableFunctionWithAddRefPop(cox, coxJson),
            addRefPop: add_ref_pop_1.curryAddRefPopWithAddLifeTable(cox, coxJson),
            toJson: to_json_1.curryToJsonFunction(coxJson),
            withData: algorithm_evaluator_1.curryBaseWithDataFunction({}),
            addAlgorithm: add_algorithm_1.curryBaseAddAlgorithmFunction(cox, coxJson)
        };
    });
}
exports.curryBuildFromAssetsFolder = curryBuildFromAssetsFolder;
//# sourceMappingURL=build-from-assets-folder.js.map