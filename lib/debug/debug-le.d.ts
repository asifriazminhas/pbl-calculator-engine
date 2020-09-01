declare class DebugLe {
    private sessionStarted;
    private leCalculations;
    constructor();
    startSession(): void;
    endSession(): void;
    startNewCalculation(forIndividual: boolean): void;
    addEndDebugInfoForIndividual(completeLifeTable: object[], numQxCalcs: number, lifeYearsRemaining: number): void;
    addEndDebugInfoPopulation(populationLe: number): void;
    addSexDebugInfoForPopulation(sexDebugInfo: {
        completeLifeTable: object[];
        sex: string;
        le: number;
        qxs: number[];
    }): void;
    printDebugInfo(): void;
    private readonly lastCalculation;
    private printDebugInfoForIndividual;
    private printDebugInfoForPopulation;
    private getRiskDebugInfoStartIndex;
}
export declare const debugLe: DebugLe;
export {};
