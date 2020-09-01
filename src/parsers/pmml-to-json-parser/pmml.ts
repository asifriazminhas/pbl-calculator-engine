import { parseCovariates } from './data_fields/covariate';
import { parseDerivedFields } from './data_fields/derived_field/derived_field';
import { PmmlParser, IGeneralRegressionModel } from '../pmml';
import { parseDefineFunction } from './define-function/define-function';
import { parseTaxonomy } from './taxonomy';
import { optimizeModel } from './optimizations';
import { returnEmptyArrayIfUndefined } from '../../util/undefined/undefined';
import {
    ICoxSurvivalAlgorithmJson,
    parseCoxSurvivalAlgorithmJson,
} from '../../parsers/json/json-cox-survival-algorithm';
import { TimeMetric } from '../../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric';
import { IModelJson } from '../../parsers/json/json-model';
import { PredicateJson } from '../../parsers/json/json-predicate';
import { flatten, uniq, uniqBy } from 'lodash';
import { parseDataFieldFromDataFieldPmmlNode } from './data_fields/data_field';
import { IDataFieldJson } from '../json/json-data-field';
import { IJsonSimpleAlgorithm } from '../json/json-simple-algorithm';
import { AlgorithmType } from '../json/algorithm-type';

function parseBaselineFromPmmlXml(
    generalRegressionModel: IGeneralRegressionModel,
): number {
    return Number(generalRegressionModel.$.baselineHazard);
}

async function pmmlStringsToJson(
    pmmlXmlStrings: string[],
): Promise<{
    algorithm: ICoxSurvivalAlgorithmJson | IJsonSimpleAlgorithm;
    modelFields: IDataFieldJson[];
}> {
    const pmml = await PmmlParser.parsePmmlFromPmmlXmlStrings(pmmlXmlStrings);

    const allDefineFunctionNames = returnEmptyArrayIfUndefined(
        pmml.pmmlXml.PMML.LocalTransformations.DefineFunction,
    ).map(defineFunction => defineFunction.$.name);
    const generalRegressionModel = pmml.pmmlXml.PMML
        .GeneralRegressionModel as IGeneralRegressionModel;

    const baseAlgorithm = {
        name: pmml.pmmlXml.PMML.Header.Extension.value,
        derivedFields: parseDerivedFields(pmml, allDefineFunctionNames),
        userFunctions: returnEmptyArrayIfUndefined(
            pmml.pmmlXml.PMML.LocalTransformations.DefineFunction,
        )
            .map(defineFunction =>
                parseDefineFunction(defineFunction, allDefineFunctionNames),
            )
            .reduce((userFunctionObj, currentObject) => {
                return Object.assign({}, userFunctionObj, currentObject);
            }, {}),
        tables: parseTaxonomy(pmml.pmmlXml.PMML.Taxonomy),
    };
    let fullAlgorithm: IJsonSimpleAlgorithm | ICoxSurvivalAlgorithmJson;

    if (pmml.pmmlXml.PMML.SimpleModel) {
        fullAlgorithm = {
            algorithmType: AlgorithmType.SimpleAlgorithm,
            output: pmml.pmmlXml.PMML.Output!.OutputField.$.name,
            ...baseAlgorithm,
        } as IJsonSimpleAlgorithm;
    } else {
        fullAlgorithm = {
            algorithmType: AlgorithmType.CoxSurvivalAlgorithm,
            baseline: parseBaselineFromPmmlXml(generalRegressionModel),
            covariates: parseCovariates(pmml),
            timeMetric: parseTimeMetric(generalRegressionModel),
            maximumTime: Number(
                generalRegressionModel.Extension.find(extension => {
                    return extension.name === 'maximumTime';
                })!.value,
            ),
            ...baseAlgorithm,
        } as ICoxSurvivalAlgorithmJson;
    }

    let modelFields: IDataFieldJson[] = [];
    if (fullAlgorithm.algorithmType === AlgorithmType.CoxSurvivalAlgorithm) {
        const allAlgorithmFields = uniq(
            flatten(
                parseCoxSurvivalAlgorithmJson(fullAlgorithm).covariates.map(
                    covariate => {
                        return covariate
                            .getDescendantFields()
                            .map(field => {
                                return field.name;
                            })
                            .concat(covariate.name);
                    },
                ),
            ),
        );
        modelFields = pmml.pmmlXml.PMML.DataDictionary.DataField.filter(
            dataField => {
                return allAlgorithmFields.indexOf(dataField.$.name) === -1;
            },
        ).map(modelField => {
            return parseDataFieldFromDataFieldPmmlNode(modelField);
        });
    }

    return {
        algorithm: fullAlgorithm,
        modelFields,
    };
}

export async function pmmlXmlStringsToJson(
    modelPmmlXmlStrings: string[][],
    predicates: PredicateJson[],
): Promise<IModelJson<any>> {
    const parsedAlgorithmAndModelFields = await Promise.all(
        modelPmmlXmlStrings.map(pmmlXmlStrings => {
            return pmmlStringsToJson(pmmlXmlStrings);
        }),
    );
    const modelFields = uniqBy(
        flatten(
            parsedAlgorithmAndModelFields.map(parsedAlgorithmAndModelField => {
                return parsedAlgorithmAndModelField.modelFields;
            }),
        ),
        ({ name }) => {
            return name;
        },
    );

    const modelJson: IModelJson<any> = {
        name: '',
        algorithms: parsedAlgorithmAndModelFields.map(
            ({ algorithm }, index) => {
                return {
                    algorithm,
                    predicate: predicates[index],
                };
            },
        ),
        modelFields,
    };

    return optimizeModel(modelJson);
}

function parseTimeMetric(
    generalRegressionModel: IGeneralRegressionModel,
): TimeMetric {
    const pmmlTimeMetric = generalRegressionModel.Extension.find(({ name }) => {
        return name === 'timeMetric';
    })!.value;

    switch (pmmlTimeMetric) {
        case 'days': {
            return TimeMetric.Days;
        }
        case 'years': {
            return TimeMetric.Years;
        }
        default: {
            throw new Error(
                `Unknown time metric extension value ${pmmlTimeMetric}`,
            );
        }
    }
}
