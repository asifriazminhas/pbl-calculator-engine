import * as moment from 'moment';

export type Coefficent =
    | string
    | number
    | moment.Moment
    | Date
    | null
    | undefined;
