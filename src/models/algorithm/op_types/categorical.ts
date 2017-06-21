import { Constructor, GenericCategoricalField, GenericCategory } from '../../common';

export function CategoricalMixin<T extends Constructor<{}>>(Base: T) {
    return class extends Base implements GenericCategoricalField {
        opType: 'categorical';
        categories: Array<GenericCategory>;

        constructor(...args: any[]) {
            super(...args);

            this.opType = 'categorical';
        }
    }
}