// tslint:disable:max-classes-per-file
export class NoBaselineHazardFoundForAge extends Error {
    constructor(age: number) {
        super();

        this.message = `No baseline hazard object found for age ${age}`;
    }
}

export class NoBaselineHazardFoundForAlgorithm extends Error {
    constructor(algorithmName: string) {
        super();

        this.message = `No baseline hazard found for algorithm ${algorithmName}`;
    }
}
