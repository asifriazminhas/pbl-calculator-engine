import { Algorithm } from '../algorithm';
import { DerivedField } from '../../data-field/derived-field/derived-field';
import { Data } from '../../data/data';
import { IJsonSimpleAlgorithm } from '../../../parsers/json/json-simple-algorithm';
export declare class SimpleAlgorithm extends Algorithm {
    output: DerivedField;
    constructor(simpleAlgorithmJson: IJsonSimpleAlgorithm);
    evaluate(data: Data): number;
}
