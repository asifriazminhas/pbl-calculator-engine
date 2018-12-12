import { InvalidValueTreatment } from './invalid-value-treatment';
import { MissingValueTreatment } from './missing-value-treatment';

export interface IMiningField {
    $: {
        name: string;
        invalidValueTreatment: InvalidValueTreatment;
        missingValueTreatment?: MissingValueTreatment;
    };
}
