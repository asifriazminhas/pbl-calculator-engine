export class NoTableRowFoundError extends Error {
    constructor(conditonsObject: { [index: string]: string }) {
        super();

        this.message = `No table row found for object ${JSON.stringify(
            conditonsObject,
        )} `;
    }
}
