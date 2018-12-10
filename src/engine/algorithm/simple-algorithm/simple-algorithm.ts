import { Algorithm, FileReport } from '../algorithm';
import { DerivedField } from '../../data-field/derived-field/derived-field';
import { Data } from '../../data/data';

export class SimpleAlgorithm extends Algorithm {
    // TODO Fix the ! later
    output!: DerivedField;

    public getHeaderReport (headers: string[]): FileReport {
        return {
            valid: headers,
            errors: headers,
            warnings: headers,
            ignored: headers
        };
    }

    evaluate(data: Data): number {
        return this.output.calculateCoefficent(
            data,
            this.userFunctions,
            this.tables,
        ) as number;
    }
}
