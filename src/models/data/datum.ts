import * as moment from 'moment';

class Datum {
    name: string
    coefficent: string | number | moment.Moment

    constructorForNewDatum(name: string, coefficent: string | number | moment.Moment): Datum {
        this.name = name
        this.coefficent = coefficent

        return this
    }
}

export default Datum