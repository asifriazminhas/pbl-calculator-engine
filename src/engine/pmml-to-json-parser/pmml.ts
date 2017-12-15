import { parseCovariates } from './data_fields/covariate';
import { parseDerivedFields } from './data_fields/derived_field/derived_field';
import {
    PmmlParser,
    IGeneralRegressionModel,
    CoxRegressionModelType,
    LogisticRegressionModelType,
} from '../pmml';
import { parseDefineFunction } from './define-function/define-function';
import { JsonModelTypes, ModelType } from '../model';
import { Predicate } from '../multiple-algorithm-model';
import { AlgorithmType } from '../algorithm';
import { UnknownRegressionType } from '../errors';
import { AlgorithmJsonTypes } from '../algorithm/algorithm-json-types';
import { parseTaxonomy } from './taxonomy';
import { RegressionAlgorithmJsonTypes } from '../regression-algorithm/regression-algorithm-json-types';
import { ISimpleAlgorithmJson } from '../simple-algorithm/simple-algorithm-json';
import { IAlgorithmJson } from '../algorithm/algorithm-json';
import { IOutput } from '../pmml/pmml';

function getAlgorithmTypeFromGeneralRegressionModel(
    generalRegressionModel: IGeneralRegressionModel,
): AlgorithmType.Cox | AlgorithmType.LogisticRegression {
    switch (generalRegressionModel.$.modelType) {
        case CoxRegressionModelType: {
            return AlgorithmType.Cox;
        }
        case LogisticRegressionModelType: {
            return AlgorithmType.LogisticRegression;
        }
        default: {
            throw new UnknownRegressionType(generalRegressionModel.$.modelType);
        }
    }
}

function getOutputName(output: IOutput): string {
    return output.OutputField.$.name;
}

function parseBaselineFromPmmlXml(
    generalRegressionModel: IGeneralRegressionModel,
): number {
    return Number(generalRegressionModel.$.baselineHazard);
}

async function pmmlStringsToJson(
    pmmlXmlStrings: string[],
): Promise<AlgorithmJsonTypes> {
    const pmml = await PmmlParser.parsePmmlFromPmmlXmlStrings(pmmlXmlStrings);

    const allDefineFunctionNames = pmml.pmmlXml.PMML.LocalTransformations.DefineFunction.map(
        defineFunction => defineFunction.$.name,
    );

    const baseAlgorithm: IAlgorithmJson<AlgorithmType.Unknown> = {
        algorithmType: AlgorithmType.Unknown,
        name: pmml.pmmlXml.PMML.Header.Extension.ModelName,
        version: pmml.pmmlXml.PMML.Header.Extension.Version,
        description: pmml.pmmlXml.PMML.Header.$.description,
        derivedFields: parseDerivedFields(pmml, allDefineFunctionNames),
        userFunctions: pmml.pmmlXml.PMML.LocalTransformations.DefineFunction
            .map(defineFunction =>
                parseDefineFunction(defineFunction, allDefineFunctionNames),
            )
            .reduce((userFunctionObj, currentObject) => {
                return Object.assign({}, userFunctionObj, currentObject);
            }, {}),
        tables: parseTaxonomy(pmml.pmmlXml.PMML.Taxonomy),
    };

    if (pmml.pmmlXml.PMML.GeneralRegressionModel) {
        return {
            ...baseAlgorithm,
            algorithmType: getAlgorithmTypeFromGeneralRegressionModel(
                pmml.pmmlXml.PMML.GeneralRegressionModel,
            ) as AlgorithmType.Cox | AlgorithmType.LogisticRegression,
            baseline: parseBaselineFromPmmlXml(
                pmml.pmmlXml.PMML.GeneralRegressionModel,
            ),
            covariates: parseCovariates(pmml),
        } as RegressionAlgorithmJsonTypes;
    } else if (pmml.pmmlXml.PMML.Output && pmml.pmmlXml.PMML.Targets) {
        return Object.assign({}, baseAlgorithm, {
            algorithmType: AlgorithmType.SimpleAlgorithm as AlgorithmType.SimpleAlgorithm,
            output: getOutputName(pmml.pmmlXml.PMML.Output),
        }) as ISimpleAlgorithmJson;
    } else {
        throw new Error(`Unknown algorithm`);
    }
}

export async function pmmlXmlStringsToJson(
    modelPmmlXmlStrings: string[][],
    predicates: Predicate[],
): Promise<JsonModelTypes> {
    const parsedAlgorithms = await Promise.all(
        modelPmmlXmlStrings.map(pmmlXmlStrings =>
            pmmlStringsToJson(pmmlXmlStrings),
        ),
    );

    if (parsedAlgorithms.length === 1) {
        return {
            modelType: ModelType.SingleAlgorithm,
            algorithm: parsedAlgorithms[0],
        };
    } else {
        return {
            modelType: ModelType.MultipleAlgorithm,
            algorithms: parsedAlgorithms.map((parsedAlgorithm, index) => {
                return {
                    algorithm: parsedAlgorithm,
                    predicate: predicates[index],
                };
            }),
        };
    }
}
