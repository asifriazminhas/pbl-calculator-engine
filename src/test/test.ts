import 'source-map-support/register';

import * as fs from 'fs';
import * as path from 'path';
const assetsDirPath = path.join(
    __dirname,
    '../../test/assets/pmml/mmport'
);
import { pmmlXmlStringsToJson as newPmmlXmlStringsToJson } from '../engine/pmml-to-json-parser/pmml';
import { parseCoxJsonToCox } from '../engine/json-parser/cox';
import { getSurvival } from '../engine/cox/cox';
import { transformPhiatDictionaryToPmml } from '../engine/pmml-transformers/web-specifications';
import { limesurveyTxtStringToPmmlString } from '../engine/pmml-transformers/limesurvey';

export async function test() {
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
        false,
        false,
        0
    );
    const limesurveyFile = fs.readFileSync(
        `${assetsDirPath}/limesurvey.txt`,
        'utf8'
    );
    const limesurveyPmml = limesurveyTxtStringToPmmlString(limesurveyFile);
    const firstPmml = fs.readFileSync(
        `${assetsDirPath}/1.xml`, 'utf8'
    );
    const secondPmml = fs.readFileSync(
        `${assetsDirPath}/2.xml`, 'utf8'
    );

    const newAlgorithm = parseCoxJsonToCox(
        await newPmmlXmlStringsToJson([
            firstPmml,
            secondPmml,
            limesurveyPmml,
            webSpecificationsPmml
        ])
    )

    const data = [
        {
            name: 'Age_cont',
            coefficent: 21
        },
        {
            name: 'QSLight_df',
            coefficent: 0
        },
        {
            name: 'QSHeavy_df',
            coefficent: 1
        }, 
        {
            name: 'PhysicalActivity_cont',
            coefficent: 0.213065
        }, 
        {
            name: 'DietScore_cont',
            coefficent: 10
        },
        {
            name: 'AlcoholHeavy_cat',
            coefficent: 1
        },
        {
            name: 'AlcoholMod_cat',
            coefficent: 0
        },
        {
            name: 'DepIndHigh_cat',
            coefficent: 0
        },
        {
            name: 'DepIndMod_cat',
            coefficent: 1
        },
        {
            name: 'EduNoGrad_cat',
            coefficent: 0
        },
        {
            name: 'EduHSGrad_cat',
            coefficent: 1
        },
        {
            name: 'ImEth0to15_cat',
            coefficent: 0
        },
        {
            name: 'ImEth16to30_cat',
            coefficent: 1
        },
        {
            name: 'ImEth31to45_cat',
            coefficent: 0
        },
        {
            name: 'HeartDis_cat',
            coefficent: 1
        },
        {
            name: 'Stroke_cat',
            coefficent: 1
        },
        {
            name: 'Cancer_cat',
            coefficent: 1
        },
        {
            name: 'Diabetes_cat',
            coefficent: 1
        }
    ];

    console.log(getSurvival(newAlgorithm, data));
}

test()
    .then(() => {
        console.log('done');
        process.exit(0);
    })    
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })

