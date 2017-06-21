import { Constructor, GenericContinuousField } from '../../common';

export function ContinuousMixin<T extends Constructor<{}>>(Base: T) {
    return class extends Base implements GenericContinuousField {
        opType: 'continuous';
        minValue: number;
        maxValue: number;

        constructor(...args: any[]) {
            super(args);

            this.opType = 'continuous';
        }
    }
}