import * as test from 'tape';
import {
    convertBinsDataCsvToBinsData,
    getBinDataForScore,
    IBinData,
} from '../engine/cox/bins/bins';

// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
import * as fs from 'fs';
import { expect } from 'chai';
import { throwErrorIfUndefined } from '../engine/undefined/undefined';
import { TestAssetsFolderPath } from './constants';
const binsDataCsvString = fs.readFileSync(
    `${TestAssetsFolderPath}/bins/bins-data.csv`,
    'utf8',
);
import {
    IBinsLookupCsvRow,
    convertBinsLookupCsvToBinsLookupJson,
    IBinsLookupJsonItem,
    NegativeInfinityString,
    PositiveInfinityString,
} from '../engine/cox/bins/bins-json';
import {
    getBinsLookupFromBinsLookupJson,
    IBinsDataCsvRow,
    IBins,
} from '../engine/cox/bins/bins';
import { NoBinFoundError } from '../engine/errors/no-bin-found-error';

test(`convertBinsLookupCsvToBinsLookupJson function`, t => {
    t.test(`When the csv file is correct`, t => {
        const binsLookupCsvString = fs.readFileSync(
            `${TestAssetsFolderPath}/bins/valid-bins-lookup.csv`,
            'utf8',
        );
        const binsLookupCsv: IBinsLookupCsvRow[] = csvParse(
            binsLookupCsvString,
            {
                columns: true,
            },
        );

        const binsLookup = convertBinsLookupCsvToBinsLookupJson(
            binsLookupCsvString,
        );

        expect(binsLookupCsv.length).to.equal(binsLookup.length);
        t.pass(
            `It should have the same number of items as the number of rows in the csv file`,
        );

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

            expect(
                isNaN(Number(binsLookupCsvRow.MaxXscore))
                    ? binsLookupCsvRow.MaxXscore
                    : Number(binsLookupCsvRow.MaxXscore),
            ).to.equal(currentRowInBinsLookup.maxScore);
            expect(
                isNaN(Number(binsLookupCsvRow.MinXscore))
                    ? binsLookupCsvRow.MinXscore
                    : Number(binsLookupCsvRow.MinXscore),
            ).to.equal(currentRowInBinsLookup.minScore);
            expect(Number(binsLookupCsvRow.BinNumber)).to.equal(
                currentRowInBinsLookup.binNumber,
            );
        });
        t.pass(`It should corrrectly set the value of each item`);

        t.end();
    });

    t.test(`When the csv file is incorrect`, t => {
        t.test(
            `When a value in the MinXscore column is not a number and is not a valid infinity string`,
            t => {
                const invalidBinsLookupCsvString = fs.readFileSync(
                    `${TestAssetsFolderPath}/bins/invalid-bins-lookup-MinXscore.csv`,
                    'utf8',
                );

                expect(
                    convertBinsLookupCsvToBinsLookupJson.bind(
                        null,
                        invalidBinsLookupCsvString,
                    ),
                ).throw(Error);

                t.pass(`It should throw an Error`);
                t.end();
            },
        );

        t.test(
            `When a value in the MaxXscore column is not a valid number and is not a valid infinity string`,
            t => {
                const invalidBinsLookupCsvString = fs.readFileSync(
                    `${TestAssetsFolderPath}/bins/invalid-bins-lookup-MaxXscore.csv`,
                    'utf8',
                );

                expect(
                    convertBinsLookupCsvToBinsLookupJson.bind(
                        null,
                        invalidBinsLookupCsvString,
                    ),
                ).throw(Error);

                t.pass(`It should throw an Error`);
                t.end();
            },
        );

        t.test(
            `When a value in the BinNumber column is not a valid number`,
            t => {
                const invalidBinsLookupCsvString = fs.readFileSync(
                    `${TestAssetsFolderPath}/bins/invalid-bins-lookup-BinNumber.csv`,
                    'utf8',
                );

                expect(
                    convertBinsLookupCsvToBinsLookupJson.bind(
                        null,
                        invalidBinsLookupCsvString,
                    ),
                ).throw(Error);

                t.pass(`It should throw an Error`);
                t.end();
            },
        );
    });
});

test(`convertBinsDataCsvToBinsData function`, t => {
    const binsDataCsv: IBinsDataCsvRow[] = csvParse(binsDataCsvString, {
        columns: true,
    });

    const binsData = convertBinsDataCsvToBinsData(binsDataCsvString);

    const binsDataBins = Object.keys(binsData).map(Number);

    const numberOfBinsInBinsDataCsv = Object.keys(binsDataCsv[0]).length - 1;

    expect(binsDataBins.length).to.equal(
        numberOfBinsInBinsDataCsv,
        'Incorrect number of bins',
    );
    t.pass(`Number of bins in bins data is the same as the csv`);

    binsDataBins.forEach(binsDataBinNumber => {
        const binDataForCurrentBin = binsData[binsDataBinNumber];

        binsDataCsv.forEach(binsDataCsvRow => {
            const binDataRowForCurrentSurvivalPercent = binDataForCurrentBin.find(
                binDataRow => {
                    return (
                        binDataRow.survivalPercent ===
                        Number(binsDataCsvRow.Percent)
                    );
                },
            );

            // tslint:disable-next-line
            expect(
                binDataRowForCurrentSurvivalPercent,
                `No bin data found for  ${binsDataCsvRow.Percent}`,
            ).to.not.be.undefined;

            if (isNaN(Number(binsDataCsvRow[String(binsDataBinNumber)]))) {
                expect(
                    (binDataRowForCurrentSurvivalPercent as IBinData).time,
                    `time field should be undefined for bin number ${binsDataBinNumber} and survival percent ${binsDataCsvRow.Percent}`,
                ).to.be.undefined;
            } else {
                expect(
                    (binDataRowForCurrentSurvivalPercent as IBinData).time,
                    `Incorrect time field for bin ${binsDataBinNumber} and survival percent ${binsDataCsvRow.Percent}`,
                ).to.equal(Number(binsDataCsvRow[String(binsDataBinNumber)]));
            }
        });
    });
    t.pass(`Bins data object has the same data as csv`);

    t.end();
});

test(`getBinDataForScore function`, t => {
    const bins: IBins = {
        binsLookup: [
            {
                minScore: 0,
                maxScore: 1,
                binNumber: 1,
            },
            {
                minScore: 1,
                maxScore: 2,
                binNumber: 2,
            },
        ],
        binsData: {
            2: [
                {
                    survivalPercent: 100,
                    time: 0,
                },
                {
                    survivalPercent: 99,
                    time: 180,
                },
            ],
        },
    };

    t.test(`When a bin lookup was found`, t => {
        expect(getBinDataForScore(bins, 2)).to.equal(
            // @ts-ignore
            bins.binsData['2'],
        );

        t.pass(`It should return the right bin data`);
        t.end();
    });

    t.test(`When a bin lookup was not found`, t => {
        expect(getBinDataForScore.bind(this, bins, 3)).to.throw(
            NoBinFoundError,
        );

        t.pass(`It should throw a NoBinFoundError`);
        t.end();
    });
});

test(`getBinsLookupJsonToBinsLookup function`, t => {
    const binsLookupJson: IBinsLookupJsonItem[] = [
        {
            minScore: NegativeInfinityString,
            maxScore: 0,
            binNumber: 1,
        },
        {
            minScore: 0,
            maxScore: 2,
            binNumber: 2,
        },
        {
            minScore: 2,
            maxScore: PositiveInfinityString,
            binNumber: 3,
        },
    ];

    expect(getBinsLookupFromBinsLookupJson(binsLookupJson)).to.deep.equal([
        {
            minScore: -Infinity,
            maxScore: 0,
            binNumber: 1,
        },
        {
            minScore: 0,
            maxScore: 2,
            binNumber: 2,
        },
        {
            minScore: 2,
            maxScore: Infinity,
            binNumber: 3,
        },
    ]);

    t.pass(`It should return a BinsLookupJson array`);
    t.end();
});
