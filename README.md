# Requirments 
NodeJS and NPM (https://nodejs.org/en/download/)
Once Nodejs and NPM are installed they should be available in your PATH which can be checked using the commands,
```
node -v
npm -v
```

# Getting Started
Install all the dependencies the library needs by first going into the engine directory and running the following command
```
npm install
```
Currently there is a problem where you will see a lot of errors after running the above command. Don't worry, it will not affect your usage of your library

# Library Info
This library is written using Typescript (https://www.typescriptlang.org/) which is a superset of Javascript. 

If you use Typescript then you should be using all the files in the src folder but if you are using Javascript then you should be using all the files in the lib folder. 

A compiled version of the entire engine is available at dist/pbl_calculator_engine_umd.js. Importing this file on the server should add the PBLCalculatorEngine variable in the global scope and sending to a client browser should do the same.

Samples are available in the src/samples folder

The engine has two steps in it:
1. Load all the data that the engine needs
2. Start using the functions the engine provides to calculate life expectancy etc.

# Directory Structure
* /assets - Has all the non source code files which the engine uses
* /browser - Sample browser code
* /dist - Has the compiled version of the version most useful for importing into the browser using a script tag
* /lib - Javascript source code files
* /src - Typescript source code files

# Branches

1.31.1-X - These branch versions are only used by the ProjectBigLife website for quick bug fixes due to the engine being too far ahead. These should be removed at some point.
