 //models
import { DataField } from './data_field'
import { GenericDerivedField } from '../../common';
import { Covariate } from './covariate';
import HelperFunctions from './helper_functions'
import { Datum, datumFactory } from '../../data/datum'
import { env } from '../../env/env';
import { NoDataFoundForPredictorError } from '../errors';
import * as moment from 'moment';
import * as _ from 'lodash';
import { CategoricalMixin } from '../op_types/categorical';
import { ContinuousMixin  } from '../op_types/continuous';

export interface IDerivedField extends GenericDerivedField<DataField> {
}

export class DerivedField extends DataField implements IDerivedField {
    equation: string
    derivedFrom: Array<DataField>;

    evaluateEquation(obj: {
        [index: string]: any
    }): any {
        obj;

        let derived: any = undefined;
        let func = HelperFunctions;
        func;

        eval(this.equation);

        return derived;
    }

    /**
     *  
     * 
     * @param {Array<Datum>} data 
     * @returns {(number | string | moment.Moment)} 
     * 
     * @memberOf IntermediatePredictor
     */
    calculateCoefficent(data: Array<Datum>): number | string | moment.Moment {
        //Check if there is a datum for this intermediate predictor. If there is then we don't need to go further
        const datumForCurrentDerivedField = this
            .getDatumForDataField(data);

        if(datumForCurrentDerivedField) {
            return datumForCurrentDerivedField.coefficent;
        }
        else {
            //Filter out all the datum which are not needed for the equation evaluation
            let dataForEvaluation = data
                .filter(datum => this.derivedFrom
                    .find(derivedFromItem => derivedFromItem.name === datum.name) ? true : false);
            
            //If we don't have all the data for evaluation when calculate it
            if(dataForEvaluation.length !== this.derivedFrom.length) {
                dataForEvaluation = this.calculateDataToCalculateCoefficent(data);
            }

            if (env.shouldLogDebugInfo() === true) {
                console.groupCollapsed(`Derived Field: ${this.name}`)
                console.log(`Name: ${this.name}`)
                console.log(`Derived Field: ${this.equation}`)
                console.log(`Derived Field Data`)
                console.table(dataForEvaluation)
            }

            //make the object with the all the data needed for the equation evaluation
            const obj: {
                [index: string]: any
            } = {};
            dataForEvaluation.forEach(datum => obj[datum.name] = datum.coefficent);

            const evaluatedValue = this.evaluateEquation(obj);
            if(env.shouldLogDebugInfo()) {
                console.log(`Evaluated value: ${evaluatedValue}`);
                console.groupEnd();
            }
            return evaluatedValue;
        }
    }

    /**
     * 
     * 
     * @param {Array<Datum>} data 
     * @returns {Array<Datum>} 
     * 
     * @memberOf IntermediatePredictor
     */
    calculateDataToCalculateCoefficent(data: Array<Datum>): Array<Datum> {
        //Go through each explanatory predictor and calculate the coefficent for each which will be used for the evaluation
        return _.flatten(this.derivedFrom
            .map((derivedFromItem) => {
                const dataFieldName = derivedFromItem.name;
                
                if(derivedFromItem instanceof Covariate) {
                    return datumFactory(dataFieldName, derivedFromItem.calculateCoefficent(data));
                }
                else if(derivedFromItem instanceof DerivedField) {
                    return datumFactory(dataFieldName, derivedFromItem.calculateCoefficent(data));
                }
                else if(derivedFromItem instanceof DataField) {
                    const datumFound = derivedFromItem.getDatumForDataField(data);
                    if(!datumFound) {
                        throw NoDataFoundForPredictorError(dataFieldName, derivedFromItem.getErrorLabel());
                    }
                    else {
                        return datumFound;
                    }
                }
                else {
                    throw new Error(`Unhandled predictor type`);
                }
            }));
    }

    getAllDerivedFields(): Array<DataField> {
        return _.flatten(this.derivedFrom
            .map((derivedFromItem) => {
                if(derivedFromItem instanceof DerivedField) {
                    return derivedFromItem.getAllDerivedFields()
                            .concat(derivedFromItem);
                }
                else if(derivedFromItem instanceof Covariate) {
                    return derivedFromItem.getAllDerivedFields()
                        .concat(derivedFromItem);
                }
                else {
                    return [
                        derivedFromItem
                    ];
                }
            }))
            .filter((derivedFromItem, index, allDerivedFrom) => {
                return allDerivedFrom.indexOf(derivedFromItem) === index;
            });
    }

    canBeDerivedFromDataField(dataField: DataField): boolean {
        return this.derivedFrom.indexOf(dataField) > -1;
    }
}

export class CategoricalDerivedField extends CategoricalMixin(DerivedField) {}
export class ContinuousDerivedField extends ContinuousMixin(DerivedField) {}