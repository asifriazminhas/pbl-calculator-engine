export interface IGenericCox<T, U, V> {
    name: string;
    version: string;
    description: string;
    covariates: T[];
    baselineHazard: number | V;
    userFunctions: {
        [index: string]: U;
    };
}
