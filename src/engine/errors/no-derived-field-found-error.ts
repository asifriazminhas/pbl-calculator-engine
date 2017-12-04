export class NoDerivedFieldFoundError extends Error {
    constructor(derivedFieldName: string) {
        super();

        this.message = `No derived field found with name ${derivedFieldName}`;
    }
}
