import {
    RefLifeTable,
    getCompleteLifeTableWithStartAge,
    IGenderSpecificRefLifeTable,
} from './life-table';
import { getLifeExpectancyUsingRefLifeTable } from './life-expectancy';
import { getSurvivalToAge } from './survival-to-age';
// @ts-ignore
import { Data, updateDataWithDatum, findDatumWithName, IDatum } from '../data';
import { SurvivalModelFunctions } from '../survival-model-builder/survival-model-functions';
import { NoLifeTableFoundError } from '../errors';

export class LifeTableFunctions {
    private survivalFunctions: SurvivalModelFunctions;
    private genderSpecificRefLifeTable: IGenderSpecificRefLifeTable;

    constructor(
        survivalFunctions: SurvivalModelFunctions,
        genderSpecificRefLifeTable: IGenderSpecificRefLifeTable,
    ) {
        this.survivalFunctions = survivalFunctions;
        this.genderSpecificRefLifeTable = genderSpecificRefLifeTable;
    }

    public getLifeExpectancy = (data: Data) => {
        return getLifeExpectancyUsingRefLifeTable(
            data,
            this.getRefLifeTableForData(data),
            this.survivalFunctions.getAlgorithmForData(data),
        );
    };

    public getSurvivalToAge(data: Data, toAge: number) {
        return getSurvivalToAge(
            getCompleteLifeTableWithStartAge(
                this.getRefLifeTableForData(data),
                ageForRiskToTime => {
                    return this.survivalFunctions.getRiskToTime(
                        updateDataWithDatum(data, {
                            name: 'age',
                            coefficent: ageForRiskToTime,
                        }),
                    );
                },
                findDatumWithName('age', data).coefficent as number,
            ),
            toAge,
        );
    }

    private getRefLifeTableForData(data: Data): RefLifeTable {
        const sexDatum = findDatumWithName('sex', data);

        if (sexDatum.coefficent === 'male') {
            return this.genderSpecificRefLifeTable.male;
        } else if (sexDatum.coefficent === 'female') {
            return this.genderSpecificRefLifeTable.female;
        }

        throw new NoLifeTableFoundError(sexDatum.coefficent as string);
    }
}
