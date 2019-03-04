import { JsonSerializable } from '../../util/types';
import { Interval } from '../../engine/data-field/covariate/interval';
import { JsonMargin } from './json-margin';
import { Omit } from 'utility-types';
export interface JsonInterval extends Omit<JsonSerializable<Interval>, 'lowerMargin' | 'higherMargin'> {
    lowerMargin?: JsonMargin;
    higherMargin?: JsonMargin;
}
