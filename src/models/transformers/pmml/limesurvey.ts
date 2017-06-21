import parseLimesurvey from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/parsers/limesurvey/survey';
import Survey from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/survey'
import Expression from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/expression'
import FormattedText from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/formatted_text'
import SubQuestion from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/sub_question'
import AnswerOption from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/answer_option'
import FlexibleRowArrayQuestion from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/flexible_row_array_question'
import Question from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/question'
import MultipleChoiceQuestion from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/multiple_choice_question'
import MultipleNumberQuestion from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/multiple_number_question'
import NumberQuestion from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/number_question'
import RadioQuestion from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/questions/radio_question'
import Group from '@ottawamhealth/pbl-limesurvey-engine/lib/server/models/survey/group'
import * as _ from 'lodash';
import { getDataFieldNode, CategoricalOptype, ContinuousOptype, CategoricalDataField, ContinuousDataField } from './common';
import * as xmlBuilder from 'xmlbuilder';

function getBaseDataFieldFromQuestion(question: Question) {
    return {
        name: question.name,
        optype: '',
        dataType: 'double',
        displayName: ''
    };
}

export function limesurveyTxtStringToPmmlString(limesurveyTxtString: string): string {
    const parsedLimesurvey = parseLimesurvey(
        Expression,
        FormattedText,
        SubQuestion,
        AnswerOption,
        FlexibleRowArrayQuestion,
        MultipleChoiceQuestion,
        MultipleNumberQuestion,
        NumberQuestion,
        RadioQuestion,
        Group,
        Survey,
        limesurveyTxtString
    );

    const dataFieldNodeObjs = _.flatten(
        _.flatten(
            parsedLimesurvey
                .groups
                .map(group => group.questions)
        )
        .map((question) => {
            let dataFields: Array<CategoricalDataField | ContinuousDataField>;
            let baseDataField = getBaseDataFieldFromQuestion(question);

            if(question instanceof RadioQuestion) {
                dataFields = [
                    Object.assign({}, baseDataField, {
                        optype: CategoricalOptype,
                        values: question.answerOptions
                            .map((answerOption) => {
                                return {
                                    value: answerOption.name,
                                    displayName: answerOption.formattedText.text
                                }
                            })
                    })
                ]
            }
            else if(question instanceof NumberQuestion) {
                dataFields = [
                Object.assign({}, baseDataField, {
                        optype: ContinuousOptype,
                        interval: {
                            closure: 'closedClosed',
                            leftMargin: question.min,
                            rightMargin: question.max
                        }
                    })
                ]
            }
            else if(question instanceof MultipleNumberQuestion) {
                dataFields = question.subQuestions
                    .map((subQuestion) => {
                        return Object.assign(
                            {},
                            baseDataField,
                            {
                                name: `${question.name}_${subQuestion.name}`,
                                optype: ContinuousOptype,
                                interval: {
                                    closure:
                                        'closedClosed',
                                    leftMargin: 0,
                                    rightMargin: 0
                                }
                            }
                        );
                    })
            }
            else if(question instanceof MultipleChoiceQuestion) {
                dataFields = question
                    .subQuestions
                    .map((subQuestion) => {
                        return Object.assign({}, baseDataField, {
                            name: `${question.name}_${subQuestion.name}`,
                            optype: CategoricalOptype,
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
                        })
                    })
            }
            else if(question instanceof FlexibleRowArrayQuestion) {
                dataFields = question
                    .subQuestions
                    .map((subQuestion) => {
                        return Object.assign({}, baseDataField, {
                            name: `${question.name}_${subQuestion.name}`,
                            optype: CategoricalOptype,
                            values: question
                                .answerOptions
                                .map((answerOption) => {
                                    return Object.assign({}, answerOption, {
                                        value: answerOption.name,
                                        displayName: answerOption.formattedText.text
                                    })
                                })
                        })
                    })
            }
            else {
                throw new Error();
            }

            return dataFields.map((dataField, index) => {
                let questionText = question.formattedText.text;

                if (question instanceof MultipleChoiceQuestion || question instanceof MultipleNumberQuestion || question instanceof FlexibleRowArrayQuestion) { 
                    questionText += ` (${question.subQuestions[index].formattedText.text})`;
                }

                return Object.assign({}, getDataFieldNode(dataField), {
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
                })
            })
        })
    );

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