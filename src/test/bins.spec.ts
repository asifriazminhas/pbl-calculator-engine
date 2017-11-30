import * as test from 'tape';
import {
    BinsLookupCsv,
    convertBinsLookupCsvToBinsLookup,
} from '../engine/cox/bins';
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
import * as path from 'path';
import * as fs from 'fs';
import { expect } from 'chai';
import { throwErrorIfUndefined } from '../engine/undefined/undefined';

test(`convertBinsLookupCsvToBinsLookup function`, t => {
    const binsLookupCsvString = fs.readFileSync(
        path.join(__dirname, '../../assets/test/bins/bins-lookup.csv'),
        'utf8',
    );

    const binsLookupCsv: BinsLookupCsv = csvParse(binsLookupCsvString, {
        columns: true,
    });

    const binsLookup = convertBinsLookupCsvToBinsLookup(binsLookupCsvString);

    expect(binsLookupCsv.length).to.equal(binsLookup.length);
    t.pass(`Bins lookup has same number of items as bins lookup csv`);

    binsLookupCsv.forEach(binsLookupCsvRow => {
        const currentRowInBinsLookup = throwErrorIfUndefined(
            binsLookup.find(binLookupItem => {
                return (
                    binLookupItem.binNumber ===
                    Number(binsLookupCsvRow.BinNumber)
                );
            }),
            new Error(
                `No bin found in bins lookup for number ${binsLookupCsvRow.BinNumber}`,
            ),
        );

        expect(Number(binsLookupCsvRow.MaxRisk)).to.equal(
            currentRowInBinsLookup.maxRisk,
        );
        expect(Number(binsLookupCsvRow.MinRisk)).to.equal(
            currentRowInBinsLookup.minRisk,
        );
        expect(Number(binsLookupCsvRow.BinNumber)).to.equal(
            currentRowInBinsLookup.binNumber,
        );
    });
    t.pass(`Bins lookup items has same data as bins lookup csv`);

    t.end();
});
