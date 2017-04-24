import * as moment from 'moment';
import ExplanatoryPredictor from '../predictors/explanatory_predictor';

class Datum {
    name: string
    coefficent: string | number | moment.Moment

    constructorForNewDatum(name: string, coefficent: string | number | moment.Moment): Datum {
        this.name = name
        this.coefficent = coefficent

        return this
    }

    /**
     * Constructor where the name is set to predictor.name and value is set to the reference point
     * 
     * @static
     * @param {ExplanatoryPredictor} predictor 
     * @returns {Datum} 
     * 
     * @memberOf Datum
     */
    static constructFromPredictorReferencePoint(predictor: ExplanatoryPredictor): Datum {
        return new Datum().constructorForNewDatum(predictor.name, predictor.referencePoint);
    }
}

export default Datum