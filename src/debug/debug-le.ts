import { debugRisk } from './debug-risk';

class DebugLe {
    private sessionStarted: boolean;
    // Set in startSession method
    private leDebugInfo!: {
        completeLifeTable: object[];
        lifeYearsRemaining: number;
    };

    constructor() {
        this.sessionStarted = false;
    }

    startSession(): void {
        this.sessionStarted = true;
        this.leDebugInfo = {
            completeLifeTable: [],
            lifeYearsRemaining: 0,
        };
    }

    endSession(): void {
        debugRisk.endSession();

        this.sessionStarted = false;
    }

    startCollecting(): void {
        if (this.sessionStarted === false) return;

        debugRisk.startSession();
    }

    addEndDebugInfo(completeLifeTable: object[], lifeYearsRemaining: number) {
        if (this.sessionStarted === false) return;

        this.leDebugInfo.completeLifeTable = completeLifeTable;
        this.leDebugInfo.lifeYearsRemaining = lifeYearsRemaining;
    }

    printDebugInfo(): void {
        console.groupCollapsed(`Abridged Individual Life Years Remaining`);

        console.log(
            `Life Years Remaining: ${this.leDebugInfo.lifeYearsRemaining}`,
        );

        console.log(`Complete Life Table`);
        console.table(this.leDebugInfo.completeLifeTable);

        console.groupCollapsed(`Qx Calculations`);
        this.leDebugInfo.completeLifeTable.forEach((_, index) => {
            console.groupCollapsed(`Life Table Row ${index + 1}`);

            debugRisk.printDebugInfo(index);

            console.groupEnd();
        });
        console.groupEnd();

        console.groupEnd();
    }
}

export const debugLe = new DebugLe();
