import 'source-map-support/register';
import { AlgorithmBuilder } from '../index';
import * as path from 'path';

const assetsFolderPath = path.join(__dirname, '../../assets/test');

async function test() {
    const algorithm = await AlgorithmBuilder
        .buildSurvivalAlgorithm()
        .buildFromAssetsFolder(assetsFolderPath)
    
    //Test getCauseImpact
    algorithm
        .withCauseImpact('Smoking')
        .getRiskToTime([]);
    
    const result = algorithm
        .addAlgorithm({} as any)
        .withData([])
        .getRiskToTime()
        .getSurvivalToTime()
        .end();
    result.riskToTime
    result.survivalToTime

    const algorithmWithLifeTable = algorithm
        .addLifeTable([])
        .addAlgorithm({} as any);
    algorithmWithLifeTable
        .withCauseImpact('Smoking')
        .getLifeExpectancy([]);
        
    const resultTwo = algorithmWithLifeTable
        .withData([])
        .getRiskToTime()
        .getSurvivalToTime()
        .getLifeExpectancy()
        .getLifeYearsLost()
        .getSurvivalToAge()
        .withCauseImpact()
        .getLifeExpectancy()
        .end();
    resultTwo

    const algorithmWithLifeTableAndRefPop = algorithmWithLifeTable
        .addRefPop([])
        .addAlgorithm({} as any);
    const resultThree = algorithmWithLifeTableAndRefPop
        .withData([])
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