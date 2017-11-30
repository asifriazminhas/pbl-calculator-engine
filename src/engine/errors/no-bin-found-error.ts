export class NoBinFoundError extends Error {
    constructor(risk: number) {
        super();

        this.message = `No Bin found for risk ${risk}`;
    }
}
