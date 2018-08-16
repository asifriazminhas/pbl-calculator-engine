import { Jsonify } from '../../util/types';
import { Interval } from '../../engine/data-field/covariate/interval';
import { JsonMargin } from './json-margin';
import { Omit } from 'utility-types';

export interface JsonInterval
    extends Omit<Jsonify<Interval>, 'lowerMargin' | 'higherMargin'> {
    lowerMargin?: JsonMargin;
    higherMargin?: JsonMargin;
}
