//models
import OpType from '../op_type'
import Datum from '../data/datum';

export interface IPredictor {
    name: string
    opType: number
}

class Predictor implements IPredictor {
    name: string
    opType: OpType

    isInteractionPredictor(): boolean {
        return this.name.split('_')[1].trim().toLowerCase() === 'int';
    }

    isPredictorWithName(name: string): boolean {
        return this.name === name;
    }

    getDatumForPredictor(data: Array<Datum>): Datum | undefined {
        return data
            .find(datum => datum.name === this.name);
    }

    getErrorLabel(): string {
        return 'Predictor';
    }

    static findPredictorWithName<T extends Predictor>(name: string): (predictor: T) => boolean {
        return (predictor: T) => {
            return predictor.name === name;
        }
    }

    static filterDuplicatePredictors<T extends Predictor>(predictor: T, index: number, predictors: Array<T>): boolean {
        index;

        return predictors
            .slice(0, index)
            .find(currentPredictor => predictor
                .isPredictorWithName(currentPredictor.name)) === undefined
    }
}

export default Predictor