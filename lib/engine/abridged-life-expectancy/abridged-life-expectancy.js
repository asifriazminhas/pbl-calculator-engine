"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
const lodash_1 = require("lodash");
const life_expectancy_1 = require("../life-expectancy/life-expectancy");
const lodash_2 = require("lodash");
const error_code_1 = require("../data-field/error-code");
/**
 * Used to calculate life expectancy with:
 * 1. An abridged life table
 * 2. A population
 *
 * Do no use if life table is an un-abridged one or for an individual
 *
 * @export
 * @class AbridgedLifeExpectancy
 */
class AbridgedLifeExpectancy extends life_expectancy_1.LifeExpectancy {
    constructor(model, genderedAbridgedLifeTable) {
        super(model);
        this.model = model;
        this.genderedAbridgedLifeTable = genderedAbridgedLifeTable;
    }
    /**
     * Calculates the average life expectancy for a population. Uses the
     * abridged life table for each gender and then averages them to get the
     * life expectancy for the population
     *
     * @param {Data[]} population
     * @returns
     * @memberof AbridgedLifeExpectancy
     */
    calculateForPopulation(population) {
        const malePopLifeExpectancy = this.calculateForPopulationForSex(population, 'male');
        const femalePopLifeExpectancy = this.calculateForPopulationForSex(population, 'female');
        return (malePopLifeExpectancy + femalePopLifeExpectancy) / 2;
    }
    /**
     * Returns the life table row where the age arg is between it's age group
     *
     * @protected
     * @param {(Array<ICompleteLifeTableRow & IAbridgedLifeTableRow>)} completeLifeTable
     * @param {number} age
     * @returns
     * @memberof AbridgedLifeExpectancy
     */
    getLifeTableRowForAge(completeLifeTable, age) {
        return completeLifeTable.find(lifeTableRow => {
            return this.isInAgeGroup(lifeTableRow, age);
        });
    }
    calculateForPopulationForSex(population, sex) {
        // The name of the age variable
        const AgeDatumName = 'age';
        // The name of the sex variable
        const SexDatumName = 'sex';
        const algorithmForCurrentSex = this.model.getAlgorithmForData([
            {
                name: SexDatumName,
                coefficent: sex,
            },
        ]);
        // Get the abridged life table for the current gender
        const abridgedLifeTable = this.genderedAbridgedLifeTable[sex];
        // Get all the individuals who are the current sex
        const populationForCurrentGender = population.filter(data => {
            return data_1.findDatumWithName(SexDatumName, data).coefficent === sex;
        });
        // Calculate the one year risk for each individual in the population
        const qxValues = populationForCurrentGender.map(data => {
            return this.getQx(data);
        });
        const WeightDatumName = 'WTS_M';
        const weightDataField = algorithmForCurrentSex.findDataField(WeightDatumName);
        const DefaultWeight = 1;
        // Calculate the weighted qx value to use for each row in the abridged life table
        const weightedQxForAgeGroups = abridgedLifeTable.map(lifeTableRow => {
            // Get all the individual who are in the age group of the current life table row
            const currentAgeGroupPop = populationForCurrentGender.filter(data => {
                const age = data_1.findDatumWithName(AgeDatumName, data)
                    .coefficent;
                return this.isInAgeGroup(lifeTableRow, age);
            });
            // Get the array of calculated qx values for each individual in the current age group population
            const qxValuesForCurrentAgeGroup = currentAgeGroupPop.map(data => {
                return qxValues[currentAgeGroupPop.indexOf(data)];
            });
            // Get the array of weights for each individual in the current age group population
            const weightsForCurrentAgeGroup = currentAgeGroupPop.map(data => {
                return weightDataField.validateData(data) ===
                    error_code_1.ErrorCode.NoDatumFound
                    ? DefaultWeight
                    : data_1.findDatumWithName(WeightDatumName, data)
                        .coefficent;
            });
            // Calculate the weighted mean using qxValuesForCurrentAgeGroup and weightsForCurrentAgeGroup
            return (qxValuesForCurrentAgeGroup.reduce((weightedQxMean, currentQxValue, index) => {
                return (weightedQxMean +
                    currentQxValue *
                        weightsForCurrentAgeGroup[index]);
            }, 0) / lodash_1.sum(weightsForCurrentAgeGroup));
        });
        const ageMaxAllowableValue = algorithmForCurrentSex.findDataField(AgeDatumName).interval.higherMargin.margin;
        // Make a life table with qx, nx and the fields in the ref life table
        // We will complete this in the next line of code
        const refLifeTableWithQxAndNx = abridgedLifeTable
            // Add on the qx and nx fields to each life table row
            .map((lifeTableRow, index) => {
            return Object.assign({}, lifeTableRow, {
                qx: weightedQxForAgeGroups[index],
                nx: this.getnx(lifeTableRow),
            });
        });
        // Get the index of the life table row after which we need to
        // stop calculating values
        const lastValidLifeTableRowIndex = abridgedLifeTable.findIndex(lifeTableRow => {
            return lifeTableRow.age_start > ageMaxAllowableValue;
        });
        const completeLifeTable = this.getCompleteLifeTable(refLifeTableWithQxAndNx, abridgedLifeTable[lastValidLifeTableRowIndex].age_start, [
            abridgedLifeTable[lastValidLifeTableRowIndex].age_start,
            abridgedLifeTable[lastValidLifeTableRowIndex - 1].age_start,
        ]);
        // The age of which ex value we will use from the life table to calculate the LE for the population
        const AgeLifeExpectancy = 20;
        return this.getLifeExpectancyForAge(completeLifeTable, AgeLifeExpectancy);
    }
    /**
     * Return the nx value for this life table row which is the range of ages
     * part of this age group
     *
     * @private
     * @param {IAbridgedLifeTableRow} { age_end, age_start }
     * @returns {number}
     * @memberof AbridgedLifeExpectancy
     */
    getnx({ age_end, age_start }) {
        const FinalRowNx = 1;
        const ageDifference = age_end - age_start;
        return ageDifference === 0
            ? 1
            : age_end === undefined ? FinalRowNx : ageDifference + 1;
    }
    /**
     * Check if an age is part of the age group for an abridged life table row
     *
     * @private
     * @param {IAbridgedLifeTableRow} { age_end, age_start }
     * @param {number} age
     * @returns {boolean}
     * @memberof AbridgedLifeExpectancy
     */
    isInAgeGroup({ age_end, age_start }, age) {
        // If the end age is not defined then this is the last life table row
        // so check if the age is greater than the start age
        // Otherwise check if it's within the range of the start age and end age
        // inRange fails if age is equal to the end age so check that as the
        // last condition
        return age_end === undefined
            ? age >= age_start
            : lodash_2.inRange(age, age_start, age_end) || age === age_end;
    }
}
exports.AbridgedLifeExpectancy = AbridgedLifeExpectancy;
//# sourceMappingURL=abridged-life-expectancy.js.map