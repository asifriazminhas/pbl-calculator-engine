import * as test from 'tape';
import { updateDataWithData } from '../engine/data/data';
import { expect } from 'chai';

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

    const updatedData = updateDataWithData(originalData, dataUpdate);

    expect(updatedData[0]).to.eql(originalData[0]);
    expect(updatedData[1]).to.eql(dataUpdate[0]);
    expect(updatedData[2]).to.eql(dataUpdate[1]);

    t.pass(`.updateDataWithData`);

    t.end();
});
