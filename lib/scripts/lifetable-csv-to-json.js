"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var yargs = require("yargs"); // tslint:disable-next-line


var csvParse = require('csv-parse/lib/sync');

var fs = require("fs");

var path = require("path");

var argv = yargs.usage("Usage: npm run lifetable-csv-to-json -- <path-to-csv-file> <optional-path-to-put-json>").demandCommand(1).argv;
var lifeTableCsvString = fs.readFileSync(path.resolve(argv._[0]), 'utf8');
var lifeTableCsv = csvParse(lifeTableCsvString, {
  columns: true
});
var lifeTableJson = lifeTableCsv.map(function (lifeTableCsvRow) {
  return {
    age: Number(lifeTableCsvRow.age),
    ax: Number(lifeTableCsvRow.ax),
    ex: Number(lifeTableCsvRow.ex)
  };
});
var userGivenOutPath = argv._[1];
var lifeTableJsonOutPath = userGivenOutPath ? path.resolve(userGivenOutPath) : path.join(process.cwd(), '/life-table.json');
fs.writeFileSync(lifeTableJsonOutPath, JSON.stringify(lifeTableJson));
console.log("Done. File is available at ".concat(lifeTableJsonOutPath));
//# sourceMappingURL=lifetable-csv-to-json.js.map