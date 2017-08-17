"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bluebird = require("bluebird");
const xml2js_1 = require("xml2js");
const pmml_1 = require("./pmml");
const data_dictionary_1 = require("./data_dictionary/data_dictionary");
const local_transformations_1 = require("./local_transformations/local_transformations");
const promisifiedParseXmlString = bluebird.promisify(xml2js_1.parseString);
function mergePmml(pmmlOne, pmmlTwo) {
    return Object.assign({}, pmmlOne, pmmlTwo, {
        PMML: {
            Header: Object.assign({}, pmmlOne.PMML.Header, pmmlTwo.PMML.Header),
            DataDictionary: data_dictionary_1.mergeDataDictionary(pmmlOne.PMML.DataDictionary, pmmlTwo.PMML.DataDictionary),
            LocalTransformations: local_transformations_1.mergeLocalTransformations(pmmlOne.PMML.LocalTransformations, pmmlTwo.PMML.LocalTransformations),
            GeneralRegressionModel: Object.assign({}, pmmlOne.PMML.GeneralRegressionModel ?
                pmmlOne.PMML.GeneralRegressionModel : {}, pmmlTwo.PMML.GeneralRegressionModel ?
                pmmlTwo.PMML.GeneralRegressionModel : {}),
            CustomPMML: Object.assign({}, pmmlOne.PMML.CustomPMML ? pmmlOne.PMML.CustomPMML : {}, pmmlTwo.PMML.CustomPMML ? pmmlTwo.PMML.CustomPMML : {})
        }
    });
}
class PmmlParser {
    static parsePmmlFromPmmlXmlStrings(pmmlXmlStrings) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pmmlXmls = (yield Promise.all(pmmlXmlStrings
                .map(pmmlXmlString => promisifiedParseXmlString(pmmlXmlString, {
                explicitArray: false,
                explicitChildren: true,
                preserveChildrenOrder: true
            }))));
            const mergedPmmlXml = pmmlXmls
                .reduce((mergedPmmlXml, currentPmmlXml) => {
                if (!mergedPmmlXml) {
                    return currentPmmlXml;
                }
                else {
                    return mergePmml(mergedPmmlXml, currentPmmlXml);
                }
            });
            return new pmml_1.Pmml(mergedPmmlXml);
        });
    }
}
exports.PmmlParser = PmmlParser;
//# sourceMappingURL=parser.js.map