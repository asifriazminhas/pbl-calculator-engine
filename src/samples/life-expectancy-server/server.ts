import 'source-map-support/register';

import { loadEngineData } from '../load-engine-data';
import { CoxAlgorithm } from '../../models/algorithm/regression_algorithms/cox_algorithm';
import { parseFromAlgorithmJson } from '../../models/parsers/json/algorithm';
import * as express from 'express';
import * as http from 'http';
import { constructLifeExpectancyFunctionForAlgorithm, BaseLifeTableRow } from '../../models/modules/life_table';

const SERVER_PORT = 3000;
const LIFE_EXPECTANCY_URL = '/api/life-expectancy';
const SERVER_IP = 'localhost';

import * as bodyParser from 'body-parser';

//This creates an express application which implements a server route to calculate life expectancy
function getExpressApp(
    algorithm: CoxAlgorithm,
    lifeTable: Array<BaseLifeTableRow>
): express.Application {
    //Create the express application
    const app = express();

    //This is an express midleware. To see what an express middleware is go here https://expressjs.com/en/guide/using-middleware.html. All this middeware does is parse JSON present in the body of client requests.
    app.use(bodyParser.json({}));
    
    //This constructs a function to return life expextancy using the data loaded by the load-engine-data sample
    const getLifeExpectancy = constructLifeExpectancyFunctionForAlgorithm(
        algorithm,
        lifeTable
    );
    //Create a route to server life expectancy. The data required to calculate life expectancy should be present in the request body. The request body should be a JSON with the following format:
    //Array<{name: string, coefficent: string | number}>
    //eg. [{name: 'age', coefficent: 21}]
    app.post(LIFE_EXPECTANCY_URL, (req, res, next) => {
        try {
            return res.status(200).json({
                lifeExpectancy: getLifeExpectancy(req.body)
            });
        }
        catch (err) {
            return next(err);
        }
    });

    //Any errors are caught here and are returned to the client
    app.use(
        (
            err: Error,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            req; res; next;

            return res.status(500).json({
                name: err.name,
                message: err.message,
                stack: err.stack
            });
        }
    );

    return app;
}

//This function starts the nodejs server and takes an express app object which has all the routes for this server implemented
function startServer(app: express.Application) {
    //Create the nodejs server
    const server = http.createServer(app);

    //Any erorrs by the server come into this function and are console logged
    server.on('error', (err) => {
        console.error(err);
    });

    //Start the server
    server.listen(SERVER_PORT, SERVER_IP, () => {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Sample life expectancy server running at http://' + host + ':' + port)
    });
}

//Load all the data that the engine needs
loadEngineData()
    .then((data) => {
        //Start the server
        startServer(
            //Get the express application which has the routes for the server
            getExpressApp(
                //Convert the algorithm JSON into an Algorithm class instance
                parseFromAlgorithmJson(
                    data.algorithmJson
                ) as CoxAlgorithm,
                //The life table
                data.lifeTable
            )
        );
    })
    //Any uncaught errors come into this function and are console logged
    .catch((err) => {
        console.error(err);
    });



