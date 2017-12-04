export class UnknownAlgorithmTypeError extends Error {
    constructor(algorithmType: number) {
        super();

        this.message = `Unknown algorithm tyoe ${algorithmType}`;
    }
}
