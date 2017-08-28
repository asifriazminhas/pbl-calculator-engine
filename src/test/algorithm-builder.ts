import 'source-map-support/register';
import { AlgorithmBuilder } from '../index';
import * as path from 'path';

const assetsFolderPath = path.join(__dirname, '../../assets/test');

async function test() {
    const algorithm = await AlgorithmBuilder
        .buildSurvivalAlgorithm()
        .buildFromAssetsFolder(assetsFolderPath)
    
    const result = algorithm
        .withData()
        .getRiskToTime()
        .getSurvivalToTime()
        .end();
    result.riskToTime
    result.survivalToTime

    const algorithmWithLifeTable = algorithm
        .addLifeTable([]);
    const resultTwo = algorithmWithLifeTable
        .withData()
        .getRiskToTime()
        .getSurvivalToTime()
        .getLifeExpectancy()
        .getLifeYearsLost('Smoking')
        .end();
    resultTwo

    const algorithmWithLifeTableAndRefPop = algorithmWithLifeTable
        .addRefPop([]);
    const resultThree = algorithmWithLifeTableAndRefPop
        .withData()
        .getHealthAge();
    resultThree;
    
    console.log(algorithm.getSurvivalToTime(
        [
            {
                name: 'age',
                coefficent: 21
            }
        ]
    ));
}


test()
    .then(() => {
        console.log('done');
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });