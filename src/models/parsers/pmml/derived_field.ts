import IntermediatePredictor from '../../predictors/intermediate_predictor';
import { DerivedField, Apply, FieldRef, ApplyChildNode } from './interfaces/pmml';
import * as escodegen from 'escodegen';
import { getASTForApply, getASTForConstant, getASTForFieldRef } from './node_parser';

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
    else if (derivedField.FieldRef) {
        right = getASTForFieldRef(derivedField.FieldRef);
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

/**
 * 
 * 
 * @param {Apply} tag 
 * @returns {Array<string>} 
 */
function getDerivedFromForApplyTag(tag: Apply): Array<string> {
    return tag.$$
        .reduce((currentDerivedFrom: Array<string>, child: ApplyChildNode) => {
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
    //If the DerivedField has a Constant as the node then it has no dependencies
    if(derivedField.Constant) {
        return [];
    }
    //If it has an Apply node
    else if(derivedField.Apply) {
        return getDerivedFromForApplyTag(derivedField.Apply);
    }
    //If it has a FieldRef then it's only dependency is this FieldRef
    else if (derivedField.FieldRef) {
        return [
            derivedField.FieldRef.$.field
        ];
    }
    else {
        throw new Error(`Unknown root tag in derivedField`);
    }
}

export function parseDerivedFields(derivedField: Array<DerivedField>): Array<IntermediatePredictor> {
    //All the derived predictors for this algorithm
    return derivedField
        .map((derivedField) => {
            //Construct the DerivedPredictor object
            return new IntermediatePredictor().constructFromPmml(derivedField.$.name, derivedField.$.optype, getDerivedFieldEquation(derivedField), getDerivedFrom(derivedField));
        });
}