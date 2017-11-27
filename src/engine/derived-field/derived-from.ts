import { DerivedField } from './derived-field';
import { Covariate } from '../covariate';
import { DataField } from '../data-field';

export type DerivedFrom = DerivedField | DataField | Covariate;
