import { Covariate } from '../engine/data-field/covariate/covariate';
import { Data } from '../engine/data';
declare class DebugRisk {
    private debugInfo;
    private sessionStarted;
    private calculationStarted;
    constructor();
    startSession(): void;
    endSession(): void;
    startNewCalculation(): void;
    addFieldDebugInfo(fieldName: string, coefficient: any): void;
    addCovariateDebugInfo(covariateName: string, debugInfo: Partial<ICovariateFieldDebugInfo>): void;
    addEndDebugInfo(covariates: Covariate[], riskData: Data, score: number, risk: number, baselineHazard: number): void;
    printDebugInfo(printIndex?: number): void;
    getCovariateDebugInfo(calcIndex: number, covariateName: string): ICovariateFieldDebugInfo;
    private printFieldDebugInfo;
    private printCovariateDebugInfo;
    private printDerivedFieldDebugInfo;
    private getCoefficientForField;
    private shouldRunDebugMethod;
    private readonly currentCalculation;
}
export declare const debugRisk: DebugRisk;
export interface IRiskDebugInfo {
    calculatedValues: {
        [fieldName: string]: FieldDebugInfo;
    };
    covariates: Covariate[];
    riskData: Data;
    score: number;
    risk: number;
    baselineHazard: number;
}
interface IDataFieldDebugInfo {
    coefficient: any;
}
interface IDerivedFieldDebugInfo {
    coefficient: any;
}
interface ICovariateFieldDebugInfo {
    coefficient: any;
    component: number;
    beta: number;
    setToReference: boolean;
}
declare type FieldDebugInfo = IDataFieldDebugInfo | IDerivedFieldDebugInfo | ICovariateFieldDebugInfo;
export {};
