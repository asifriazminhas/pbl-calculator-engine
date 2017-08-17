//Fix this later
/*import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import * as fs from 'fs';
import * as yargs from 'yargs';
import * as path from 'path';
import { PmmlParser } from '../models/pmml/parser';
var packageJson = require('../../package.json');

yargs
    .usage('Usage: npm run pmml-to-json -- -pmml [string] -o [string]')
    .demandOption(['pmml'])
    .describe('pmml', 'The path to the pmml file')
    .describe('o', 'The path where to put the output json file')
    .example(`npm run pmml-to-json -- --pmml "~/pmml/cvdport.xml" -o "~/pmml-json/cvdport.json"`, 'Takes the pmml file at ~/pmml/cvdport.xl, converts it to json and stores it at ~/pmml-json/cvdport.json');

console.log(`Using pbl-calculator-engine version ${packageJson.version}`);
console.log('');

function ensureDirectoryExistence(filePath: string): void {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

const argv = yargs.argv;

const pmmlPath = argv.pmml;
const outPath = argv.o;

const absolutePmmlPath = path.resolve(pmmlPath);

if(fs.existsSync(absolutePmmlPath)) {
    const pmmlFile = fs.readFileSync(absolutePmmlPath, 'utf8');

    PmmlParser.parsePmmlFromPmmlXmlStrings([
        pmmlFile
    ])
    .then((algorithm) => {
        const algorithmJson = JSON.stringify(algorithm);

        if(outPath) {
            const absoluteOutPath = path.resolve(outPath);

            ensureDirectoryExistence(absoluteOutPath);

            fs.writeFileSync(absoluteOutPath, algorithmJson, {
                encoding: 'utf8'
            });

            console.log(`Completed. Your file can be found at ${absoluteOutPath}`);
        }
        else {
            const absoluteOutPath = path.resolve('./pmml.json');

            fs.writeFileSync(absoluteOutPath, algorithmJson, {
                encoding: 'utf8'
            });

            console.log(`Completed. Your file can be found at ${absoluteOutPath}`);
        }
    })
    .catch((err) => {
        console.log('An error occured, please contact Yulric Sequeira (In the running for Director for Data Science) for more information')
        console.error(err);
        process.exit(1);
    });
}
else {
    throw new Error(`No PMML file at path ${absolutePmmlPath} found`);
}*/
//# sourceMappingURL=pmml_to_json.js.map