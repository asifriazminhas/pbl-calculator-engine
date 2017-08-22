"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cox_1 = require("../cox/cox");
const life_expectancy_1 = require("../life-expectancy/life-expectancy");
function curryGetLifeExpectancyFunction(coxAlgorithm, baseLifeTable, useExFromLifeTableFromAge = 99) {
    return (data, time) => {
        const ageInputIndex = data
            .findIndex((datum) => {
            return datum.name === 'age';
        });
        const dataWithoutAgeInput = [
            ...data.slice(0, ageInputIndex),
            ...data.slice(ageInputIndex + 1)
        ];
        return life_expectancy_1.getLifeExpectancy(data[ageInputIndex].coefficent, (age) => {
            return 1 - cox_1.getSurvivalToTime(coxAlgorithm, dataWithoutAgeInput.concat({
                name: 'age',
                coefficent: age
            }), time);
        }, baseLifeTable, useExFromLifeTableFromAge);
    };
}
exports.curryGetLifeExpectancyFunction = curryGetLifeExpectancyFunction;
//# sourceMappingURL=get-life-expectancy.js.map