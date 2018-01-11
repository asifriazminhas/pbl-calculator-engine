"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("tape");
const data_1 = require("../engine/data/data");
const chai_1 = require("chai");
test(`Data functions`, t => {
    const originalData = [
        {
            name: 'age',
            coefficent: 21,
        },
        {
            name: 'sex',
            coefficent: 'male',
        },
    ];
    const dataUpdate = [
        {
            name: 'sex',
            coefficent: 'female',
        },
        {
            name: 'TypeOfSmoker',
            coefficent: 3,
        },
    ];
    const updatedData = data_1.updateDataWithData(originalData, dataUpdate);
    chai_1.expect(updatedData[0]).to.eql(originalData[0]);
    chai_1.expect(updatedData[1]).to.eql(dataUpdate[0]);
    chai_1.expect(updatedData[2]).to.eql(dataUpdate[1]);
    t.pass(`.updateDataWithData`);
    t.end();
});
//# sourceMappingURL=data.spec.js.map