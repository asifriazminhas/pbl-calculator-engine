"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const data_field_1 = require("../data-field");
const data_1 = require("../../data");
const moment = require("moment");
const common_tags_1 = require("common-tags");
const env_1 = require("../../../util/env");
const core_decorators_1 = require("core-decorators");
const datum_1 = require("../../data/datum");
const data_2 = require("../../data/data");
const errors_1 = require("../../errors");
let Covariate = class Covariate extends data_field_1.DataField {
    constructor(covariateJson, customFunction, derivedField) {
        super(covariateJson);
        this.beta = covariateJson.beta;
        this.groups = covariateJson.groups;
        this.referencePoint = covariateJson.referencePoint;
        this.customFunction = customFunction;
        this.derivedField = derivedField;
    }
    getComponent(data, userFunctions, tables) {
        if (env_1.shouldLogWarnings()) {
            console.groupCollapsed(`${this.name}`);
        }
        const component = this.calculateComponent(this.calculateCoefficient(data, userFunctions, tables));
        if (env_1.shouldLogDebugInfo() === true) {
            console.groupEnd();
        }
        return component;
    }
    calculateCoefficient(data, userDefinedFunctions, tables) {
        let coefficent = 0;
        try {
            coefficent = data_2.findDatumWithName(this.name, data).coefficent;
        }
        catch (err) {
            if (err instanceof errors_1.NoDatumFoundError) {
                if (this.customFunction) {
                    coefficent = this.customFunction.calculateCoefficient(data);
                }
                else if (this.derivedField) {
                    coefficent = this.derivedField.calculateCoefficent(data, userDefinedFunctions, tables);
                }
            }
            else {
                throw err;
            }
        }
        const formattedCoefficent = this.formatCoefficentForComponent(coefficent);
        return formattedCoefficent === undefined ? 0 : formattedCoefficent;
    }
    calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables) {
        // Try to find a datum with the same name field in the data arg
        const datumFound = this.getDatumForField(data);
        /* If we did not find anything then we need to calculate the coefficent
        using either a custom function or the coresponding derived field */
        if (!datumFound) {
            if (this.customFunction) {
                return this.customFunction.calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables);
            }
            else if (this.derivedField) {
                // Custom function has higher priority
                // Fall back to derived field
                try {
                    return this.derivedField.calculateDataToCalculateCoefficent(data, userDefinedFunctions, tables);
                }
                catch (err) {
                    if (env_1.shouldLogWarnings()) {
                        console.warn(common_tags_1.oneLine `Incomplete data to calculate coefficent for
                            data field ${this.name}. Setting it to reference
                            point`);
                    }
                    return [
                        datum_1.datumFactoryFromDataField(this, this.referencePoint),
                    ];
                }
            }
            else {
                // Fall back to setting it to reference point
                if (env_1.shouldLogWarnings()) {
                    console.warn(common_tags_1.oneLine `Incomplete data to calculate coefficent for
                        datafield ${this.name}. Setting it to reference point`);
                }
                return [data_1.datumFromCovariateReferencePointFactory(this)];
            }
        }
        else {
            return [datumFound];
        }
    }
    /**
     * Returns all the fields which are part of this Covariate's dependency
     * tree. **Does not return the covariate itself**.
     *
     * @returns {DataField[]}
     * @memberof Covariate
     */
    getDescendantFields() {
        return this.derivedField ? this.derivedField.getDescendantFields() : [];
    }
    isPartOfGroup(group) {
        return this.groups.indexOf(group) !== -1;
    }
    calculateComponent(coefficent) {
        const component = coefficent * this.beta;
        if (env_1.shouldLogDebugInfo()) {
            console.log(`Covariate ${this.name}`);
            console.log(`Input ${coefficent} ${coefficent === this.referencePoint
                ? 'Set to Reference Point'
                : ''}`);
            console.log(`PMML Beta ${this.beta}`);
            console.log(`Component ${component}`);
        }
        return component;
    }
    formatCoefficentForComponent(coefficent) {
        if (coefficent instanceof moment || coefficent instanceof Date) {
            throw new Error(`Coefficent is not a number ${this.name}`);
        }
        else if (coefficent === null ||
            coefficent === undefined ||
            coefficent === 'NA' ||
            isNaN(coefficent)) {
            return this.referencePoint;
        }
        else {
            const formattedCoefficient = Number(coefficent);
            return this.interval
                ? this.interval.limitNumber(formattedCoefficient)
                : formattedCoefficient;
        }
    }
};
Covariate = tslib_1.__decorate([
    core_decorators_1.autobind
], Covariate);
exports.Covariate = Covariate;
//# sourceMappingURL=covariate.js.map