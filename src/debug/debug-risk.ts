import { CovariateDepGraph } from '../covariate-dep-graph';
import { Covariate } from '../engine/data-field/covariate/covariate';
import { DerivedField } from '../engine/data-field/derived-field/derived-field';
import { Data, findDatumWithName } from '../engine/data';
import { NoDatumFoundError } from '../engine/errors';
import { DataField } from '../engine/data-field/data-field';

class DebugRisk {
    private debugInfo: IRiskDebugInfo[];
    private sessionStarted: boolean;

    constructor() {
        this.sessionStarted = false;
        this.debugInfo = [];
    }

    startSession(): void {
        this.debugInfo = [];
        this.sessionStarted = true;
    }

    endSession(): void {
        this.sessionStarted = false;
    }

    startNewCalculation(): void {
        if (this.shouldRunDebugMethod() === false) return;

        this.debugInfo.push({
            calculatedValues: {},
            covariates: [],
            riskData: [],
            score: NaN,
            risk: NaN,
        });
    }

    addFieldDebugInfo(fieldName: string, coefficient: any): void {
        if (this.shouldRunDebugMethod() === false) return;

        this.currentCalculation.calculatedValues[fieldName] = {
            coefficient,
        };
    }

    addCovariateDebugInfo(
        covariateName: string,
        coefficient: number,
        component: number,
    ): void {
        if (this.shouldRunDebugMethod() === false) return;

        this.currentCalculation.calculatedValues[covariateName] = {
            coefficient,
            component,
        };
    }

    addEndDebugInfo(
        covariates: Covariate[],
        riskData: Data,
        score: number,
        risk: number,
    ): void {
        if (this.shouldRunDebugMethod() === false) return;

        this.currentCalculation.covariates = covariates;
        this.currentCalculation.riskData = riskData;
        this.currentCalculation.score = score;
        this.currentCalculation.risk = risk;
    }

    printDebugInfo(printIndex?: number) {
        const debugInfoToPrint =
            printIndex === undefined
                ? this.debugInfo
                : this.debugInfo.filter((_, index) => {
                      return index === printIndex;
                  });

        debugInfoToPrint.forEach((currentDebugInfo, index) => {
            const { covariates, riskData, risk, score } = currentDebugInfo;

            const covariateDepTrees = covariates.map(covariate => {
                return new CovariateDepGraph(covariate);
            });

            if (printIndex === undefined) {
                console.groupCollapsed(`Risk Calculation ${index + 1}`);
            }

            console.log(`5 Year Risk: ${risk}`);
            console.log(`Score: ${score}`);

            covariateDepTrees.forEach(covariateDepTree => {
                this.printFieldDebugInfo(
                    currentDebugInfo,
                    covariateDepTree,
                    covariateDepTree.covariateUuid,
                    riskData,
                );
            });

            if (printIndex === undefined) {
                console.groupEnd();
            }
        });
    }

    private printFieldDebugInfo(
        riskDebugInfo: IRiskDebugInfo,
        depGraph: CovariateDepGraph,
        fieldNodeUuid: string,
        riskData: Data,
    ) {
        const node = depGraph.getNodeData(fieldNodeUuid);
        const field = node.field;

        console.groupCollapsed(field.name);

        if (field instanceof Covariate) {
            this.printCovariateDebugInfo(riskDebugInfo, field, riskData);
        } else if (field instanceof DerivedField) {
            this.printDerivedFieldDebugInfo(riskDebugInfo, field, riskData);
        } else {
            // Otherwise this is a DataField and is a leaf field i.e on without
            // any dependencies and should come from the raw data
            const leafFieldCoefficient = this.getCoefficientForField(
                riskDebugInfo,
                field,
                riskData,
            );

            console.log(`Coefficient: ${leafFieldCoefficient}`);
        }

        // @ts-ignore
        // outgoingEdges is private and so we need to add the ts-ignore
        // We use outgoingEdges instead of the dependenciesOf method since it
        // returns all descendants and not just the children of the node
        (depGraph.outgoingEdges[fieldNodeUuid] as string[]).forEach(
            childFieldNodeUuid => {
                this.printFieldDebugInfo(
                    riskDebugInfo,
                    depGraph,
                    childFieldNodeUuid,
                    riskData,
                );
            },
        );

        console.groupEnd();
    }

    private printCovariateDebugInfo(
        riskDebugInfo: IRiskDebugInfo,
        covariate: Covariate,
        riskData: Data,
    ): void {
        const valueForField = riskDebugInfo.calculatedValues[
            covariate.name
        ] as ICovariateFieldDebugInfo;

        console.log(`Component: ${valueForField.component}`);

        if (covariate.derivedField) {
            this.printDerivedFieldDebugInfo(
                riskDebugInfo,
                covariate.derivedField,
                riskData,
            );
        } else {
            console.log(`Coefficient: ${valueForField.coefficient}`);
        }
    }

    private printDerivedFieldDebugInfo(
        riskDebugInfo: IRiskDebugInfo,
        derivedField: DerivedField,
        riskData: Data,
    ): void {
        const valueForField = riskDebugInfo.calculatedValues[
            derivedField.name
        ] as IDerivedFieldDebugInfo;

        if (valueForField === undefined) {
            console.warn(`Coefficient could not be calculated`);
        } else {
            console.log(`Coefficient: ${valueForField.coefficient}`);
        }

        console.log(`Equation: ${derivedField.equation}`);

        const derivedFromData = derivedField.derivedFrom.map(
            derivedFromField => {
                return {
                    Name: derivedFromField.name,
                    Coefficient: this.getCoefficientForField(
                        riskDebugInfo,
                        derivedFromField,
                        riskData,
                    ),
                };
            },
        );
        console.log(`Equation Data:`);
        console.table(derivedFromData);
    }

    private getCoefficientForField(
        riskDebugInfo: IRiskDebugInfo,
        field: DataField,
        riskData: Data,
    ) {
        const valueForField = riskDebugInfo.calculatedValues[field.name];

        if (valueForField === undefined) {
            try {
                return findDatumWithName(field.name, riskData).coefficent;
            } catch (err) {
                if (err instanceof NoDatumFoundError) {
                    console.log(`No coefficient found`);
                } else {
                    throw err;
                }
            }
        } else {
            return valueForField.coefficient;
        }
    }

    private shouldRunDebugMethod(): boolean {
        return this.sessionStarted;
    }

    private get currentCalculation(): IRiskDebugInfo {
        return this.debugInfo[this.debugInfo.length - 1];
    }
}

export const debugRisk = new DebugRisk();

export interface IRiskDebugInfo {
    calculatedValues: {
        [fieldName: string]: FieldDebugInfo;
    };
    covariates: Covariate[];
    riskData: Data;
    score: number;
    risk: number;
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
}

type FieldDebugInfo =
    | IDataFieldDebugInfo
    | IDerivedFieldDebugInfo
    | ICovariateFieldDebugInfo;
