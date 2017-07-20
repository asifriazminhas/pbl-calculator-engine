import { parseCovariates } from './data_fields/covariate';
import { parseDerivedFields } from './data_fields/derived_field/derived_field';
import { Pmml, PmmlParser } from '../../pmml';
import { AlgorithmJson } from '../json/algorithm';
import { parseFromAlgorithmJson } from '../json/algorithm';
import { AlgorithmType } from '../json/algorithm_type';
import { GeneralRegressionModelType, CoxRegressionModelType, LogisticRegressionModelType } from '../../pmml/general_regression_model/general_regression_model';

function parseBaselineHazardFromPmmlXml(pmml: Pmml): number {
    return Number(pmml.pmmlXml.PMML.GeneralRegressionModel.$.baselineHazard);
}

function getAlgorithmTypeFromModelType(modelType: GeneralRegressionModelType): AlgorithmType {
    if (modelType === CoxRegressionModelType) {
        return AlgorithmType.CoxProportionalHazard
    }
    else if (modelType === LogisticRegressionModelType) {
        return AlgorithmType.LogisticRegression;
    }
    else {
        throw new Error(
            `Unknown modelType ${modelType} for GeneralRegressionModel`
        );
    }
}

export async function pmmlXmlStringsToJson(pmmlXmlStrings: Array<string>): Promise<AlgorithmJson> {
    const pmml = await PmmlParser
        .parsePmmlFromPmmlXmlStrings(pmmlXmlStrings)

    const parsedAlgorithm = {
        type: getAlgorithmTypeFromModelType(
            pmml.pmmlXml.PMML.GeneralRegressionModel.$.modelType
        ),
        name: pmml.pmmlXml.PMML.Header.Extension.ModelName,
        version: pmml.pmmlXml.PMML.Header.Extension.Version,
        description: pmml.pmmlXml.PMML.Header.$.description,
        baselineHazard: parseBaselineHazardFromPmmlXml(pmml),
        covariates: parseCovariates(pmml),
        localTransformations: parseDerivedFields(pmml)
    };

    parseFromAlgorithmJson(parsedAlgorithm);

    return parsedAlgorithm;
}