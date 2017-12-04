import { IAlgorithmJson, AlgorithmType } from '../algorithm';
import { IGenericSimpleAlgorithm } from './generic-simple-algorithm';
import {
    DerivedFieldJson,
    parseDerivedFieldJsonToDerivedField,
} from '../derived-field';
import { ISimpleAlgorithm } from './simple-algorithm';
import { parseUserFunctions } from '../algorithm/algorithm-json';
import { throwErrorIfUndefined } from '../undefined';
import { NoDerivedFieldFoundError } from '../errors';

export interface ISimpleAlgorithmJson
    extends IAlgorithmJson<AlgorithmType.SimpleAlgorithm>,
        IGenericSimpleAlgorithm<string, string> {
    derivedFields: DerivedFieldJson[];
}

export function parseSimpleAlgorithmJsonToSimpleAlgorithm(
    simpleAlgorithmJson: ISimpleAlgorithmJson,
): ISimpleAlgorithm {
    const {
        derivedFields,
        ...simpleAlgorithmJsonWithoutDerivedFields,
    } = simpleAlgorithmJson;

    const derivedFieldForOutput = throwErrorIfUndefined(
        derivedFields.find(
            derivedField =>
                derivedField.name ===
                simpleAlgorithmJsonWithoutDerivedFields.output,
        ),
        new NoDerivedFieldFoundError(simpleAlgorithmJson.output),
    );

    return Object.assign({}, simpleAlgorithmJsonWithoutDerivedFields, {
        output: parseDerivedFieldJsonToDerivedField(
            derivedFieldForOutput,
            derivedFields,
            [],
        ),
        userFunctions: parseUserFunctions(simpleAlgorithmJson.userFunctions),
    });
}
