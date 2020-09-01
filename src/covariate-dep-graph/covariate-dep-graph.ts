import { DepGraph } from 'dependency-graph';
import uuid from 'uuid/v1';
import { DataField } from '../engine/data-field/data-field';
import { Covariate } from '../engine/data-field/covariate/covariate';
import { DerivedField } from '../engine/data-field/derived-field/derived-field';

export class CovariateDepGraph extends DepGraph<{ field: DataField }> {
    covariateUuid: string;

    constructor(covariate: Covariate) {
        super();

        this.covariateUuid = uuid();
        this.addNode(this.covariateUuid, {
            field: covariate,
        });
        this.addNodesForCovariate(covariate, this.covariateUuid);
    }

    addNodesForCovariate(covariate: Covariate, nodeUuid: string): void {
        if (covariate.derivedField) {
            this.addNodesForDerivedField(covariate.derivedField, nodeUuid);
        } else if (covariate.customFunction) {
            const newNodeUuid = this.addNewField(
                covariate.customFunction.firstVariableCovariate,
            );
            this.addDependency(nodeUuid, newNodeUuid);

            this.addNodesForCovariate(
                covariate.customFunction.firstVariableCovariate,
                newNodeUuid,
            );
        }
    }

    addNodesForDerivedField(
        derivedField: DerivedField,
        nodeUuid: string,
    ): void {
        derivedField.derivedFrom.forEach(derivedFromField => {
            const newNodeUuid = this.addNewField(derivedFromField);
            this.addDependency(nodeUuid, newNodeUuid);

            if (derivedFromField instanceof DerivedField) {
                this.addNodesForDerivedField(derivedFromField, newNodeUuid);
            } else if (derivedFromField instanceof Covariate) {
                this.addNodesForCovariate(derivedFromField, newNodeUuid);
            }
        });
    }

    private addNewField(field: DataField): string {
        const fieldNodeUuid = uuid();

        this.addNode(fieldNodeUuid, {
            field,
        });

        return fieldNodeUuid;
    }
}
