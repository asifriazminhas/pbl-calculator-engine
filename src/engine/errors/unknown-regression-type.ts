export class UnknownRegressionType extends Error {
    constructor(regressionType: string | number) {
        super();

        this.message = `Unknown regression type ${regressionType}`;
    }
}
