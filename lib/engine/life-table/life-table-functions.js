"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const life_table_1 = require("./life-table");
const life_expectancy_1 = require("./life-expectancy");
const survival_to_age_1 = require("./survival-to-age");
// @ts-ignore
const data_1 = require("../data");
const errors_1 = require("../errors");
class LifeTableFunctions {
    constructor(survivalFunctions, genderSpecificRefLifeTable) {
        this.getLifeExpectancy = (data) => {
            return life_expectancy_1.getLifeExpectancyUsingRefLifeTable(data, this.getRefLifeTableForData(data), this.survivalFunctions.getAlgorithmForData(data));
        };
        this.survivalFunctions = survivalFunctions;
        this.genderSpecificRefLifeTable = genderSpecificRefLifeTable;
    }
    getSurvivalToAge(data, toAge) {
        return survival_to_age_1.getSurvivalToAge(life_table_1.getCompleteLifeTableWithStartAge(this.getRefLifeTableForData(data), ageForRiskToTime => {
            return this.survivalFunctions.getRiskToTime(data_1.updateDataWithDatum(data, {
                name: 'age',
                coefficent: ageForRiskToTime,
            }));
        }, data_1.findDatumWithName('age', data).coefficent), toAge);
    }
    getRefLifeTableForData(data) {
        const sexDatum = data_1.findDatumWithName('sex', data);
        if (sexDatum.coefficent === 'male') {
            return this.genderSpecificRefLifeTable.male;
        }
        else if (sexDatum.coefficent === 'female') {
            return this.genderSpecificRefLifeTable.female;
        }
        throw new errors_1.NoLifeTableFoundError(sexDatum.coefficent);
    }
}
exports.LifeTableFunctions = LifeTableFunctions;
//# sourceMappingURL=life-table-functions.js.map