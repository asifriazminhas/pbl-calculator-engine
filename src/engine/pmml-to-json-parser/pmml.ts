import { parseCovariates } from './data_fields/covariate';
import { parseDerivedFields } from './data_fields/derived_field/derived_field';
import {
    Pmml,
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

function getAlgorithmTypeFromGeneralRegressionModel(
    generalRegressionModel: IGeneralRegressionModel,
): AlgorithmType {
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

function parseBaselineFromPmmlXml(pmml: Pmml): number {
    return Number(pmml.pmmlXml.PMML.GeneralRegressionModel.$.baselineHazard);
}

async function pmmlStringsToJson(
    pmmlXmlStrings: string[],
): Promise<AlgorithmJsonTypes> {
    const pmml = await PmmlParser.parsePmmlFromPmmlXmlStrings(pmmlXmlStrings);

    const allDefineFunctionNames = pmml.pmmlXml.PMML.LocalTransformations.DefineFunction.map(
        defineFunction => defineFunction.$.name,
    );

    const parsedAlgorithm = {
        algorithmType: getAlgorithmTypeFromGeneralRegressionModel(
            pmml.pmmlXml.PMML.GeneralRegressionModel,
        ),
        name: pmml.pmmlXml.PMML.Header.Extension.ModelName,
        version: pmml.pmmlXml.PMML.Header.Extension.Version,
        description: pmml.pmmlXml.PMML.Header.$.description,
        baseline: parseBaselineFromPmmlXml(pmml),
        covariates: parseCovariates(pmml),
        derivedFields: parseDerivedFields(pmml, allDefineFunctionNames),
        userFunctions: pmml.pmmlXml.PMML.LocalTransformations.DefineFunction
            .map(defineFunction =>
                parseDefineFunction(defineFunction, allDefineFunctionNames),
            )
            .reduce((userFunctionObj, currentObject) => {
                return Object.assign({}, userFunctionObj, currentObject);
            }, {}),
        // TODO Fix this
        causeDeletedRef: null,
        tables: {},
    };

    // parseFromAlgorithmJson(parsedAlgorithm);

    return parsedAlgorithm as AlgorithmJsonTypes;
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
