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
import { DataField } from '../data-field/data-field';
import { shouldLogDebugInfo } from '../../util/env';
import { debugLe } from '../../debug/debug-le';

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

    private SexVariable = 'DHH_SEX';
    private ContAgeField = 'DHHGAGE_cont';

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
     * @param {boolean} useWeights Whether the final value LE value should be weighted. Defaults to true.
     * @returns
     * @memberof AbridgedLifeExpectancy
     */
    calculateForPopulation(population: Data[], useWeights: boolean = true) {
        if (shouldLogDebugInfo()) {
            console.groupCollapsed(`Abridged LE for population`);
        }

        const malePopLifeExpectancy = this.calculateForPopulationForSex(
            population,
            'male',
            useWeights,
        );
        const femalePopLifeExpectancy = this.calculateForPopulationForSex(
            population,
            'female',
            useWeights,
        );

        const le = (malePopLifeExpectancy + femalePopLifeExpectancy) / 2;

        if (shouldLogDebugInfo()) {
            console.log(`Population LE: ${le}`);
            console.groupEnd();
        }

        return le;
    }

    /**
     * Returns the life years left for an individual
     *
     * @param {Data} individual
     * @returns
     * @memberof AbridgedLifeExpectancy
     */
    calculateForIndividual(individual: Data) {
        // Variable initialization

        // Algorithm selected by the individual's sex
        const algorithm = this.model.getAlgorithmForData(individual);
        // The continuous age field in the algorithm. This value will be varied going from one life table row to another
        const ageContField = algorithm.findDataField(
            this.ContAgeField,
        ) as DerivedField;
        // Calculate the age of the individual
        const ageContValue = ageContField.calculateCoefficent(
            ageContField.calculateDataToCalculateCoefficent(
                individual,
                algorithm.userFunctions,
                algorithm.tables,
            ),
            algorithm.userFunctions,
            algorithm.tables,
        ) as number;

        // Get the life table to use for the individual based on their sex

        // Get the entered sex of the individual
        const sex = findDatumWithName(this.SexVariable, individual)
            .coefficent as string;
        // Go through the categories for the sex field and find the one for the current value of sex. It's displayValue should be male or female and we use that to get the life table
        const maleOrFemaleString = this.model.modelFields
            .find(({ name }) => {
                return name === this.SexVariable;
            })!
            .categories!.find(category => {
                return category.value === sex;
            })!
            .displayValue.toLowerCase() as 'male' | 'female';
        const lifeTableForIndividual = this.genderedAbridgedLifeTable[
            maleOrFemaleString
        ];

        debugLe.startCollecting();

        // Add qx to the base life table for this individual

        const AgeField = 'DHHGAGE';
        // We want to the populate the age value for this individual with the value from each life table row. So remove the age field from the data for this individual
        const individualWithoutAgeDatum = individual.filter(datum => {
            return datum.name !== AgeField;
        });
        const lifeTableWithQx = lifeTableForIndividual
            // Remove all life table rows whose age group is younger than this individual
            .filter(lifeTableRow => {
                return (
                    this.isInAgeGroup(lifeTableRow, ageContValue) ||
                    lifeTableRow.age_start > ageContValue
                );
            })
            .map(lifeTableRow => {
                return Object.assign({}, lifeTableRow, {
                    qx: this.getQx(
                        // Add the age value to be the median for this age group or the age start for the last row since age_end will be undefined
                        individualWithoutAgeDatum.concat({
                            name: this.ContAgeField,
                            coefficent: lifeTableRow.age_end
                                ? (lifeTableRow.age_end -
                                      lifeTableRow.age_start) /
                                  2
                                : lifeTableRow.age_start,
                        }),
                    ),
                    nx: this.getnx(lifeTableRow),
                });
            });

        const ageMaxAllowableValue = this.getMaxAge(ageContField);
        // Get the index of the life table row after which we need to
        // stop calculating values
        const lastValidLifeTableRowIndex = this.getLastValidLifeTableRowIndex(
            lifeTableWithQx,
            ageMaxAllowableValue,
        );
        const completeLifeTable = this.getCompleteLifeTable(
            lifeTableWithQx,
            ageMaxAllowableValue,
            [
                lifeTableForIndividual[lastValidLifeTableRowIndex].age_start,
                lifeTableForIndividual[lastValidLifeTableRowIndex - 1]
                    .age_start,
            ],
        );

        const lifeYearsRemaining = completeLifeTable[0].ex;

        debugLe.addEndDebugInfo(completeLifeTable, lifeYearsRemaining);

        return lifeYearsRemaining;
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
        useWeights: boolean,
    ) {
        if (shouldLogDebugInfo()) {
            console.groupCollapsed(`Life table for sex: ${sex}`);
        }

        const sexDataField = this.model.modelFields.find(({ name }) => {
            return name === this.SexVariable;
        })!;
        // Get the value of the category in this model for the sex argument
        const sexCategory = sexDataField.categories!.find(
            ({ displayValue }) => {
                return displayValue.toLocaleLowerCase().trim() === sex;
            },
        )!.value;

        const algorithmForCurrentSex = this.model.getAlgorithmForData([
            {
                name: this.SexVariable,
                coefficent: sexCategory,
            },
        ]);

        const ageDerivedField = algorithmForCurrentSex.findDataField(
            this.ContAgeField,
        ) as DerivedField;

        // Get the abridged life table for the current gender
        const abridgedLifeTable = this.genderedAbridgedLifeTable[sex];

        // Get all the individuals who are the current sex
        const populationForCurrentGender = population.filter(data => {
            return (
                findDatumWithName(this.SexVariable, data).coefficent ===
                sexCategory
            );
        });

        if (shouldLogDebugInfo()) {
            console.groupCollapsed(`Individual qx calculations`);
        }
        // Calculate the one year risk for each individual in the population
        const qxValues = populationForCurrentGender.map((data, index) => {
            if (shouldLogDebugInfo()) {
                console.groupCollapsed(`Qx for male ${index}`);
            }

            const qx = this.getQx(data);

            if (shouldLogDebugInfo()) {
                console.log(`Qx: ${qx}`);
                console.groupEnd();
            }

            return qx;
        });
        if (shouldLogDebugInfo()) {
            console.groupEnd();
        }

        const WeightDatumName = 'WTS_M';
        const weightDataField = this.model.modelFields.find(({ name }) => {
            return name === WeightDatumName;
        })!;
        const DefaultWeight = 1;

        if (shouldLogDebugInfo()) {
            console.groupCollapsed(
                `Weighted qx calculations for life table rows`,
            );
        }
        // Calculate the weighted qx value to use for each row in the abridged life table
        const weightedQxForAgeGroups: number[] = abridgedLifeTable.map(
            lifeTableRow => {
                if (shouldLogDebugInfo()) {
                    console.groupCollapsed(
                        `Qx for life table row with age_start ${lifeTableRow.age_start}`,
                    );
                }

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

                        return weightValidation !== true || useWeights === false
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
                const qxValue = isNaN(weightedQx)
                    ? lifeTableRow.qx
                    : weightedQx;

                if (shouldLogDebugInfo()) {
                    console.log(`Qx Value: ${qxValue}`);
                    console.groupEnd();
                }

                return qxValue;
            },
        );
        if (shouldLogDebugInfo()) {
            console.groupEnd();
        }

        const ageMaxAllowableValue = this.getMaxAge(ageDerivedField);
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
        const lastValidLifeTableRowIndex = this.getLastValidLifeTableRowIndex(
            refLifeTableWithQxAndNx,
            ageMaxAllowableValue,
        );
        const completeLifeTable = this.getCompleteLifeTable(
            refLifeTableWithQxAndNx,
            abridgedLifeTable[lastValidLifeTableRowIndex].age_start,
            [
                abridgedLifeTable[lastValidLifeTableRowIndex].age_start,
                abridgedLifeTable[lastValidLifeTableRowIndex - 1].age_start,
            ],
        );

        if (shouldLogDebugInfo()) {
            console.table(completeLifeTable);
        }

        // The age of which ex value we will use from the life table to calculate the LE for the population
        const AgeLifeExpectancy = 20;
        const le = this.getLifeExpectancyForAge(
            completeLifeTable,
            AgeLifeExpectancy,
        );

        if (shouldLogDebugInfo()) {
            console.log(`${sex} LE: ${le}`);
            console.groupEnd();
        }

        return le;
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
            : age_end === undefined
            ? FinalRowNx
            : ageDifference + 1;
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

    private getMaxAge(ageContField: DataField) {
        return ageContField.intervals![0].higherMargin!.margin;
    }

    private getLastValidLifeTableRowIndex(
        lifeTable: IAbridgedLifeTableRow[],
        maxAge: number,
    ) {
        return lifeTable.findIndex(lifeTableRow => {
            return lifeTableRow.age_start > maxAge;
        });
    }
}
