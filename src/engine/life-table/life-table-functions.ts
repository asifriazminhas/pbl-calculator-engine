import {
    RefLifeTable,
    IGenderSpecificRefLifeTable,
    CompleteLifeTable,
    getCompleteLifeTableForDataUsingAlgorithm,
} from './life-table';
import { getLifeExpectancyForAge } from './life-expectancy';
import { getSurvivalToAge } from './survival-to-age';
import { Data, findDatumWithName } from '../data';
import { NoLifeTableFoundError } from '../errors';
import { Model } from '../model/model';
import { autobind } from 'core-decorators';
import memoizeOne from 'memoize-one';
import { CoxSurvivalAlgorithm } from '../model';

@autobind
export class LifeTableFunctions {
    model: Model<CoxSurvivalAlgorithm>;
    private genderSpecificRefLifeTable: IGenderSpecificRefLifeTable;
    private useExFromAge: number;

    constructor(
        model: Model<CoxSurvivalAlgorithm>,
        genderSpecificRefLifeTable: IGenderSpecificRefLifeTable,
        useExFromAge: number = 99,
    ) {
        this.model = model;
        this.genderSpecificRefLifeTable = genderSpecificRefLifeTable;
        this.useExFromAge = useExFromAge;
    }

    public getLifeExpectancy(data: Data): number {
        const algorithm = this.model.getAlgorithmForData(data);

        if ('bins' in algorithm && algorithm.bins !== undefined) {
            const binData = algorithm.bins!.getBinDataForScore(
                algorithm.calculateScore(data),
            );

            return binData.find(binDatum => {
                return binDatum.survivalPercent === 50;
            })!.time as number;
        } else {
            return getLifeExpectancyForAge(
                Number(findDatumWithName('age', data).coefficent as number),
                this.getCompleteLifeTable(data),
            );
        }
    }

    public getSurvivalToAge(data: Data, toAge: number): number {
        return getSurvivalToAge(this.getCompleteLifeTable(data), toAge);
    }

    private getCompleteLifeTable = memoizeOne(
        (data: Data): CompleteLifeTable => {
            return getCompleteLifeTableForDataUsingAlgorithm(
                this.getRefLifeTable(data),
                data,
                this.model.getAlgorithmForData(data),
                this.useExFromAge,
            );
        },
    );

    private getRefLifeTable(data: Data): RefLifeTable {
        const sex = findDatumWithName('sex', data).coefficent as
            | 'male'
            | 'female';

        const refLifeTable = this.genderSpecificRefLifeTable[sex];

        if (refLifeTable) {
            return refLifeTable;
        } else {
            throw new NoLifeTableFoundError(sex as string);
        }
    }
}
