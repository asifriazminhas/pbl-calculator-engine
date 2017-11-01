export interface IGenericCox<T, U> {
    name: string;
    version: string;
    description: string;
    covariates: T[];
    baselineHazard: number;
    userFunctions: {
        [index: string]: U;
    };
}
