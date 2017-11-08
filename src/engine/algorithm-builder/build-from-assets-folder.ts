import {
    GetRiskToTime,
    getGetRiskToTime,
    GetSurvivalToTime,
    getGetSurvivalToTime,
    WithCauseImpactWithCoxFunctions,
    getWithCauseImpactWithCoxFunctions,
} from '../algorithm-evaluator';
import {
    AddLifeTableWithAddRefPop,
    getAddLifeTableWithAddRefPop,
} from './add-life-table';
import {
    AddRefPopWithAddLifeTable,
    getAddRefPopWithAddLifeTable,
} from './add-ref-pop';
import * as fs from 'fs';
import { transformPhiatDictionaryToPmml } from '../pmml-transformers/web-specifications';
import { limesurveyTxtStringToPmmlString } from '../pmml-transformers/limesurvey';
import { pmmlXmlStringsToJson } from '../pmml-to-json-parser/pmml';
import { ToJson, getToJson } from './to-json';
import {
    WithDataAndCoxFunctions,
    getWithDataAndCoxFunctions,
} from '../algorithm-evaluator';
import { BaseAddAlgorithm, getBaseAddAlgorithmFunction } from './add-algorithm';
import {
    BaseReplaceCauseImpactRef,
    getBaseReplaceCauseImpactRef,
} from './replace-cause-impact-ref';
import * as path from 'path';
const csvParse = require('csv-parse/lib/sync');
import { JsonModelTypes } from '../model';
import { SingleAlgorithmModelJson } from '../single-algorithm-model';
import { MultipleAlgorithmModelJson } from '../multiple-algorithm-model';
import { parseModelJsonToModel } from '../model';

export type BuildFromAssetsFolderFunction = (
    assetsFolderPath: string,
) => Promise<
    GetSurvivalToTime &
        GetRiskToTime &
        AddLifeTableWithAddRefPop &
        AddRefPopWithAddLifeTable &
        ToJson &
        WithDataAndCoxFunctions<{}> &
        BaseAddAlgorithm &
        WithCauseImpactWithCoxFunctions &
        BaseReplaceCauseImpactRef
>;

export interface BuildFromAssetsFolder {
    buildFromAssetsFolder: BuildFromAssetsFolderFunction;
}

function getPmmlFileStringsSortedByPriorityInFolder(
    assetsFolderPath: string,
): string[] {
    //Get the names of all the files in the assets directory
    const assetFileNames = fs.readdirSync(assetsFolderPath);

    return assetFileNames
        .filter(pmmlFileName => pmmlFileName.indexOf('.xml') > -1)
        .map(pmmlFileName => pmmlFileName.split('.')[0])
        .map(pmmlFileName => Number(pmmlFileName))
        .sort((pmmlFileNameOne, pmmlFileNameTwo) => {
            return pmmlFileNameOne > pmmlFileNameTwo ? 1 : -1;
        })
        .map(pmmlFileName => '' + pmmlFileName)
        .map(pmmlFileName =>
            fs.readFileSync(`${assetsFolderPath}/${pmmlFileName}.xml`, 'utf8'),
        );
}

async function buildSingleAlgorithmModelJson(
    assetsFolderPath: string,
    limesurveyPmmlString: string,
    webSpecifictaionsCsvString: string,
    webSpecifictationsCategoriesCsvString: string,
    algorithmName: string,
): Promise<SingleAlgorithmModelJson> {
    //Get the pmml file strings in the directory sorted by priority
    const pmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(
        assetsFolderPath,
    );

    //Convert webSpecificationsCsvString to Pmml file for both genders
    const webSpecificationsPmml = transformPhiatDictionaryToPmml(
        algorithmName,
        webSpecifictaionsCsvString,
        webSpecifictationsCategoriesCsvString,
        'both',
        false,
        false,
        0,
    );

    //Return SingleAlgorithmModelJson
    return (await pmmlXmlStringsToJson(
        [pmmlFileStrings.concat([limesurveyPmmlString, webSpecificationsPmml])],
        [],
    )) as SingleAlgorithmModelJson;
}

async function buildMultipleAlgorithmModelJson(
    assetsFolderPath: string,
    webSpecificationsCsvString: string,
    webSpecificationsCategoriesCsvString: string,
    limesurveyPmml: string,
    algorithmName: string,
): Promise<MultipleAlgorithmModelJson> {
    //get the pmml file strings sorted by priority for the male algorithm
    const malePmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(
        `${assetsFolderPath}/male`,
    );

    //get the web specifications pmml string for the male model
    const maleWebSpecificationsPmml = transformPhiatDictionaryToPmml(
        algorithmName,
        webSpecificationsCsvString,
        webSpecificationsCategoriesCsvString,
        'Male',
        false,
        false,
        0,
    );

    //make the array of pmml strings for the male model
    const maleAlgorithmPmmlFileString = malePmmlFileStrings.concat([
        maleWebSpecificationsPmml,
        limesurveyPmml,
    ]);

    //get the pmml file string sorted by priority for the female algorithm
    const femalePmmlFileStrings = getPmmlFileStringsSortedByPriorityInFolder(
        `${assetsFolderPath}/female`,
    );

    //get the web specifications pmml string for the female model
    const femaleWebSpecificationsPmml = transformPhiatDictionaryToPmml(
        algorithmName,
        webSpecificationsCsvString,
        webSpecificationsCategoriesCsvString,
        'Female',
        false,
        false,
        0,
    );

    //make the array of pmml string for the female model
    const femaleAlgorithmPmmlStrings = femalePmmlFileStrings.concat([
        limesurveyPmml,
        femaleWebSpecificationsPmml,
    ]);

    //Construct and return the MultipleAlgorithmJson object
    return (await pmmlXmlStringsToJson(
        [maleAlgorithmPmmlFileString, femaleAlgorithmPmmlStrings],
        [
            {
                equation: `predicateResult = obj['sex'] === 'male'`,
                variables: ['sex'],
            },
            {
                equation: `predicateResult = obj['sex'] === 'female'`,
                variables: ['sex'],
            },
        ],
    )) as MultipleAlgorithmModelJson;
}

export function curryBuildFromAssetsFolder(): BuildFromAssetsFolderFunction {
    return async assetsFolderPath => {
        //Get the name of the algorithm from the assetsFolderPath
        const currentAlgorithmName = path.basename(assetsFolderPath);

        //Get the limesurvye txt file string
        const limesurveyTxtString = fs.readFileSync(
            `${assetsFolderPath}/limesurvey.txt`,
            'utf8',
        );
        const limesurveyPmml = limesurveyTxtStringToPmmlString(
            limesurveyTxtString,
        );

        //Get web specifications csv file string
        const webSpecificationsCsvString = fs.readFileSync(
            `${assetsFolderPath}/web_specifications.csv`,
            'utf8',
        );

        //Get the web specifications categories csv file string
        const webSpecificationsCategoriesCsvString = fs.readFileSync(
            `${assetsFolderPath}/web_specifications_categories.csv`,
            'utf8',
        );

        //Parse the algorithm info csv file
        const algorithmsInfoTable: Array<{
            AlgorithmName: string;
            GenderSpecific: 'true' | 'false';
        }> = csvParse(
            fs.readFileSync(`${assetsFolderPath}/algorithm_info.csv`, 'utf8'),
            {
                columns: true,
            },
        );

        //Get the row with the algorithm we need construct
        const currentAlgorithmInfoFile = algorithmsInfoTable.find(
            algorithmInfoRow =>
                algorithmInfoRow.AlgorithmName === currentAlgorithmName,
        );
        if (!currentAlgorithmInfoFile) {
            throw new Error(
                `No info found for algorithm with name ${currentAlgorithmName}`,
            );
        }

        //Call the right method depending on whether it's a MultipleAlgorithm or a SingleAlgorithm type of model
        let modelJson: JsonModelTypes;
        if (currentAlgorithmInfoFile.GenderSpecific === 'true') {
            modelJson = await buildMultipleAlgorithmModelJson(
                assetsFolderPath,
                webSpecificationsCsvString,
                webSpecificationsCategoriesCsvString,
                limesurveyPmml,
                currentAlgorithmName,
            );
        } else {
            modelJson = await buildSingleAlgorithmModelJson(
                assetsFolderPath,
                limesurveyPmml,
                webSpecificationsCsvString,
                webSpecificationsCategoriesCsvString,
                currentAlgorithmName,
            );
        }

        const model = parseModelJsonToModel(modelJson);

        return Object.assign(
            {},
            getGetRiskToTime(model),
            getGetSurvivalToTime(model),
            getToJson(modelJson),
            getAddRefPopWithAddLifeTable(model, modelJson),
            getAddLifeTableWithAddRefPop(model, modelJson),
            getWithDataAndCoxFunctions({}, {}, model, modelJson),
            getWithCauseImpactWithCoxFunctions(model, modelJson),
            getBaseAddAlgorithmFunction(model, modelJson),
            getBaseReplaceCauseImpactRef(model, modelJson),
        );
    };
}
