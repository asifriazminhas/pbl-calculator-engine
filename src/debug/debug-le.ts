import { debugRisk } from './debug-risk';

class DebugLe {
    private sessionStarted: boolean;
    // Set in startSession method
    private leCalculations: LEDebugInfo[];

    constructor() {
        this.sessionStarted = false;
        this.leCalculations = [];
    }

    startSession(): void {
        this.sessionStarted = true;
        this.leCalculations = [];
    }

    endSession(): void {
        debugRisk.endSession();

        this.sessionStarted = false;
    }

    startNewCalculation(forIndividual: boolean): void {
        if (this.sessionStarted === false) return;

        if (forIndividual === true) {
            this.leCalculations.push({
                completeLifeTable: [],
                lifeYearsRemaining: NaN,
            });
        } else {
            this.leCalculations.push({
                sexInfo: [],
                populationLE: NaN,
            });
        }

        debugRisk.startSession();
    }

    addEndDebugInfoForIndividual(
        completeLifeTable: object[],
        lifeYearsRemaining: number,
    ) {
        if (this.sessionStarted === false) return;

        (this
            .lastCalculation as IIndividualLE).completeLifeTable = completeLifeTable;
        (this
            .lastCalculation as IIndividualLE).lifeYearsRemaining = lifeYearsRemaining;
    }

    addEndDebugInfoPopulation(populationLe: number) {
        if (this.sessionStarted === false) return;

        (this.lastCalculation as IPopulationLE).populationLE = populationLe;
    }

    addSexDebugInfoForPopulation(sexDebugInfo: {
        completeLifeTable: object[];
        sex: string;
        le: number;
        qxs: number[];
    }) {
        (this.lastCalculation as IPopulationLE).sexInfo.push(sexDebugInfo);
    }

    printDebugInfo(): void {
        this.leCalculations.forEach((leCalculation, index) => {
            console.groupCollapsed(`LE Calculation ${index + 1}`);

            if ('lifeYearsRemaining' in leCalculation) {
                this.printDebugInfoForIndividual(leCalculation);
            } else {
                this.printDebugInfoForPopulation(leCalculation);
            }
        });
    }

    private get lastCalculation(): LEDebugInfo {
        return this.leCalculations[this.leCalculations.length - 1];
    }

    private printDebugInfoForIndividual(debugInfo: IIndividualLE) {
        console.log(`Abridged Individual Life Years Remaining`);

        console.log(`Life Years Remaining: ${debugInfo.lifeYearsRemaining}`);

        console.log(`Complete Life Table`);
        console.table(debugInfo.completeLifeTable);

        console.groupCollapsed(`Qx Calculations`);
        debugInfo.completeLifeTable.forEach((_, index) => {
            console.groupCollapsed(`Life Table Row ${index + 1}`);

            debugRisk.printDebugInfo(index);

            console.groupEnd();
        });
        console.groupEnd();

        console.groupEnd();

        console.groupEnd();
    }

    private printDebugInfoForPopulation(debugInfo: IPopulationLE) {
        console.log(`Abridged life expectancy for population`);

        console.log(`Population life expectancy: ${debugInfo.populationLE}`);

        debugInfo.sexInfo.forEach(
            ({ sex, qxs, completeLifeTable, le }, sexIndex) => {
                console.groupCollapsed(`Life table for sex: ${sex}`);

                console.log(`Life expectancy for sex ${sex}: ${le}`);
                const numOfPreviousQxCals = debugInfo.sexInfo
                    .slice(0, sexIndex)
                    .reduce((numOfCals, { qxs }) => {
                        return numOfCals + qxs.length;
                    }, 0);

                console.log(`Complete life table`);
                console.table(completeLifeTable);

                console.groupCollapsed(`Individual qx calculations`);
                qxs.forEach((qx, qxIndex) => {
                    console.groupCollapsed(`Qx for sex ${sex} ${qxIndex + 1}`);
                    console.log(`Qx: ${qx}`);
                    debugRisk.printDebugInfo(numOfPreviousQxCals + qxIndex);
                    console.groupEnd();
                });
                console.groupEnd();

                console.groupEnd();
            },
        );
    }
}

export const debugLe = new DebugLe();

interface IIndividualLE {
    completeLifeTable: object[];
    lifeYearsRemaining: number;
}

interface IPopulationLE {
    sexInfo: Array<{
        completeLifeTable: object[];
        sex: string;
        le: number;
        qxs: number[];
    }>;
    populationLE: number;
}

type LEDebugInfo = IIndividualLE | IPopulationLE;
