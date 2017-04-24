import { parseDataFields } from './data_field';
import { parseDerivedFields } from './derived_field';
import { CustomPmmlXml } from './interfaces/custom/pmml';
import { parseVersionFromDescription } from './header';
import { AlgorithmJson } from '../json/algorithm';
import { DerivedFieldJson } from '../json/derived_field';
import { IExplanatoryPredictor } from '../../predictors/explanatory_predictor';

//bluebird
import * as bluebird from 'bluebird'

//parsing xml string
import * as parseXmlString from 'xml2js'
var promisifiedParseXmlString: any = bluebird.promisify(parseXmlString.parseString)

function filterOutNotTopDerivedFields(derivedField: DerivedFieldJson, index: number, derivedFields: Array<DerivedFieldJson>): boolean {
    index;

    return derivedFields
        .find(currentDerivedField => currentDerivedField.explanatoryPredictors.indexOf(derivedField.name) > -1) ? false : true;
}

function filterOutDerivedFieldsAssociatedWithADataField(dataFields: Array<IExplanatoryPredictor>) {
    return (derivedField: DerivedFieldJson) => {
        return dataFields
            .find(dataField => dataField.name === derivedField.name) ? false : true
    }
}

export default async function(pmml: string): Promise<AlgorithmJson> {
    //parse the pmml string
    var parsedPmml: CustomPmmlXml = await promisifiedParseXmlString(pmml, {
        explicitArray: false,
        explicitChildren: true,
        preserveChildrenOrder: true
    });

    const explanatoryPredictors = parseDataFields(parsedPmml);
    var intermediatePredictors = 
        parseDerivedFields(parsedPmml.PMML.LocalTransformations.DerivedField);
    const baselineHazard = Number(parsedPmml.PMML.GeneralRegressionModel.$.baselineHazard);

    const parsedAlgorithm = {
        name: '',
        baselineHazard,
        version: parseVersionFromDescription(parsedPmml.PMML.Header),
        explanatoryPredictors, 
        intermediatePredictors 
    };

    //Find dangling intermediate predictors and throw an error if we find one
    parsedAlgorithm
        .intermediatePredictors
        .filter(filterOutNotTopDerivedFields)
        .filter(filterOutDerivedFieldsAssociatedWithADataField(explanatoryPredictors))
        .map((derivedField) => {
            console.warn(`Derived field ${derivedField.name} does not have a Data field associated with it`);
            return derivedField;
        })
        .map(() => {
            throw new Error(`Derived fields mentioned above do not have Data fields associated with them`);
        });
    
    return parsedAlgorithm;
}