import { getASTForConstant } from './node_parser';

//bluebird
import * as bluebird from 'bluebird'

//parsing xml string
import * as parseXmlString from 'xml2js'
var promisifiedParseXmlString: any = bluebird.promisify(parseXmlString.parseString)

//generating javascript string code from AST's
import * as escodegen from 'escodegen'

//models
import {
    getASTForApply
} from './node_parser'
import Algorithm from '../algorithm'
import ExplanatoryPredictor from '../predictors/explanatory_predictor'
import IntermediatePredictor from '../predictors/intermediate_predictor'
import {
    parseCustomFunction
} from './custom_function';

//interfaces
import {
    Pmml,
    Apply,
    FieldRef,
    DerivedField,
    ApplyChildNode
} from '../interfaces/pmml/pmml'

//Returns the js code strings which needs to be evaluated to compute this derived field
//The DerivedField pmml xml node to get the equation from
function getDerivedFieldEquation(derivedField: DerivedField): string {
    let right: any = null;
    if (derivedField.Apply) {
        right = getASTForApply(derivedField.Apply);
    }
    else if (derivedField.Constant) {
        right = getASTForConstant(derivedField.Constant);
    }
    else {
        throw new Error(`Unknown root node in derived field`);
    }

    //make the line of code 'var {derivedFieldName};'
    var declarationAst = {
        type: 'ExpressionStatement',
        expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
                type: 'Identifier',
                name: 'derived'
            },
            right
        }
    };

    //Return the js code string to evaluate
    return escodegen.generate(declarationAst)
}

function getDerivedFromForApplyTag(tag: Apply): Array<string> {
    return tag.$$.reduce((currentDerivedFrom: Array<string>, child: ApplyChildNode) => {
        //If this a FieldRef node then it has the name of a predictor which this derived field depends on
        if (child['#name'] === 'FieldRef') {
            child = child as FieldRef
            currentDerivedFrom.push(child.$.field)
        }
        //This node has more child nodes so recursively call this function
        else if ((child as Apply).$$) {
            currentDerivedFrom = currentDerivedFrom
            .concat(getDerivedFromForApplyTag(child as Apply));
        }

        return currentDerivedFrom;
    }, [])
        //Remove all duplicate predictor names
        .reduce((currentDerivedFrom: Array<string>, derivedFrom: string) => {
            if (currentDerivedFrom.indexOf(derivedFrom) < 0)
                currentDerivedFrom.push(derivedFrom);

            return currentDerivedFrom;
        }, [])
        .filter((derivedFrom) => {
            return derivedFrom !== 'NA'
        })
}

//Used to construct a DerivedPredictor. Returns an array of strings where each string corresponds to the name of the predictor which this derive equation needs to be evaluated
//tag: The pmml xml node to go through to find all the predictor names. Start with a DerivedField node
function getDerivedFrom(derivedField: DerivedField): Array<string> {
    if(derivedField.Constant) {
        return [];
    }
    else if(derivedField.Apply) {
        return getDerivedFromForApplyTag(derivedField.Apply);
    }
    else {
        throw new Error(`Unknown root tag in derivedField`);
    }
}

export default async function (Algorithm: {
    new (): Algorithm
}, ExplanatoryPredictor: {
    new (): ExplanatoryPredictor
}, IntermediatePredictor: {
    new (): IntermediatePredictor
}, pmml: string) {
    //parse the pmml string
    var parsedPmml: Pmml = await promisifiedParseXmlString(pmml, {
        explicitArray: false,
        explicitChildren: true,
        preserveChildrenOrder: true
    });

    var explanatoryPredictors = parsedPmml.PMML.GeneralRegressionModel.ParamMatrix.PCell
        .map((pCell) => {
            var ppCellForCurrentPCell = parsedPmml.PMML.GeneralRegressionModel.PPMatrix.PPCell
                .find((ppCell) => {
                    return ppCell.$.parameterName === pCell.$.parameterName
                })

            if (ppCellForCurrentPCell === undefined) {
                throw new Error(`No ppCell found for pCell ${pCell.$.parameterName}`)
            }

            var dataFieldForCurrentPCell = parsedPmml.PMML.DataDictionary.DataField
                .find((dataField) => {
                    if (ppCellForCurrentPCell === undefined) {
                        throw new Error(`No ppCell found for pCell ${pCell.$.parameterName}`)
                    }
                    else {
                        return dataField.$.name === ppCellForCurrentPCell.$.predictorName
                    }
                })

            var parameterForCurrentPCell = parsedPmml.PMML.GeneralRegressionModel.ParameterList.Parameter
                .find((parameterList) => {
                    if (ppCellForCurrentPCell === undefined) {
                        throw new Error(`No ppCell found for pCell ${pCell.$.parameterName}`)
                    }
                    else {
                        return parameterList.$.name === ppCellForCurrentPCell.$.parameterName
                    }
                })

            if (parameterForCurrentPCell === undefined) {
                throw new Error(`No ParamaterList found for ppCell ${ppCellForCurrentPCell.$.predictorName}`)
            }

            if (dataFieldForCurrentPCell === undefined) {
                throw new Error(`No DataField found for ppCell ${ppCellForCurrentPCell.$.predictorName}`)
            }

            return new ExplanatoryPredictor().constructFromPmml(dataFieldForCurrentPCell.$.name, dataFieldForCurrentPCell.$.optype, pCell.$.beta, parameterForCurrentPCell.$.referencePoint, parseCustomFunction(parameterForCurrentPCell, parsedPmml.PMML.GeneralRegressionModel.RestrictedCubicSpline))
        })

    var intermediatePredictors: Array<IntermediatePredictor> = []
    if (parsedPmml.PMML.LocalTransformations) {
        //All the derived predictors for this algorithm
        intermediatePredictors = parsedPmml.PMML.LocalTransformations.DerivedField
            .map((derivedField) => {
                //Construct the DerivedPredictor object
                return new IntermediatePredictor().constructFromPmml(derivedField.$.name, derivedField.$.optype, getDerivedFieldEquation(derivedField), getDerivedFrom(derivedField));
            });
    }

    const baselineHazard = Number(parsedPmml.PMML.GeneralRegressionModel.$.baselineHazard);

    const parsedAlgorithm = new Algorithm().constructFromPmml(explanatoryPredictors, intermediatePredictors, baselineHazard);

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