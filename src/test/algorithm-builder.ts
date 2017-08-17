import 'source-map-support/register';
import { AlgorithmBuilder } from '../index';
import * as path from 'path';

const assetsFolderPath = path.join(__dirname, '../../assets/test');

async function test() {
    const algorithm = await AlgorithmBuilder
        .cox()
        .buildFromAssetsFolder(assetsFolderPath);
    
    console.log(algorithm.getSurvival(
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