import { Cox, getSurvivalToTime } from '../cox/cox';
import { getLifeExpectancy } from '../life-expectancy/life-expectancy';
import { RefLifeTable } from '../common/life-table';
import { Data } from '../common/datum';
import * as moment from 'moment';

export interface GetLifeExpectancy {
    getLifeExpectancy: (data: Data) => number;
}

export function curryGetLifeExpectancyFunction(
    coxAlgorithm: Cox,
    baseLifeTable: RefLifeTable,
    useExFromLifeTableFromAge: number = 99
): (data: Data, time?: Date | moment.Moment) => number {
    return (data, time) => {
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
                return 1 - getSurvivalToTime(
                    coxAlgorithm,
                    dataWithoutAgeInput.concat({
                        name: 'age',
                        coefficent: age
                    }),
                    time
                )
            },
            baseLifeTable,
            useExFromLifeTableFromAge
        )
    }
}