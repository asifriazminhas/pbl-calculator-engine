This sample shows how to start a nodejs server which serves calculated life expectancy values at http://localhost:3000/api/life-expectancy
It uses code from the load-engine-data sample

To get it up and running run this command in the terminal while in the engine folder:

```
npm run start-sample-server
```

If the command ran successfully you should see a message telling you that the server is running

To hit the life expectancy route run the following curl command in the terminal

```
curl -X POST -d '[{"name": "age", "coefficent": 21}]' -H "content-type: application/json" http://localhost:3000/api/life-expectancy
```

Notice the body of the curl, this is how data is sent to the engine to calculate it's values. It's an array of objects which each have a name field (The name of the predictor) and the coefficent field which has the value of that predictor. The engine input values are available here [Engine Input Docs](http://docs.projectbiglife.ca)