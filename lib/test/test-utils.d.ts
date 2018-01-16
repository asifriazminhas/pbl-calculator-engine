import { ModelTypes } from '../engine/model/index';
export declare function getModelsToTest(modelsToExclude: string[]): Promise<Array<{
    model: ModelTypes;
    name: string;
}>>;
export declare function getPmmlString(derivedFields: Array<{
    name: string;
    mapValues: {
        tableName: string;
        outputColumn: string;
        fieldColumnPairs: Array<{
            column: string;
            constant: any;
        }>;
    };
}>, tables: Array<{
    name: string;
    rows: Array<{
        [index: string]: any;
    }>;
}>): string;
