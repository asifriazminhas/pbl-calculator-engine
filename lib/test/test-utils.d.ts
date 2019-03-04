import { Model } from '../engine/model/model';
import * as test from 'tape';
import { Data } from '../engine/data';
import { CoxSurvivalAlgorithm } from '../engine/algorithm/regression-algorithm/cox-survival-algorithm/cox-survival-algorithm';
export declare function getModelsToTest(modelsToExclude: string[]): Promise<Array<{
    model: Model;
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
export declare function getRelativeDifference(num1: number, num2: number): number;
export declare function runIntegrationTest(validationFilesFolderName: string, validationFileName: string, testType: string, modelsToExclude: string[], runTestForDataAndAlgorithm: (algorithm: CoxSurvivalAlgorithm, data: Data, index: number) => void, t: test.Test): Promise<void>;
