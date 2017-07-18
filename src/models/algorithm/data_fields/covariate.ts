//models
import { GenericCovariate, GenericCategory } from '../../common';
import { DataField } from './data_field';
import { DerivedField } from './derived_field';
import { CustomFunction } from './custom_functions/custom_function';
import * as moment from 'moment';
import { CoefficentIsNotANumber } from '../errors';
import { Datum, datumFromCovariateReferencePointFactory, datumFactory } from '../../data/datum';
import { env } from '../../env/env';
import { CategoricalMixin } from '../op_types/categorical';
import { ContinuousMixin } from '../op_types/continuous';

export interface ICovariate extends GenericCovariate {
    derivedField: DerivedField | null;
}

export class Covariate extends DataField implements ICovariate {
    beta: number
    referencePoint: number
    customFunction: CustomFunction | null;
    derivedField: DerivedField | null;

    /**
     * Returns the component for the Predictor
     * 
     * @param {ExplanatoryPredictor} predictor
     * @param {Array<Datum>} data
     * @returns {number}
     * 
     * @memberOf Algorithm
     */
    getComponent(data: Array<Datum>): number {
        if(env.shouldLogWarnings()) {
            console.groupCollapsed(`${this.name}`);
        }

        const component = this.calculateComponent(
            this.calculateCoefficent(data)
        );

        if(env.shouldLogDebugInfo() === true) {
            console.groupEnd()
        }

        return component
    }

    /**
     * Calculates the component for this predictor from the coefficent arg
     * 
     * @param {number} coefficent 
     * @returns {number} 
     * 
     * @memberOf ExplanatoryPredictor
     */
    calculateComponent(coefficent: number): number {
        var component = coefficent*this.beta;

        if(env.shouldLogDebugInfo()) {
            console.log(`Covariate ${this.name}`)
            console.log(`Input ${coefficent} ${coefficent === this.referencePoint ? 'Set to Reference Point' : ''}`)
            console.log(`PMML Beta ${this.beta}`)
            console.log(`Component ${component}`)
        }

        return component
    }

    /**
     * Formats the calculated coefficent into a number so that it can be used in component calculation
     * 
     * @param {*} coefficent 
     * @returns {number} 
     * 
     * @memberOf ExplanatoryPredictor
     */
    private formatCoefficent(coefficent: any): number {
        if(!coefficent === null || coefficent === undefined) {
            return this.referencePoint;
        }
        if(coefficent instanceof moment) {
            throw CoefficentIsNotANumber(this.name);
        }
        else if(coefficent === 'NA') {
            return this.referencePoint;
        }
        else if(!isNaN(coefficent as number)) {
            return Number(coefficent);
        }
        else if(isNaN(coefficent)) {
            return this.referencePoint;
        }
        else {
            throw CoefficentIsNotANumber(this.name);
        }
    }

    /**
     * Calculates the data used in the calculateCoefficent method
     * 
     * @param {Array<Datum>} data 
     * @returns {Array<Datum>} 
     * 
     * @memberOf ExplanatoryPredictor
     */
    calculateDataToCalculateCoefficent(data: Array<Datum>): Array<Datum> {
        //Try to find a datum with the same name field in the data arg
        const datumFound = this.getDatumForDataField(data);

        //If we did not find anything then we need to calculate the coefficent using either a custom function or the coresponding derived field
        if(!datumFound) {
            //Custom function has higher priority
            if(this.customFunction) {
                return this.customFunction.calculateDataToCalculateCoefficent(data);
            }
            //Fall back tod erived field
            else if(this.derivedField) {
                try {
                    return this.derivedField.calculateDataToCalculateCoefficent(data);
                }
                catch(err) {
                    if(env.shouldLogWarnings()) {
                        console.warn(`Incomplete data to calculate coefficent for data field ${this.name}. Setting it to reference point`);
                    }

                    return [
                        datumFactory(this.name, this.referencePoint)
                    ];
                }
            }
            //Fall back to setting it to reference point
            else {
                if(env.shouldLogWarnings()) {
                    console.warn(`Incomplete data to calculate coefficent for data field ${this.name}. Setting it to reference point`);
                }

                return [
                    datumFromCovariateReferencePointFactory(this)
                ];
            }
        }
        else {
            return [
                datumFound
            ];
        }
    }

    /**
     * Calculates the preformatted coefficent
     * 
     * @param {Array<Datum>} data 
     * @returns {number} 
     * 
     * @memberOf ExplanatoryPredictor
     */
    calculateCoefficent(data: Array<Datum>): number {
        const coefficentData = this.calculateDataToCalculateCoefficent(data);
        let coefficent: any = 0;

        if (coefficentData.length === 1 && coefficentData[0].name === this.name) {
            coefficent = (coefficentData[0].coefficent);
        }
        else if(this.customFunction) {
            coefficent = this.customFunction.calculateCoefficent(coefficentData);
        }
        else if(this.derivedField) {
            coefficent = this.derivedField.calculateCoefficent(coefficentData);
        }

        return this.formatCoefficent(coefficent);
    }

    getAllDerivedFields(): Array<DataField> {
        if(!this.derivedField) {
            return [];
        }
        else {
            return this.derivedField.getAllDerivedFields();
        }
    }

    canBeDerivedFromDataField(dataField: DataField): boolean {
        if (this.derivedField) {
            return this.derivedField.canBeDerivedFromDataField(dataField);
        }
        else {
            return false;
        }
    }
}

export class CategoricalCovariate extends CategoricalMixin(Covariate) {}
export class ContinuousCovariate extends ContinuousMixin(Covariate) {}