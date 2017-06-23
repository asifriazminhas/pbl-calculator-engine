import * as http from 'http';
import * as path from 'path';
import { loadEngineData } from '../load-engine-data';
import * as express from 'express';
import { AlgorithmJson } from '../../models/parsers/json/algorithm';
import { BaseLifeTableRow } from '../../models/modules/life_table';

//Server port
const SERVER_PORT = 3000;
//Server ip address
const SERVER_IP = 'localhost';

//Creates an express application which implements all the routes which server the static assets
function createExpressApp(
    algorithmJson: AlgorithmJson,
    lifeTable: Array<BaseLifeTableRow>
): express.Application {
    const app = express();

    //Server all the file in the browser folder
    app.use(express.static(path.join(__dirname, '../../../browser')));
    //Server all the files in the dist folder
    app.use(express.static(path.join(__dirname, '../../../dist')));

    //Route which server all the data assets that the engine needs to the frontend
    app.get('/api/algorithm-data', (req, res, next) => {
        req; next;

        return res.status(200).json({
            algorithm: algorithmJson,
            lifeTable
        });
    });

    return app;
}

//load the engine data
loadEngineData()
    .then((data) => {
        //Create a nodejs server
        const server = http.createServer(
            //Create an express application
            createExpressApp(
                data.algorithmJson,
                data.lifeTable
            )
        );

        //Any errors the server has are logged to the console
        server.on('error', console.error);

        //Start the server
        server.listen(SERVER_PORT, SERVER_IP, () => {
            var host = server.address().address;
            var port = server.address().port;
            console.log('Sample life expectancy server running at http://' + host + ':' + port)
        });
    })
    .catch((err) => {
        console.error(err);
    })