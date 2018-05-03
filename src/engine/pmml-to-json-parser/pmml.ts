import { parseCovariates } from './data_fields/covariate';
import { parseDerivedFields } from './data_fields/derived_field/derived_field';
import { PmmlParser, IGeneralRegressionModel } from '../pmml';
import { parseDefineFunction } from './define-function/define-function';
import { parseTaxonomy } from './taxonomy';
import { optimizeModel } from './optimizations';
import { returnEmptyArrayIfUndefined } from '../undefined/undefined';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';
import { TimeMetric } from '../algorithm/regression-algorithm/cox-survival-algorithm/time-metric';
import { IModelJson } from '../../parsers/json/json-model';
import { PredicateJson } from '../../parsers/json/json-predicate';

function parseBaselineFromPmmlXml(
    generalRegressionModel: IGeneralRegressionModel,
): number {
    return Number(generalRegressionModel.$.baselineHazard);
}

async function pmmlStringsToJson(
    pmmlXmlStrings: string[],
): Promise<ICoxSurvivalAlgorithmJson> {
    const pmml = await PmmlParser.parsePmmlFromPmmlXmlStrings(pmmlXmlStrings);

    const allDefineFunctionNames = returnEmptyArrayIfUndefined(
        pmml.pmmlXml.PMML.LocalTransformations.DefineFunction,
    ).map(defineFunction => defineFunction.$.name);

    const baseAlgorithm: ICoxSurvivalAlgorithmJson = {
        name: pmml.pmmlXml.PMML.Header.Extension.ModelName,
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
        baseline: parseBaselineFromPmmlXml(pmml.pmmlXml.PMML
            .GeneralRegressionModel as IGeneralRegressionModel),
        covariates: parseCovariates(pmml),
        timeMetric: TimeMetric.Years,
        maximumTime: 5,
    };

    return baseAlgorithm;
}

export async function pmmlXmlStringsToJson(
    modelPmmlXmlStrings: string[][],
    predicates: PredicateJson[],
): Promise<IModelJson> {
    const parsedAlgorithms = await Promise.all(
        modelPmmlXmlStrings.map(pmmlXmlStrings =>
            pmmlStringsToJson(pmmlXmlStrings),
        ),
    );

    const modelJson: IModelJson = {
        algorithms: parsedAlgorithms.map((currentParsedAlgorithm, index) => {
            return {
                algorithm: currentParsedAlgorithm,
                predicate: predicates[index],
            };
        }),
    };

    return optimizeModel(modelJson);
}
