export class NoCauseEffectRefFound extends Error {
    constructor(sex: string) {
        super();

        this.message = `No CauseEffectRef found for sex ${sex}`;
    }
}
