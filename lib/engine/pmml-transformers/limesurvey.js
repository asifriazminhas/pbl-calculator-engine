"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const survey_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/parsers/limesurvey/survey");
const survey_2 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/survey");
const expression_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/expression");
const formatted_text_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/formatted_text");
const sub_question_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/sub_question");
const answer_option_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/answer_option");
const flexible_row_array_question_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/flexible_row_array_question");
const multiple_choice_question_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/multiple_choice_question");
const multiple_number_question_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/multiple_number_question");
const number_question_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/number_question");
const radio_question_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/radio_question");
const group_1 = require("@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/group");
const _ = require("lodash");
const common_1 = require("./common");
const xmlBuilder = require("xmlbuilder");
function getBaseDataFieldFromQuestion(question) {
    return {
        name: question.name,
        optype: '',
        dataType: 'double',
        displayName: ''
    };
}
function limesurveyTxtStringToPmmlString(limesurveyTxtString) {
    const parsedLimesurvey = survey_1.default(expression_1.default, formatted_text_1.default, sub_question_1.default, answer_option_1.default, flexible_row_array_question_1.default, multiple_choice_question_1.default, multiple_number_question_1.default, number_question_1.default, radio_question_1.default, group_1.default, survey_2.default, limesurveyTxtString);
    const dataFieldNodeObjs = _.flatten(_.flatten(parsedLimesurvey
        .groups
        .map(group => group.questions))
        .map((question) => {
        let dataFields;
        let baseDataField = getBaseDataFieldFromQuestion(question);
        if (question instanceof radio_question_1.default) {
            dataFields = [
                Object.assign({}, baseDataField, {
                    optype: common_1.CategoricalOptype,
                    values: question.answerOptions
                        .map((answerOption) => {
                        return {
                            value: answerOption.name,
                            displayName: answerOption.formattedText.text
                        };
                    })
                })
            ];
        }
        else if (question instanceof number_question_1.default) {
            dataFields = [
                Object.assign({}, baseDataField, {
                    optype: common_1.ContinuousOptype,
                    interval: {
                        closure: 'closedClosed',
                        leftMargin: question.min,
                        rightMargin: question.max
                    }
                })
            ];
        }
        else if (question instanceof multiple_number_question_1.default) {
            dataFields = question.subQuestions
                .map((subQuestion) => {
                return Object.assign({}, baseDataField, {
                    name: `${question.name}_${subQuestion.name}`,
                    optype: common_1.ContinuousOptype,
                    interval: {
                        closure: 'closedClosed',
                        leftMargin: 0,
                        rightMargin: 0
                    }
                });
            });
        }
        else if (question instanceof multiple_choice_question_1.default) {
            dataFields = question
                .subQuestions
                .map((subQuestion) => {
                return Object.assign({}, baseDataField, {
                    name: `${question.name}_${subQuestion.name}`,
                    optype: common_1.CategoricalOptype,
                    values: [
                        {
                            value: 'Yes',
                            displayName: 'Yes'
                        },
                        {
                            value: 'No',
                            displayName: 'No'
                        }
                    ]
                });
            });
        }
        else if (question instanceof flexible_row_array_question_1.default) {
            dataFields = question
                .subQuestions
                .map((subQuestion) => {
                return Object.assign({}, baseDataField, {
                    name: `${question.name}_${subQuestion.name}`,
                    optype: common_1.CategoricalOptype,
                    values: question
                        .answerOptions
                        .map((answerOption) => {
                        return Object.assign({}, answerOption, {
                            value: answerOption.name,
                            displayName: answerOption.formattedText.text
                        });
                    })
                });
            });
        }
        else {
            throw new Error();
        }
        return dataFields.map((dataField, index) => {
            let questionText = question.formattedText.text;
            if (question instanceof multiple_choice_question_1.default || question instanceof multiple_number_question_1.default || question instanceof flexible_row_array_question_1.default) {
                questionText += ` (${question.subQuestions[index].formattedText.text})`;
            }
            return Object.assign({}, common_1.getDataFieldNode(dataField), {
                Extension: [
                    {
                        '@name': 'question',
                        '@value': questionText
                    },
                    {
                        '@name': 'alternative',
                        '@value': 'true'
                    }
                ]
            });
        });
    }));
    const pmmlXml = xmlBuilder
        .create('PMML');
    const dataDictionaryXml = pmmlXml
        .ele('DataDictionary');
    dataFieldNodeObjs.forEach((dataFieldNodeObj) => {
        dataDictionaryXml.ele({
            DataField: dataFieldNodeObj
        });
    });
    return dataDictionaryXml.end({
        pretty: true
    });
}
exports.limesurveyTxtStringToPmmlString = limesurveyTxtStringToPmmlString;
//# sourceMappingURL=limesurvey.js.map