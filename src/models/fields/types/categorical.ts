import { Constructor } from '../../common';

export interface Category {
    value: string;
    displayValue: string;
}

export interface Categorical {
    categories: Array<Category>
}

//TODO Remove this once it's fixed in typescript
export interface CategoricalClass {
    new (...args: any[]): Categorical;
}

export function CategoricalMixin<T extends Constructor<{}>>(Base: T): CategoricalClass & T {
    return class extends Base implements Categorical {
        categories: Array<Category>;

        constructor(...args: any[]) {
            super(...args);
        }
    }
}