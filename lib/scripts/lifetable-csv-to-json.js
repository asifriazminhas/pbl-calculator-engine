"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
// tslint:disable-next-line
const csvParse = require('csv-parse/lib/sync');
const fs = require("fs");
const path = require("path");
const argv = yargs
    .usage(`Usage: npm run lifetable-csv-to-json -- <path-to-csv-file> <optional-path-to-put-json>`)
    .demandCommand(1).argv;
const lifeTableCsvString = fs.readFileSync(path.resolve(argv._[0]), 'utf8');
const lifeTableCsv = csvParse(lifeTableCsvString, {
    columns: true,
});
const lifeTableJson = lifeTableCsv.map(lifeTableCsvRow => {
    return {
        age: Number(lifeTableCsvRow.age),
        ax: Number(lifeTableCsvRow.ax),
        ex: Number(lifeTableCsvRow.ex),
    };
});
const userGivenOutPath = argv._[1];
const lifeTableJsonOutPath = userGivenOutPath
    ? path.resolve(userGivenOutPath)
    : path.join(process.cwd(), '/life-table.json');
fs.writeFileSync(lifeTableJsonOutPath, JSON.stringify(lifeTableJson));
console.log(`Done. File is available at ${lifeTableJsonOutPath}`);
//# sourceMappingURL=lifetable-csv-to-json.js.map