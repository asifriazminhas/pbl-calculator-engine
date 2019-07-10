import { Algorithm } from '../algorithm';
import { DerivedField } from '../../data-field/derived-field/derived-field';
import { Data } from '../../data/data';
import { IJsonSimpleAlgorithm } from '../../../parsers/json/json-simple-algorithm';
import { parseDerivedFieldJsonToDerivedField } from '../../../parsers/json/json-derived-field';

export class SimpleAlgorithm extends Algorithm {
    output: DerivedField;

    constructor(simpleAlgorithmJson: IJsonSimpleAlgorithm) {
        super(simpleAlgorithmJson);

        const derivedField = simpleAlgorithmJson.derivedFields.find(
            ({ name }) => {
                return name === simpleAlgorithmJson.output;
            },
        );
        if (!derivedField) {
            throw new Error(
                // tslint:disable-next-line:max-line-length
                `Constructing SimpleAlgorithm but no derived field with name ${simpleAlgorithmJson.name} found in JSON's derivedFields array`,
            );
        }
        this.output = parseDerivedFieldJsonToDerivedField(
            derivedField,
            simpleAlgorithmJson.derivedFields,
            [],
        );
    }

    evaluate(data: Data): number {
        return this.output.calculateCoefficent(
            data,
            this.userFunctions,
            this.tables,
        ) as number;
    }
}
