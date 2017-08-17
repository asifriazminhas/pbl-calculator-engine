import { Cox, getSurvival } from '../cox/cox';
import { BaseLifeTableRow, getLifeExpectancy } from '../life-expectancy/life-expectancy';
import { Data } from '../common/datum';

export interface GetLifeExpectancy {
    getLifeExpectancy: (data: Data) => number;
}

export function curryGetLifeExpectancyFunction(
    coxAlgorithm: Cox,
    baseLifeTable: Array<BaseLifeTableRow>,
    useExFromLifeTableFromAge: number = 99
): (data: Data) => number {
    return (data: Data) => {
        const ageInputIndex = data
            .findIndex((datum) => {
                return datum.name === 'age'
            });
        const dataWithoutAgeInput = [
            ...data.slice(0, ageInputIndex),
            ...data.slice(ageInputIndex + 1)
        ];

        return getLifeExpectancy(
            data[ageInputIndex].coefficent as number,
            (age) => {
                return 1 - getSurvival(
                    coxAlgorithm,
                    dataWithoutAgeInput.concat({
                        name: 'age',
                        coefficent: age
                    })
                )
            },
            baseLifeTable,
            useExFromLifeTableFromAge
        )
    }
}