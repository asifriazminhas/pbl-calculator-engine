This sample shows how to use the engine in the browser. It consists of a nodejs server (src/samples/life-expectacy-browser/server.ts) which serves all the static files and an html file which loads the engine scripts and runs a simple javascript script to calculate life expectancy (src/browser/index.html)

To get up and running with this script run the following command in the terminal while in the source code directory,
```
npm run start-sample-client
```

If it ran successfully then you should see a message saying that the server has started.
Once the server is up and running open a browser window and go to the address http://localhost:3000/index.html.
