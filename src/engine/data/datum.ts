// import {} from '../cox/covariate';
import { Coefficent } from './coefficent';
import { Covariate } from '../data-field/covariate/covariate';
import { DataField } from '../data-field/data-field';
export interface IDatum {
    name: string;
    coefficent: Coefficent;
}

export function datumFromCovariateReferencePointFactory(
    covariate: Covariate,
): IDatum {
    return {
        coefficent: covariate.referencePoint,
        name: covariate.name,
    };
}

export function datumFactoryFromDataField(
    dataField: DataField,
    coefficient: Coefficent,
): IDatum {
    return {
        name: dataField.name,
        coefficent:
            dataField.interval && typeof coefficient === 'number'
                ? dataField.interval.limitNumber(coefficient)
                : coefficient,
    };
}
