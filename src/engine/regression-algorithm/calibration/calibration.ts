import {
    CalibrationJson,
    ICalibrationFactorJsonObject,
} from './calibration-json';
import { Data, findDatumWithName } from '../../data';
import { NoDatumFoundError } from '../../errors';
import { throwErrorIfUndefined } from '../../undefined';
import {
    NoCalibrationFactorFoundError,
    NoCalibrationFoundError,
} from './calibration-errors';
import { NoPredicateObjectFoundError } from '../../multiple-algorithm-model/predicate/predicate-errors';
import { getFirstTruePredicateObject } from '../../multiple-algorithm-model/predicate/predicate';

export interface ICalibration {
    [index: number]: number | undefined;
}

export interface ICalibratedMixin {
    calibration?: ICalibration;
}

function reduceCalibrationFactorObjectsToCalibration(
    calibrationFactorObjects: ICalibrationFactorJsonObject[],
): ICalibration {
    return calibrationFactorObjects.reduce(
        (calibrationFactors, currentCalibrationFactorObject) => {
            calibrationFactors[currentCalibrationFactorObject.age] =
                currentCalibrationFactorObject.factor;

            return calibrationFactors;
        },
        {} as { [index: number]: number },
    );
}

export function addCalibrationToAlgorithm<T extends ICalibratedMixin>(
    algorithm: T,
    calibrationJson: CalibrationJson,
    predicateData: Data,
): T {
    try {
        const calibrationFactorObjects = getFirstTruePredicateObject(
            calibrationJson,
            predicateData,
        ).calibrationFactorObjects;

        const calibration = reduceCalibrationFactorObjectsToCalibration(
            calibrationFactorObjects,
        );

        return Object.assign({}, algorithm, {
            calibration,
        });
    } catch (err) {
        if (err instanceof NoPredicateObjectFoundError) {
            console.warn(new NoCalibrationFoundError(predicateData).message);
            return algorithm;
        } else {
            throw Error;
        }
    }
}

export function getCalibrationFactorForData(
    { calibration }: ICalibratedMixin,
    data: Data,
): number {
    const DefaultCalibrationFactor = 1;

    if (!calibration) {
        return DefaultCalibrationFactor;
    }

    try {
        const ageDatum = findDatumWithName('age', data);

        return throwErrorIfUndefined(
            calibration[ageDatum.coefficent as number],
            new NoCalibrationFactorFoundError(ageDatum.coefficent as number),
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
