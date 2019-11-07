import { IDerivedFieldJson } from '../../parsers/json/json-derived-field';
import { DerivedField } from '../../engine/data-field/derived-field/derived-field';
import { DataField } from '../../../lib/engine/data-field/data-field';

export function getMockDerivedField(
    overrideFields?: Partial<IDerivedFieldJson>,
    derivedFrom: DataField[] = [],
) {
    const defaultJson: IDerivedFieldJson = {
        name: 'test-derived-field',
        derivedFrom: [],
        equation: 'derived = "Test derived field output"',
        isRequired: false,
        isRecommended: false,
        metadata: {
            label: 'test-label',
            shortLabel: 'test-short-label',
        },
    };

    return new DerivedField(
        Object.assign({}, defaultJson, overrideFields),
        derivedFrom,
    );
}
