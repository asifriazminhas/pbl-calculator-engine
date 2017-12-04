import { IAlgorithmJson, AlgorithmType } from '../algorithm';
import { IGenericSimpleAlgorithm } from './generic-simple-algorithm';
import {
    DerivedFieldJson,
    parseDerivedFieldJsonToDerivedField,
} from '../derived-field';
import { ISimpleAlgorithm } from './simple-algorithm';
import { parseUserFunctions } from '../algorithm/algorithm-json';

export interface ISimpleAlgorithmJson
    extends IAlgorithmJson<AlgorithmType.SimpleAlgorithm>,
        IGenericSimpleAlgorithm<string, DerivedFieldJson> {}

export function parseSimpleAlgorithmJsonToSimpleAlgorithm(
    simpleAlgorithmJson: ISimpleAlgorithmJson,
): ISimpleAlgorithm {
    return Object.assign({}, simpleAlgorithmJson, {
        derivedFields: simpleAlgorithmJson.derivedFields.map(derivedField => {
            return parseDerivedFieldJsonToDerivedField(
                derivedField,
                simpleAlgorithmJson.derivedFields,
                [],
            );
        }),
        userFunctions: parseUserFunctions(simpleAlgorithmJson.userFunctions),
    });
}
