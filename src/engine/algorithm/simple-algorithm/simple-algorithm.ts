import { Algorithm } from '../algorithm';
import { DerivedField } from '../../data-field/derived-field/derived-field';
import { Data } from '../../data/data';

export class SimpleAlgorithm extends Algorithm {
    output: DerivedField;

    evaluate(data: Data): number {
        return this.output.calculateCoefficent(
            data,
            this.userFunctions,
            this.tables,
        ) as number;
    }
}
