import { CovariateDepGraph } from '../covariate-dep-graph';
import { Covariate } from '../engine/data-field/covariate/covariate';
import { DerivedField } from '../engine/data-field/derived-field/derived-field';
import { Data, findDatumWithName } from '../engine/data';
import { NoDatumFoundError } from '../engine/errors';
import { DataField } from '../engine/data-field/data-field';

class DebugRisk {
    // Set in the startSession method
    private debugInfo!: {
        calculatedValues: {
            [fieldName: string]: FieldDebugInfo;
        };
        covariates: Covariate[];
        riskData: Data;
        score: number;
        risk: number;
    };
    private sessionStarted: boolean;

    constructor() {
        this.sessionStarted = false;
    }

    startSession(): void {
        this.debugInfo = {
            calculatedValues: {},
            covariates: [],
            riskData: [],
            score: NaN,
            risk: NaN,
        };
        this.sessionStarted = true;
    }

    addFieldDebugInfo(fieldName: string, coefficient: any): void {
        if (this.shouldRunDebugMethod() === false) return;

        this.debugInfo.calculatedValues[fieldName] = {
            coefficient,
        };
    }

    addCovariateDebugInfo(
        covariateName: string,
        coefficient: number,
        component: number,
    ): void {
        if (this.shouldRunDebugMethod() === false) return;

        this.debugInfo.calculatedValues[covariateName] = {
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

        this.debugInfo.covariates = covariates;
        this.debugInfo.riskData = riskData;
        this.debugInfo.score = score;
        this.debugInfo.risk = risk;
    }

    endSession(): void {
        this.sessionStarted = false;
    }

    printDebugInfo() {
        const { covariates, riskData, risk, score } = this.debugInfo;

        const covariateDepTrees = covariates.map(covariate => {
            return new CovariateDepGraph(covariate);
        });

        console.log(`5 Year Risk: ${risk}`);
        console.log(`Score: ${score}`);

        covariateDepTrees.forEach(covariateDepTree => {
            this.printFieldDebugInfo(
                covariateDepTree,
                covariateDepTree.covariateUuid,
                riskData,
            );
        });
    }

    private printFieldDebugInfo(
        depGraph: CovariateDepGraph,
        fieldNodeUuid: string,
        riskData: Data,
    ) {
        const node = depGraph.getNodeData(fieldNodeUuid);
        const field = node.field;

        console.groupCollapsed(field.name);

        if (field instanceof Covariate) {
            this.printCovariateDebugInfo(field, riskData);
        } else if (field instanceof DerivedField) {
            this.printDerivedFieldDebugInfo(field, riskData);
        } else {
            // Otherwise this is a DataField and is a leaf field i.e on without
            // any dependencies and should come from the raw data
            const leafFieldCoefficient = this.getCoefficientForField(
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
                    depGraph,
                    childFieldNodeUuid,
                    riskData,
                );
            },
        );

        console.groupEnd();
    }

    private printCovariateDebugInfo(
        covariate: Covariate,
        riskData: Data,
    ): void {
        const valueForField = this.debugInfo.calculatedValues[
            covariate.name
        ] as ICovariateFieldDebugInfo;

        console.log(`Component: ${valueForField.component}`);

        if (covariate.derivedField) {
            this.printDerivedFieldDebugInfo(covariate.derivedField, riskData);
        } else {
            console.log(`Coefficient: ${valueForField.coefficient}`);
        }
    }

    private printDerivedFieldDebugInfo(
        derivedField: DerivedField,
        riskData: Data,
    ): void {
        const valueForField = this.debugInfo.calculatedValues[
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
                        derivedFromField,
                        riskData,
                    ),
                };
            },
        );
        console.log(`Equation Data:`);
        console.table(derivedFromData);
    }

    private getCoefficientForField(field: DataField, riskData: Data) {
        const valueForField = this.debugInfo.calculatedValues[field.name];

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
}

export const debugRisk = new DebugRisk();

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
