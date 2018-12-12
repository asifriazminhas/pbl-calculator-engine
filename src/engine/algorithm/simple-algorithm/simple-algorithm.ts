import { Algorithm, DataNameReport } from '../algorithm';
import { DerivedField } from '../../data-field/derived-field/derived-field';
import { Data } from '../../data/data';

export class SimpleAlgorithm extends Algorithm {
    // TODO Fix the ! later
    output!: DerivedField;

    public buildDataNameReport (headers: string[]): DataNameReport {
        throw new Error(this.buildDataNameReport.name + ' is not implemented');
    }

    evaluate(data: Data): number {
        return this.output.calculateCoefficent(
            data,
            this.userFunctions,
            this.tables,
        ) as number;
    }
}
