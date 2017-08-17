import * as yargs from 'yargs';
var csvParse = require('csv-parse/lib/sync');
import * as fs from 'fs';
import * as path from 'path';

const argv = yargs
    .usage(`Usage: npm run lifetable-csv-to-json -- <path-to-csv-file> <optional-path-to-put-json>`)
    .demandCommand(1)
    .argv;

const lifeTableCsvString = fs.readFileSync(
    path.resolve(argv._[0]),
    'utf8'
);

const lifeTableCsv: Array<{
    age: string;
    ax: string;
    ex: string;
}> = csvParse(lifeTableCsvString, {
    columns: true
});

const lifeTableJson: Array<{
    age: number;
    ax: number;
    ex: number
}> = lifeTableCsv
    .map((lifeTableCsvRow) => {
        return {
            age: Number(lifeTableCsvRow.age),
            ax: Number(lifeTableCsvRow.ax),
            ex: Number(lifeTableCsvRow.ex)
        }
    });

const userGivenOutPath = argv._[1];
const lifeTableJsonOutPath = userGivenOutPath ? (
    path.resolve(userGivenOutPath)
) : (
    path.join(process.cwd(), '/life-table.json')
);

fs.writeFileSync(
    lifeTableJsonOutPath,
    JSON.stringify(lifeTableJson)
);

console.log(`Done. File is available at ${lifeTableJsonOutPath}`);

