import { pmmlXmlStringsToJson } from '../../models/parsers/pmml/pmml';
import * as fs from 'fs';
import * as path from 'path';
import { limesurveyTxtStringToPmmlString } from '../../models/transformers/pmml/limesurvey';
import { transformPhiatDictionaryToPmml } from '../../models/transformers/pmml/phiat';
const csvParse = require('csv-parse/lib/sync');
import { AlgorithmJson } from '../../models/parsers/json/algorithm';
import { BaseLifeTableRow } from '../../models/modules/life_table';


/**
 * Function which parses all the data required by the engine to calculate it's values and returns them. Used in the the life-expectancy-server and the life-expectancy-browser sample. You most probably will not need to ever worry about the internals of this function, but will just import and run it
 * 
 * @export
 * @returns {Promise<{
 *     algorithm: AlgorithmJson,
 *     lifeTable: Array<BaseLifeTableRow>
 * }>} Object which has the json representation of the algorithm stored in the algorithm field and the lifetable stored in the lifeTable field. Both of these are required to calculate life expectancy
 */
export async function loadEngineData(): Promise<{
    algorithmJson: AlgorithmJson,
    lifeTable: Array<BaseLifeTableRow>
}> {
    //The path to the assets dir. The assets directory has all the files which contain the config data for the engine.
    const assetsDirPath = path.join(__dirname, '../../../assets');

    //Get the names of all the files in the assets directory
    const assetFileNames = fs.readdirSync(assetsDirPath);

    const webSpecificationCsv = fs.readFileSync(
        `${assetsDirPath}/web_specification.csv`,
        'utf8'
    );
    const webSpecificationCategoriesCsv = fs.readFileSync(
        `${assetsDirPath}/web_specification_categories.csv`,
        'utf8'
    );
    const webSpecificationsPmml = transformPhiatDictionaryToPmml(
        webSpecificationCsv,
        webSpecificationCategoriesCsv,
        "Male",
        false
    );

    const limesurveyFile = fs.readFileSync(
        `${assetsDirPath}/limesurvey.txt`,
        'utf8'
    );
    const limesurveyPmml = limesurveyTxtStringToPmmlString(limesurveyFile);

    const pmmlFileNamesSortedByPriority = assetFileNames
        .filter(pmmlFileName => pmmlFileName.indexOf('.xml') > -1)
        .map(pmmlFileName => pmmlFileName.split('.')[0])
        .map(pmmlFileName => Number(pmmlFileName))
        .sort((pmmlFileNameOne, pmmlFileNameTwo) => {
            return pmmlFileNameOne > pmmlFileNameTwo ? 1 : -1;
        });

    const algorithmJson = await pmmlXmlStringsToJson(
        pmmlFileNamesSortedByPriority
            .map((pmmlFileNameNumber) => {
                return fs.readFileSync(
                    `${assetsDirPath}/${pmmlFileNameNumber}.xml`,
                    'utf8'
                )
            })
            .concat([
                limesurveyPmml,
                webSpecificationsPmml
            ])
    );

    const lifeTableCsv = fs.readFileSync(
        path.join(__dirname, '../../../assets/life_table.csv'),
        'utf8'
    );
    const lifeTable = csvParse(lifeTableCsv, {
        columns: true
    })
        .map((row: any) => {
            return Object.assign({}, row, {
                age: Number(row.age)
            })
        });
    
    return {
        algorithmJson,
        lifeTable
    };
}