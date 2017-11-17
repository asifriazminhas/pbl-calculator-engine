export class NoLifeTableFoundError extends Error {
    constructor(sex: string) {
        super();

        this.message = `No life table found for sex ${sex}`;
    }
}
