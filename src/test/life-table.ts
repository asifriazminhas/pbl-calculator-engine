var csvParse = require('csv-parse/lib/sync');
import { getCompleteLifeTableWithStartAge } from '../engine/common/life-table';
import * as path from 'path';
import * as fs from 'fs';
import { expect } from 'chai';

describe(`Life table methods`, function() {
    before(function() {
        this.testLifeTable = csvParse(
            fs.readFileSync(path.join(
                __dirname, '../../assets/test/life_table.csv'
            ), 'utf8'), 
            {
                columns: true
            }
        );
        this.calculatedLifeTable = getCompleteLifeTableWithStartAge(
            this.testLifeTable,
            (age) => {
                const ageRowFromTestLifeTable = this.testLifeTable
                    .find((testLifeTableRow: any) => {
                        return testLifeTableRow.age === age
                    });
                if(!ageRowFromTestLifeTable) {
                    throw new Error();
                }

                return 1 - Number(ageRowFromTestLifeTable.qx);
            },
            this.testLifeTable[0].age
        );
    });

    it(`should properly calculate the life table fields`, function() {
        this.testLifeTable.forEach((testLifeTableRow: any, index: number) => {
            const fields = [
                'ex'
            ];

            fs.writeFileSync(
                path.join(__dirname, '../../assets/calculated-life-table.json'),
                JSON.stringify(this.calculatedLifeTable)
            );
            
            fields.forEach((field) => {
                const diff = this.calculatedLifeTable[index][field] - Number(
                    testLifeTableRow[field]
                );
                const errorPercentage = diff/Number(testLifeTableRow[field]);
                const allowedErrorPercentage = 0.01;

                expect(errorPercentage).to.be
                    .lessThan(allowedErrorPercentage, `Row ${index} and field ${field}`)
            });
        });
    });
});