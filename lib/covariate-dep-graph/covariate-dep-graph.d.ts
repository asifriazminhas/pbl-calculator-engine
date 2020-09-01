import { DepGraph } from 'dependency-graph';
import { DataField } from '../engine/data-field/data-field';
import { Covariate } from '../engine/data-field/covariate/covariate';
import { DerivedField } from '../engine/data-field/derived-field/derived-field';
export declare class CovariateDepGraph extends DepGraph<{
    field: DataField;
}> {
    covariateUuid: string;
    constructor(covariate: Covariate);
    addNodesForCovariate(covariate: Covariate, nodeUuid: string): void;
    addNodesForDerivedField(derivedField: DerivedField, nodeUuid: string): void;
    private addNewField;
}
