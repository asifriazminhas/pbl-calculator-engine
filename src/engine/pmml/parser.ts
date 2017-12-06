import * as bluebird from 'bluebird';
import { parseString } from 'xml2js';
import { Pmml, ICustomPmmlXml } from './pmml';
import { mergeDataDictionary } from './data_dictionary/data_dictionary';
import { mergeLocalTransformations } from './local_transformations/local_transformations';

const promisifiedParseXmlString: any = bluebird.promisify(parseString);

function mergePmml(
    pmmlOne: ICustomPmmlXml,
    pmmlTwo: ICustomPmmlXml,
): ICustomPmmlXml {
    const mergedGeneralRegressionModel =
        pmmlOne.PMML.GeneralRegressionModel ||
        pmmlTwo.PMML.GeneralRegressionModel
            ? Object.assign(
                  {},
                  pmmlOne.PMML.GeneralRegressionModel
                      ? pmmlOne.PMML.GeneralRegressionModel
                      : {},
                  pmmlTwo.PMML.GeneralRegressionModel
                      ? pmmlTwo.PMML.GeneralRegressionModel
                      : {},
              )
            : {};

    return Object.assign({}, pmmlOne, pmmlTwo, {
        PMML: {
            Header: Object.assign({}, pmmlOne.PMML.Header, pmmlTwo.PMML.Header),
            Output: Object.assign({}, pmmlOne.PMML.Output, pmmlTwo.PMML.Output),
            Targets: Object.assign(
                {},
                pmmlOne.PMML.Targets,
                pmmlTwo.PMML.Targets,
            ),
            Taxonomy: Object.assign(
                {},
                pmmlOne.PMML.Taxonomy,
                pmmlTwo.PMML.Taxonomy,
            ),
            DataDictionary: mergeDataDictionary(
                pmmlOne.PMML.DataDictionary,
                pmmlTwo.PMML.DataDictionary,
            ),
            LocalTransformations: mergeLocalTransformations(
                pmmlOne.PMML.LocalTransformations,
                pmmlTwo.PMML.LocalTransformations,
            ),
            ...mergedGeneralRegressionModel,
            CustomPMML: Object.assign(
                {},
                pmmlOne.PMML.CustomPMML ? pmmlOne.PMML.CustomPMML : {},
                pmmlTwo.PMML.CustomPMML ? pmmlTwo.PMML.CustomPMML : {},
            ),
        },
    });
}

export class PmmlParser {
    static async parsePmmlFromPmmlXmlStrings(
        pmmlXmlStrings: Array<string>,
    ): Promise<Pmml> {
        const pmmlXmls: Array<ICustomPmmlXml> = await Promise.all(
            pmmlXmlStrings.map(pmmlXmlString =>
                promisifiedParseXmlString(pmmlXmlString, {
                    explicitArray: false,
                    explicitChildren: true,
                    preserveChildrenOrder: true,
                }),
            ),
        );

        const mergedPmmlXml = pmmlXmls.reduce(
            (mergedPmmlXml, currentPmmlXml: ICustomPmmlXml) => {
                if (!mergedPmmlXml) {
                    return currentPmmlXml;
                } else {
                    return mergePmml(mergedPmmlXml, currentPmmlXml);
                }
            },
        );

        return new Pmml(mergedPmmlXml);
    }
}
