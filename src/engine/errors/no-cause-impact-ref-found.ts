export class NoCauseImpactRefFound extends Error {
    constructor(sex: string) {
        super();

        this.message = `No CauseImpactRef found for sex ${sex}`;
    }
}
