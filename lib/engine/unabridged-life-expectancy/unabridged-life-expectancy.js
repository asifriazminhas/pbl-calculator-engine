"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const life_expectancy_1 = require("../life-expectancy/life-expectancy");
const interaction_covariate_1 = require("../data-field/covariate/interaction-covariate/interaction-covariate");
const non_interaction_covariate_1 = require("../data-field/covariate/non-interaction-covariats/non-interaction-covariate");
const data_field_1 = require("../data-field/data-field");
const lodash_1 = require("lodash");
const data_1 = require("../data/data");
const data_2 = require("../data");
class UnAbridgedLifeExpectancy extends life_expectancy_1.LifeExpectancy {
    constructor(model, genderedUnAbridgedLifeTable) {
        super(model);
        this.model = model;
        this.genderedUnAbridgedLifeTable = genderedUnAbridgedLifeTable;
    }
    /**
     * Calculates the life expectancy for an individual using a un-abridged
     * life table
     *
     * @param {Data} data The variables and their values for this individual
     * @returns {number}
     * @memberof UnABridgedLifeExpectancy
     */
    calculateForIndividual(data) {
        const algorithm = this.model.getAlgorithmForData(data);
        // For an algorithm which has binning data we don't need to use the
        // life table
        if ('bins' in algorithm && algorithm.bins !== undefined) {
            // Ge the bin data for the bin this individual is in
            const binData = algorithm.bins.getBinDataForScore(algorithm.calculateScore(data));
            // Get the survival time for the median survival value (50) for
            // this bin
            const MedianSurvival = 50;
            return binData.find(binDatum => {
                return binDatum.survivalPercent === MedianSurvival;
            }).time;
        }
        else {
            const AgeDatumName = 'age';
            const ageDatum = data_2.findDatumWithName(AgeDatumName, data);
            const ageInteractionCovariates = algorithm.covariates.filter(covariate => {
                return (covariate instanceof interaction_covariate_1.InteractionCovariate &&
                    covariate.isPartOfGroup('AGE'));
            });
            const ageNonInteractionCovariates = algorithm.covariates.filter(covariate => {
                return (covariate instanceof non_interaction_covariate_1.NonInteractionCovariate &&
                    covariate.isPartOfGroup('AGE'));
            });
            const allAgeFields = data_field_1.DataField.getUniqueDataFields(lodash_1.flatten(ageNonInteractionCovariates
                .map(covariate => {
                return covariate.getDescendantFields();
            })
                .concat(ageInteractionCovariates)
                .concat(ageNonInteractionCovariates)));
            const dataWithoutAgeFields = data_1.filterDataForFields(data, allAgeFields);
            /* When we go through each row of the life table and calculate ex, the only
            coefficient that changes going from one covariate to the next are the ones
            belonging to the age covariate since we increment the age value from one
            row of the life table to the next. As an optimization we precalculate the
            coefficients for all covariates that are not part of the age group and use it as the base data for
            calculating qx for each life table row*/
            const lifeTableDataWithoutAge = data_1.filterDataForFields(algorithm
                .getCovariatesWithoutGroup('AGE')
                /* Goes through all non-age covariates and calculates the data
                required to calculate the coefficient for each one. Then uses the
                data to calculate the actual coefficient and finally adds it all
                to the currentData argument to be used by the next covariate */
                .reduce((currentData, covariate) => {
                const currentCoefficientData = covariate.calculateDataToCalculateCoefficent(currentData, algorithm.userFunctions, algorithm.tables);
                const covariateCoefficient = {
                    name: covariate.name,
                    coefficent: covariate.calculateCoefficient(currentCoefficientData, algorithm.userFunctions, algorithm.tables),
                };
                return currentData
                    .concat(currentCoefficientData)
                    .concat([covariateCoefficient]);
            }, dataWithoutAgeFields.concat(ageDatum)), allAgeFields);
            const SexDatumName = 'sex';
            const unAbridgedLifeTable = this.genderedUnAbridgedLifeTable[data_2.findDatumWithName(SexDatumName, data).coefficent];
            // The partial life table we will
            const refLifeTableWithQxAndNx = unAbridgedLifeTable.map(lifeTableRow => {
                return Object.assign({}, lifeTableRow, {
                    qx: this.getQx(lifeTableDataWithoutAge.concat({
                        name: AgeDatumName,
                        coefficent: lifeTableRow.age,
                    })),
                    nx: 1,
                });
            });
            const ageMaxAllowableValue = algorithm.findDataField(AgeDatumName)
                .interval.higherMargin.margin;
            // Get the index of the life table row after which we need to
            // stop calculating values
            const lastValidLifeTableRowIndex = unAbridgedLifeTable.findIndex(lifeTableRow => {
                return lifeTableRow.age > ageMaxAllowableValue;
            });
            const completeLifeTable = this.getCompleteLifeTable(refLifeTableWithQxAndNx, unAbridgedLifeTable[lastValidLifeTableRowIndex].age, [
                unAbridgedLifeTable[lastValidLifeTableRowIndex].age,
                unAbridgedLifeTable[lastValidLifeTableRowIndex - 1].age,
            ]);
            return this.getLifeExpectancyForAge(completeLifeTable, ageDatum.coefficent);
        }
    }
    getLifeTableRowForAge(completeLifeTable, age) {
        return completeLifeTable.find(lifeTableRow => {
            return lifeTableRow.age === age;
        });
    }
}
exports.UnAbridgedLifeExpectancy = UnAbridgedLifeExpectancy;
//# sourceMappingURL=unabridged-life-expectancy.js.map