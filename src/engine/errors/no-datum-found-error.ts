class NoDatumFoundError extends Error {
    constructor(name: string) {
        super();

        this.message = `No Datum object found with name ${name}`;
    }
}
