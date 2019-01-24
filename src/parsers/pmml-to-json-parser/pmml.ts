import { parseCovariates } from './data_fields/covariate';
import { parseDerivedFields } from './data_fields/derived_field/derived_field';
import { PmmlParser, IGeneralRegressionModel } from '../pmml';
import { parseDefineFunction } from './define-function/define-function';
import { parseTaxonomy } from './taxonomy';
import { optimizeModel } from './optimizations';
import { returnEmptyArrayIfUndefined } from '../../util/undefined/undefined';
import { ICoxSurvivalAlgorithmJson } from '../../parsers/json/json-cox-survival-algorithm';
import { TimeMetric } from '../../engine/algorithm/regression-algorithm/cox-survival-algorithm/time-metric';
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
    const generalRegressionModel = pmml.pmmlXml.PMML
        .GeneralRegressionModel as IGeneralRegressionModel;

    const baseAlgorithm: ICoxSurvivalAlgorithmJson = {
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
        baseline: parseBaselineFromPmmlXml(generalRegressionModel),
        covariates: parseCovariates(pmml),
        timeMetric: parseTimeMetric(generalRegressionModel),
        maximumTime: Number(
            generalRegressionModel.Extension.find(extension => {
                return extension.name === 'maximumTime';
            })!.value,
        ),
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
        name: '',
        algorithms: parsedAlgorithms.map((currentParsedAlgorithm, index) => {
            return {
                algorithm: currentParsedAlgorithm,
                predicate: predicates[index],
            };
        }),
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
