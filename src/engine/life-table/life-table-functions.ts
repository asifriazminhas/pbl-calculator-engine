import { RefLifeTable, getCompleteLifeTableWithStartAge } from './life-table';
import { getLifeExpectancyUsingRefLifeTable } from './life-expectancy';
import { getSurvivalToAge } from './survival-to-age';
import { Data, updateDataWithDatum, findDatumWithName } from '../data';
import { SurvivalModelFunctions } from '../survival-model-builder/survival-model-functions';

export class LifeTableFunctions {
    private survivalFunctions: SurvivalModelFunctions;
    private refLifeTable: RefLifeTable;

    constructor(
        survivalFunctions: SurvivalModelFunctions,
        refLifeTable: RefLifeTable,
    ) {
        this.survivalFunctions = survivalFunctions;
        this.refLifeTable = refLifeTable;
    }

    public getLifeExpectancy(data: Data) {
        return getLifeExpectancyUsingRefLifeTable(
            data,
            this.refLifeTable,
            this.survivalFunctions.getAlgorithmForData(data),
        );
    }

    public getSurvivalToAge(data: Data, age: number) {
        return getSurvivalToAge(
            getCompleteLifeTableWithStartAge(
                this.refLifeTable,
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
            age,
        );
    }
}
