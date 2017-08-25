import { parseCovariates } from './data_fields/covariate';
import { parseDerivedFields } from './data_fields/derived_field/derived_field';
import { Pmml, PmmlParser } from '../pmml';
import { CoxJson } from '../common/json-types';
//import { parseFromAlgorithmJson } from '../json/algorithm';

function parseBaselineHazardFromPmmlXml(pmml: Pmml): number {
    return Number(pmml.pmmlXml.PMML.GeneralRegressionModel.$.baselineHazard);
}

export async function pmmlXmlStringsToJson(pmmlXmlStrings: Array<string>): Promise<CoxJson> {
    const pmml = await PmmlParser
        .parsePmmlFromPmmlXmlStrings(pmmlXmlStrings)

    const parsedAlgorithm = {
        name: pmml.pmmlXml.PMML.Header.Extension.ModelName,
        version: pmml.pmmlXml.PMML.Header.Extension.Version,
        description: pmml.pmmlXml.PMML.Header.$.description,
        baselineHazard: parseBaselineHazardFromPmmlXml(pmml),
        covariates: parseCovariates(pmml),
        derivedFields: parseDerivedFields(pmml),
        //TODO Fix this
        causeDeletedRef: null
    };

    //parseFromAlgorithmJson(parsedAlgorithm);

    return parsedAlgorithm;
}