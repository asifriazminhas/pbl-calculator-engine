import { parseCovariates } from './data_fields/covariate';
import { parseDerivedFields } from './data_fields/derived_field/derived_field';
import { Pmml, PmmlParser } from '../pmml';
import { CoxJson } from '../common/json-types';
import { parseDefineFunction } from './define-function/define-function';
import { JsonModelTypes, Predicate, ModelType } from '../model';

function parseBaselineHazardFromPmmlXml(
    pmml: Pmml
): number {
    return Number(pmml.pmmlXml.PMML.GeneralRegressionModel.$.baselineHazard);
}

async function pmmlStringsToJson(
    pmmlXmlStrings: string[]
): Promise<CoxJson> {
    const pmml = await PmmlParser
        .parsePmmlFromPmmlXmlStrings(pmmlXmlStrings)

    const allDefineFunctionNames = pmml.pmmlXml.PMML.LocalTransformations
        .DefineFunction
        .map(defineFunction => defineFunction.$.name);

    const parsedAlgorithm = {
        name: pmml.pmmlXml.PMML.Header.Extension.ModelName,
        version: pmml.pmmlXml.PMML.Header.Extension.Version,
        description: pmml.pmmlXml.PMML.Header.$.description,
        baselineHazard: parseBaselineHazardFromPmmlXml(pmml),
        covariates: parseCovariates(pmml),
        derivedFields: parseDerivedFields(pmml, allDefineFunctionNames),
        userFunctions: pmml.pmmlXml.PMML.LocalTransformations
            .DefineFunction
            .map(defineFunction => parseDefineFunction(
                defineFunction,
                allDefineFunctionNames
            ))
            .reduce((userFunctionObj, currentObject) => {
                return Object.assign({}, userFunctionObj, currentObject)
            }, {}),
        //TODO Fix this
        causeDeletedRef: null
    };

    //parseFromAlgorithmJson(parsedAlgorithm);

    return parsedAlgorithm;
}

export async function pmmlXmlStringsToJson(
    modelPmmlXmlStrings: string[][],
    predicates: Predicate[]
): Promise<JsonModelTypes> {
    const parsedAlgorithms = await Promise.all(
        modelPmmlXmlStrings
            .map(pmmlXmlStrings => pmmlStringsToJson(pmmlXmlStrings))
    );

    if(parsedAlgorithms.length === 1) {
        return {
            modelType: ModelType.SingleAlgorithm,
            algorithm: parsedAlgorithms[0]
        };
    } else {
        return {
            modelType: ModelType.MultipleAlgorithm,
            algorithms: parsedAlgorithms
                .map((parsedAlgorithm, index) => {
                    return {
                        algorithm: parsedAlgorithm,
                        predicate: predicates[index]
                    }
                })
        };
    }
}