import { GetRisk, curryGetRiskFunction } from './get-risk';
import { GetSurvivalToTime, curryGetSurvivalToTimeFunction } from './get-survival-to-time';
import { AddLifeTable, curryAddLifeTable } from './add-life-table';
import * as fs from 'fs';
import { transformPhiatDictionaryToPmml } from '../pmml-transformers/web-specifications';
import { limesurveyTxtStringToPmmlString } from '../pmml-transformers/limesurvey';
import { parseCoxJsonToCox } from '../json-parser/cox';
import { pmmlXmlStringsToJson } from '../pmml-to-json-parser/pmml';
import { ToJson, curryToJsonFunction } from './to-json';

export interface BuildFromAssetsFolder {
    buildFromAssetsFolder: (assetsFolderPath: string) => Promise<GetSurvivalToTime & GetRisk & AddLifeTable & ToJson>;
}

export async function buildFromAssetsFolder(
    assetsFolderPath: string
): Promise<GetSurvivalToTime & GetRisk & AddLifeTable & ToJson> {
    //Get the names of all the files in the assets directory
    const assetFileNames = fs.readdirSync(assetsFolderPath);

    const webSpecificationCsv = fs.readFileSync(
        `${assetsFolderPath}/web_specification.csv`,
        'utf8'
    );
    const webSpecificationCategoriesCsv = fs.readFileSync(
        `${assetsFolderPath}/web_specification_categories.csv`,
        'utf8'
    );
    const webSpecificationsPmml = transformPhiatDictionaryToPmml(
        webSpecificationCsv,
        webSpecificationCategoriesCsv,
        "Male",
        false,
        false,
        0
    );

    const limesurveyFile = fs.readFileSync(
        `${assetsFolderPath}/limesurvey.txt`,
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
    
    const coxJson = await pmmlXmlStringsToJson(
        pmmlFileNamesSortedByPriority
            .map((pmmlFileNameNumber) => {
                return fs.readFileSync(
                    `${assetsFolderPath}/${pmmlFileNameNumber}.xml`,
                    'utf8'
                )
            })
            .concat([
                limesurveyPmml,
                webSpecificationsPmml
            ])
    );

    const cox = parseCoxJsonToCox(coxJson);

    return {
        getSurvivalToTime: curryGetSurvivalToTimeFunction(cox),
        getRisk: curryGetRiskFunction(cox),
        addLifeTable: curryAddLifeTable(cox, coxJson),
        toJson: curryToJsonFunction(coxJson)
    }
}