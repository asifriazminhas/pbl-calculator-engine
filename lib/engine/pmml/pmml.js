"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmlbuilder_1 = require("../xmlbuilder");
class Pmml {
    constructor(pmmlXml) {
        this.pmmlXml = pmmlXml;
    }
    findDataFieldWithName(dataFieldName) {
        return this.pmmlXml.PMML.DataDictionary.DataField
            .find(dataField => dataField.$.name === dataFieldName);
    }
    findParameterWithLabel(parameterLabel) {
        return this.pmmlXml.PMML.GeneralRegressionModel.ParameterList.Parameter
            .find(parameter => parameter.$.label === parameterLabel);
    }
    findPCellWithParameterName(parameterName) {
        return this.pmmlXml.PMML.GeneralRegressionModel.ParamMatrix.PCell
            .find(pCell => pCell.$.parameterName === parameterName);
    }
    findDerivedFieldWithName(derivedFieldName) {
        return this.pmmlXml.PMML.LocalTransformations.DerivedField
            .find(derivedField => derivedField.$.name === derivedFieldName);
    }
    toString() {
        return xmlbuilder_1.buildXmlFromXml2JsObject({
            PMML: this.pmmlXml.PMML
        }).end({
            pretty: true
        });
    }
}
exports.Pmml = Pmml;
//# sourceMappingURL=pmml.js.map