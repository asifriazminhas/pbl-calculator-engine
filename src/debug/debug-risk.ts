import { CovariateDepGraph } from '../covariate-dep-graph';
import { Covariate } from '../engine/data-field/covariate/covariate';
import { DerivedField } from '../engine/data-field/derived-field/derived-field';
import { Data, findDatumWithName } from '../engine/data';
import { NoDatumFoundError } from '../engine/errors';
import { DataField } from '../engine/data-field/data-field';

class DebugRisk {
    // Set in the startSession method
    private calculatedValues!: {
        [fieldName: string]: FieldDebugInfo;
    };

    startSession(): void {
        this.calculatedValues = {};
    }

    addFieldDebugInfo(fieldName: string, coefficient: any): void {
        this.calculatedValues[fieldName] = {
            coefficient,
        };
    }

    addCovariateDebugInfo(
        covariateName: string,
        coefficient: number,
        component: number,
    ): void {
        this.calculatedValues[covariateName] = {
            coefficient,
            component,
        };
    }

    endSession(
        covariates: Covariate[],
        riskData: Data,
        risk: number,
        score: number,
    ): void {
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
        const debugInfo = this.calculatedValues[
            covariate.name
        ] as ICovariateFieldDebugInfo;

        console.log(`Component: ${debugInfo.component}`);

        if (covariate.derivedField) {
            this.printDerivedFieldDebugInfo(covariate.derivedField, riskData);
        } else {
            console.log(`Coefficient: ${debugInfo.coefficient}`);
        }
    }

    private printDerivedFieldDebugInfo(
        derivedField: DerivedField,
        riskData: Data,
    ): void {
        const debugInfo = this.calculatedValues[
            derivedField.name
        ] as IDerivedFieldDebugInfo;

        if (debugInfo === undefined) {
            console.warn(`Coefficient could not be calculated`);
        } else {
            console.log(`Coefficient: ${debugInfo.coefficient}`);
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
        const debugInfo = this.calculatedValues[field.name];

        if (debugInfo === undefined) {
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
            return debugInfo.coefficient;
        }
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
