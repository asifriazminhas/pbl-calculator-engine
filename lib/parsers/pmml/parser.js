"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird = require("bluebird");
const xml2js_1 = require("xml2js");
const pmml_1 = require("./pmml");
const data_dictionary_1 = require("./data_dictionary/data_dictionary");
const local_transformations_1 = require("./local_transformations/local_transformations");
const general_regression_model_1 = require("./general_regression_model/general_regression_model");
const promisifiedParseXmlString = bluebird.promisify(xml2js_1.parseString);
function mergePmml(pmmlOne, pmmlTwo) {
    const mergedGeneralRegressionModel = general_regression_model_1.mergeGeneralRegressionModel(pmmlOne.PMML.GeneralRegressionModel, pmmlTwo.PMML.GeneralRegressionModel);
    return Object.assign({}, pmmlOne, pmmlTwo, {
        PMML: {
            Header: Object.assign({}, pmmlOne.PMML.Header, pmmlTwo.PMML.Header),
            Output: Object.assign({}, pmmlOne.PMML.Output, pmmlTwo.PMML.Output),
            Targets: Object.assign({}, pmmlOne.PMML.Targets, pmmlTwo.PMML.Targets),
            Taxonomy: pmmlTwo.PMML.Taxonomy
                ? pmmlTwo.PMML.Taxonomy
                : pmmlOne.PMML.Taxonomy ? pmmlOne.PMML.Taxonomy : [],
            DataDictionary: data_dictionary_1.mergeDataDictionary(pmmlOne.PMML.DataDictionary, pmmlTwo.PMML.DataDictionary),
            LocalTransformations: local_transformations_1.mergeLocalTransformations(pmmlOne.PMML.LocalTransformations, pmmlTwo.PMML.LocalTransformations),
            GeneralRegressionModel: mergedGeneralRegressionModel,
            CustomPMML: Object.assign({}, pmmlOne.PMML.CustomPMML ? pmmlOne.PMML.CustomPMML : {}, pmmlTwo.PMML.CustomPMML ? pmmlTwo.PMML.CustomPMML : {}),
            MiningSchema: Object.assign({}, pmmlOne.PMML.MiningSchema, pmmlTwo.PMML.MiningSchema),
        },
    });
}
class PmmlParser {
    static async parsePmmlFromPmmlXmlStrings(pmmlXmlStrings) {
        const pmmlXmls = await Promise.all(pmmlXmlStrings.map(pmmlXmlString => promisifiedParseXmlString(pmmlXmlString, {
            explicitArray: false,
            explicitChildren: true,
            preserveChildrenOrder: true,
        })));
        const mergedPmmlXml = pmmlXmls.reduce((mergedPmmlXml, currentPmmlXml) => {
            if (!mergedPmmlXml) {
                return currentPmmlXml;
            }
            else {
                return mergePmml(mergedPmmlXml, currentPmmlXml);
            }
        });
        return new pmml_1.Pmml(mergedPmmlXml);
    }
}
exports.PmmlParser = PmmlParser;
//# sourceMappingURL=parser.js.map