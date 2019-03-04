import { Data, findDatumWithName } from '../../../../data';
import { throwErrorIfUndefined } from '../../../../../util/undefined';
import { NoDatumFoundError } from '../../../../errors';
import { NoCalibrationFactorFoundError } from './calibration-errors';

export class Calibration {
    calibration?: {
        [index: number]: number | undefined;
    };

    constructor(calibration?: { [index: number]: number | undefined }) {
        this.calibration = calibration;
    }

    getCalibrationFactorForData(data: Data): number {
        const DefaultCalibrationFactor = 1;

        if (!this.calibration) {
            return DefaultCalibrationFactor;
        }

        try {
            const ageDatum = findDatumWithName('age', data);

            return throwErrorIfUndefined(
                this.calibration[ageDatum.coefficent as number],
                new NoCalibrationFactorFoundError(
                    ageDatum.coefficent as number,
                ),
            );
        } catch (err) {
            if (err instanceof NoDatumFoundError) {
                return DefaultCalibrationFactor;
            } else if (err instanceof NoCalibrationFactorFoundError) {
                console.warn(err.message);
                return DefaultCalibrationFactor;
            } else {
                throw err;
            }
        }
    }
}
