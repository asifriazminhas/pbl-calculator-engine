// tslint:disable:max-classes-per-file
export class NoBaselineFoundForAge extends Error {
    constructor(age: number) {
        super();

        this.message = `No baseline hazard object found for age ${age}`;
    }
}

export class NoBaselineFoundForAlgorithm extends Error {
    constructor(algorithmName: string) {
        super();

        this.message = `No baseline hazard found for algorithm ${algorithmName}`;
    }
}
