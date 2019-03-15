import { Data, findDatumWithName } from '../data';
import { Model } from '../model';
import {
    IAbridgedLifeTableRow,
    IGenderedAbridgedLifeTable,
} from './abridged-life-table';
import { sum } from 'lodash';
import {
    LifeExpectancy,
    ICompleteLifeTableRow,
} from '../life-expectancy/life-expectancy';
import { inRange } from 'lodash';
import { DerivedField } from '../data-field/derived-field/derived-field';

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
export class AbridgedLifeExpectancy extends LifeExpectancy<
    IAbridgedLifeTableRow
> {
    private genderedAbridgedLifeTable: IGenderedAbridgedLifeTable;

    constructor(
        model: Model,
        genderedAbridgedLifeTable: IGenderedAbridgedLifeTable,
    ) {
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
    calculateForPopulation(population: Data[]) {
        const malePopLifeExpectancy = this.calculateForPopulationForSex(
            population,
            'male',
        );
        const femalePopLifeExpectancy = this.calculateForPopulationForSex(
            population,
            'female',
        );

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
    protected getLifeTableRowForAge(
        completeLifeTable: Array<ICompleteLifeTableRow & IAbridgedLifeTableRow>,
        age: number,
    ) {
        return completeLifeTable.find(lifeTableRow => {
            return this.isInAgeGroup(lifeTableRow, age);
        });
    }

    private calculateForPopulationForSex(
        population: Data[],
        sex: 'male' | 'female',
    ) {
        // The name of the sex variable
        const SexDatumName = 'DHH_SEX';
        const sexDataField = this.model.modelFields.find(({ name }) => {
            return name === SexDatumName;
        })!;
        // Get the value of the category in this model for the sex argument
        const sexCategory = sexDataField.categories!.find(
            ({ displayValue }) => {
                return displayValue.toLocaleLowerCase().trim() === sex;
            },
        )!.value;

        const algorithmForCurrentSex = this.model.getAlgorithmForData([
            {
                name: SexDatumName,
                coefficent: sexCategory,
            },
        ]);

        // The name of the age variable
        const AgeDatumName = 'DHHGAGE_cont';
        const ageDerivedField = algorithmForCurrentSex.findDataField(
            AgeDatumName,
        ) as DerivedField;

        // Get the abridged life table for the current gender
        const abridgedLifeTable = this.genderedAbridgedLifeTable[sex];

        // Get all the individuals who are the current sex
        const populationForCurrentGender = population.filter(data => {
            return (
                findDatumWithName(SexDatumName, data).coefficent === sexCategory
            );
        });

        // Calculate the one year risk for each individual in the population
        const qxValues = populationForCurrentGender.map(data => {
            return this.getQx(data);
        });

        const WeightDatumName = 'WTS_M';
        const weightDataField = this.model.modelFields.find(({ name }) => {
            return name === WeightDatumName;
        })!;
        const DefaultWeight = 1;
        // Calculate the weighted qx value to use for each row in the abridged life table
        const weightedQxForAgeGroups: number[] = abridgedLifeTable.map(
            lifeTableRow => {
                // Get all the individual who are in the age group of the current life table row
                const currentAgeGroupPop = populationForCurrentGender.filter(
                    data => {
                        // Calculate the age of this individual using the ageDataField variable
                        const age = Number(
                            ageDerivedField.calculateCoefficent(
                                ageDerivedField.calculateDataToCalculateCoefficent(
                                    data,
                                    algorithmForCurrentSex.userFunctions,
                                    algorithmForCurrentSex.tables,
                                ),
                                algorithmForCurrentSex.userFunctions,
                                algorithmForCurrentSex.tables,
                            ),
                        );

                        return this.isInAgeGroup(lifeTableRow, age);
                    },
                );

                // Get the array of calculated qx values for each individual in the current age group population
                const qxValuesForCurrentAgeGroup = currentAgeGroupPop.map(
                    data => {
                        return qxValues[currentAgeGroupPop.indexOf(data)];
                    },
                );
                // Get the array of weights for each individual in the current age group population
                const weightsForCurrentAgeGroup = currentAgeGroupPop.map(
                    data => {
                        const weightValidation = weightDataField.validateData(
                            data,
                        );

                        return weightValidation !== true
                            ? DefaultWeight
                            : Number(
                                  findDatumWithName(WeightDatumName, data)
                                      .coefficent,
                              );
                    },
                );

                // Calculate the weighted mean using qxValuesForCurrentAgeGroup and weightsForCurrentAgeGroup
                const weightedQx =
                    qxValuesForCurrentAgeGroup.reduce(
                        (weightedQxMean, currentQxValue, index) => {
                            return (
                                weightedQxMean +
                                currentQxValue *
                                    weightsForCurrentAgeGroup[index]
                            );
                        },
                        0,
                    ) / sum(weightsForCurrentAgeGroup);
                // If the qx value is not a number then return the value of the qx in the life table row
                return isNaN(weightedQx) ? lifeTableRow.qx : weightedQx;
            },
        );

        const ageMaxAllowableValue = algorithmForCurrentSex.findDataField(
            AgeDatumName,
        ).intervals![0].higherMargin!.margin;
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
        const lastValidLifeTableRowIndex = abridgedLifeTable.findIndex(
            lifeTableRow => {
                return lifeTableRow.age_start > ageMaxAllowableValue;
            },
        );
        const completeLifeTable = this.getCompleteLifeTable(
            refLifeTableWithQxAndNx,
            abridgedLifeTable[lastValidLifeTableRowIndex].age_start,
            [
                abridgedLifeTable[lastValidLifeTableRowIndex].age_start,
                abridgedLifeTable[lastValidLifeTableRowIndex - 1].age_start,
            ],
        );

        // The age of which ex value we will use from the life table to calculate the LE for the population
        const AgeLifeExpectancy = 20;
        return this.getLifeExpectancyForAge(
            completeLifeTable,
            AgeLifeExpectancy,
        );
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
    private getnx({ age_end, age_start }: IAbridgedLifeTableRow): number {
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
    private isInAgeGroup(
        { age_end, age_start }: IAbridgedLifeTableRow,
        age: number,
    ): boolean {
        // If the end age is not defined then this is the last life table row
        // so check if the age is greater than the start age
        // Otherwise check if it's within the range of the start age and end age
        // inRange fails if age is equal to the end age so check that as the
        // last condition
        return age_end === undefined
            ? age >= age_start
            : inRange(age, age_start, age_end) || age === age_end;
    }
}
