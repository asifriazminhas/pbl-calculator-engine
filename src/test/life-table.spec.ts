// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
import {
    getCompleteLifeTableWithStartAge,
    ICompleteLifeTableRow,
} from '../engine/life-table/life-table';
import * as path from 'path';
import * as fs from 'fs';
import { expect } from 'chai';
import test from 'tape';

test(`LifeTable.getCompleteLifeTableWithStartAge`, t => {
    const testLifeTable = csvParse(
        fs.readFileSync(
            path.join(__dirname, '../../assets/test/life-table/life_table.csv'),
            'utf8',
        ),
        {
            columns: true,
        },
    );

    const calculatedLifeTable = getCompleteLifeTableWithStartAge(
        testLifeTable,
        age => {
            const ageRowFromTestLifeTable = testLifeTable.find(
                (testLifeTableRow: any) => {
                    return testLifeTableRow.age === age;
                },
            );
            if (!ageRowFromTestLifeTable) {
                throw new Error();
            }

            return 1 - Number(ageRowFromTestLifeTable.qx);
        },
        testLifeTable[0].age,
    );

    testLifeTable.forEach((testLifeTableRow: any, index: number) => {
        const fields: [keyof ICompleteLifeTableRow] = ['ex'];

        /*fs.writeFileSync(
            path.join(__dirname, '../../assets/calculated-life-table.json'),
            JSON.stringify(this.calculatedLifeTable)
        );*/

        fields.forEach(field => {
            const diff =
                calculatedLifeTable[index][field] -
                Number(testLifeTableRow[field]);
            const errorPercentage = diff / Number(testLifeTableRow[field]);
            const allowedErrorPercentage = 0.01;

            expect(errorPercentage).to.be.lessThan(
                allowedErrorPercentage,
                `Row ${index} and field ${field}`,
            );
        });
    });

    t.pass(`should properly calculate the life table fields`);
    t.end();
});
