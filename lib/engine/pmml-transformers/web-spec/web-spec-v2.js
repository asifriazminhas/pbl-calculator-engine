"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csvParse = require("csv-parse/lib/sync");
const xmlbuilder_1 = require("../../../util/xmlbuilder");
const invalid_value_treatment_1 = require("../../../parsers/pmml/mining-schema/invalid-value-treatment");
const missing_value_treatment_1 = require("../../../parsers/pmml/mining-schema/missing-value-treatment");
function convertWebSpecV2CsvToPmml(webSpecV2CsvString, gender) {
    const webSpecV2Csv = csvParse(webSpecV2CsvString, {
        columns: true,
    });
    const Header = {
        $: {
            description: 'WebSpecV2 PMML',
        },
    };
    const numOfRowsWithDefinedMinOrMaxColumn = webSpecV2Csv.filter(webSpecV2CsvRow => {
        const { min, max } = getGenderSpecificMinAndMaxValues(webSpecV2CsvRow, gender);
        return min || max;
    }).length;
    const DataDictionary = {
        DataField: webSpecV2Csv.map(webSpecV2CsvRow => {
            return getDataFieldNode(webSpecV2CsvRow, gender);
        }),
        $: {
            numberOfFields: `${numOfRowsWithDefinedMinOrMaxColumn}`,
        },
    };
    const MiningSchema = {
        MiningField: webSpecV2Csv.map(({ InvalidValueTreatment, Name, MissingValueReplacement }) => {
            return {
                $: Object.assign({
                    name: Name,
                    invalidValueTreatment: InvalidValueTreatment === 'asMissing'
                        ? invalid_value_treatment_1.InvalidValueTreatment.AsMissing
                        : InvalidValueTreatment === 'returnInvalid'
                            ? invalid_value_treatment_1.InvalidValueTreatment.ReturnInvalid
                            : invalid_value_treatment_1.InvalidValueTreatment.AsIs,
                }, MissingValueReplacement === 'asMean'
                    ? {
                        missingValueTreatment: missing_value_treatment_1.MissingValueTreatment.AsMean,
                    }
                    : undefined),
            };
        }),
    };
    const pmml = {
        Header,
        DataDictionary,
        LocalTransformations: {
            DerivedField: [],
        },
        MiningSchema,
    };
    return xmlbuilder_1.buildXmlFromXml2JsObject({
        PMML: pmml,
    });
}
exports.convertWebSpecV2CsvToPmml = convertWebSpecV2CsvToPmml;
function isMaleGender(gender) {
    return gender === 'male';
}
function getDataFieldNode(webSpecV2CsvRow, gender) {
    const { min, max } = getGenderSpecificMinAndMaxValues(webSpecV2CsvRow, gender);
    return Object.assign({}, {
        $: {
            name: webSpecV2CsvRow.Name,
            displayName: '',
            optype: 'continuous',
            dataType: '',
            'X-shortLabel': '',
        },
        Extension: [],
    }, min || max
        ? {
            Interval: getIntervalNode(min, max),
        }
        : undefined);
}
function getGenderSpecificMinAndMaxValues(webSpecV2CsvRow, gender) {
    return {
        min: isMaleGender(gender)
            ? webSpecV2CsvRow.UserMin_male
            : webSpecV2CsvRow.UserMin_female,
        max: isMaleGender(gender)
            ? webSpecV2CsvRow.UserMax_male
            : webSpecV2CsvRow.UserMax_female,
    };
}
function getIntervalNode(min, max) {
    return {
        $: Object.assign({}, {
            closure: 'closedClosed',
        }, min
            ? {
                leftMargin: min,
            }
            : undefined, max
            ? {
                rightMargin: max,
            }
            : undefined),
    };
}
//# sourceMappingURL=web-spec-v2.js.map