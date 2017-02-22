import { parseDataFields } from './data_field';
import { parseDerivedFields } from './derived_field';
import { CustomPmml } from './interfaces/custom/pmml';
import { parseVersionFromDescription } from './header';
import Algorithm from '../../algorithm';

//bluebird
import * as bluebird from 'bluebird'

//parsing xml string
import * as parseXmlString from 'xml2js'
var promisifiedParseXmlString: any = bluebird.promisify(parseXmlString.parseString)

export default async function(pmml: string) {
    //parse the pmml string
    var parsedPmml: CustomPmml = await promisifiedParseXmlString(pmml, {
        explicitArray: false,
        explicitChildren: true,
        preserveChildrenOrder: true
    });

    const explanatoryPredictors = parseDataFields(parsedPmml);
    var intermediatePredictors = 
        parseDerivedFields(parsedPmml.PMML.LocalTransformations.DerivedField);
    const baselineHazard = Number(parsedPmml.PMML.GeneralRegressionModel.$.baselineHazard);

    const parsedAlgorithm = new Algorithm().constructFromPmml(explanatoryPredictors, intermediatePredictors, baselineHazard, parseVersionFromDescription(parsedPmml.PMML.Header));

    //Find dangling intermediate predictors and throw an error if we find one
    parsedAlgorithm.getTopLevelIntermediatePredictors()
        .forEach((intermediatePredictor) => {
            const explanatoryPredictorForIntermediatePredictor = parsedAlgorithm.explanatoryPredictors
                .find((explanatoryPredictor) => {
                    return explanatoryPredictor.name === intermediatePredictor.name
                });

            if(!explanatoryPredictorForIntermediatePredictor) {
                throw new Error(`No explanatory predictor found for top most intermediate predictor with name ${intermediatePredictor.name}`)
            }
        });
    
    return parsedAlgorithm;
}