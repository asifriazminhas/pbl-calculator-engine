import { Cox } from '../cox/cox';
import { Data } from '../common/datum';
import { BaseLifeTableRow, constructLifeExpectancyFunctionForAlgorithm } from '../life-expectancy/life-expectancy';
import { limesurveyTxtStringToPmmlString } from '../pmml-transformers/limesurvey';
import { transformPhiatDictionaryToPmml } from '../pmml-transformers/web-specifications';
import { pmmlXmlStringsToJson } from '../pmml-to-json-parser/pmml';
import * as fs from 'fs';
import { parseCoxJsonToCox } from '../json-parser/cox';
import { curryGetRiskFunction, curryGetSurvivalFunction } from './curry';

export interface GetSurvival {
    getSurvival: (data: Data) => number;
}

export interface GetRisk {
    getRisk: (data: Data) => number;
}

export interface GetLifeExpectancy {
    getLifeExpectancy: (data: Data) => number;
}

export interface AddLifeTable {
    addLifeTable: (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable;
}

export interface ReplaceLifetable {
    replaceLifeTable: (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable
}

export interface BuildFromAssetsFolder {
    buildFromAssetsFolder: (assetsFolderPath: string) => Promise<GetSurvival & GetRisk & AddLifeTable>;
}

export interface CoxBuilder {
    cox: () => BuildFromAssetsFolder;
}

function curryReplaceLifeTable(
    cox: Cox
): (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable {
    return (lifeTable: Array<BaseLifeTableRow>) => {
        return replaceLifeTable(cox, lifeTable);
    }
}

function replaceLifeTable(
    cox: Cox,
    lifeTable: Array<BaseLifeTableRow>
): GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable {
    return {
        getSurvival: curryGetSurvivalFunction(cox),
        getRisk: curryGetRiskFunction(cox),
        getLifeExpectancy: constructLifeExpectancyFunctionForAlgorithm(
            cox,
            lifeTable
        ),
        replaceLifeTable: curryReplaceLifeTable(cox)
    }
}

function addLifeTable(
    cox: Cox,
    lifeTable: Array<BaseLifeTableRow>
): GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable {
    return {
        getSurvival: curryGetSurvivalFunction(cox),
        getRisk: curryGetRiskFunction(cox),
        getLifeExpectancy: constructLifeExpectancyFunctionForAlgorithm(
            cox,
            lifeTable
        ),
        replaceLifeTable: curryReplaceLifeTable(cox)
    }
}

function curryAddLifeTable(
    cox: Cox
): (lifeTable: Array<BaseLifeTableRow>) => GetSurvival & GetRisk & GetLifeExpectancy & ReplaceLifetable {
    return (lifeTable) => {
        return addLifeTable(cox, lifeTable);
    }
}

async function buildFromAssetsFolder(
    assetsFolderPath: string
): Promise<GetSurvival & GetRisk & AddLifeTable> {
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

    const cox = parseCoxJsonToCox(await pmmlXmlStringsToJson(
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
    ));
    
    return {
        getSurvival: curryGetSurvivalFunction(cox),
        getRisk: curryGetRiskFunction(cox),
        addLifeTable: curryAddLifeTable(cox)
    }
}

export function algorithmBuilder(): CoxBuilder {
    return {
        cox: () => {
            return {
                buildFromAssetsFolder
            }
        }
    }
}