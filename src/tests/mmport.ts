require('source-map-support').install()

//util
import * as fs from 'fs'
import * as csvParse from 'csv-parse/lib/sync'
import * as path from 'path'

//chai
import * as chai from 'chai'
var {
    expect
} = chai

//models
import Algorithm from '../models/algorithm'
import IntermediatePredictor from '../models/predictors/intermediate_predictor'
import ExplanatoryPredictor from '../models/predictors/explanatory_predictor'
import parsePmml from '../models/parsers/pmml'
import Datum from '../models/data/datum'

//parse csv test data
var testDataCsvString = fs.readFileSync(path.join(__dirname, '../../assets/mmport/test_data.csv'),'utf8')
var meltemTestData: Array<{
    [index: string]: string
    'Age_cont': string
    'Age_spline': string
    'QSFunct1': string
    'QSFunct2': string
    'PhysicalActivity_cont': string
    'DietScore_cont': string
    'AlcoholHeavy_cat': string
    'AlcoholMod_cat': string
    'DepIndMod_cat': string
    'DepIndHigh_cat': string
    'EduNoGrad_cat': string
    'EduHSGrad_cat': string
    'ImEth0to15_cat': string
    'ImEth16to30_cat': string
    'ImEth31to45_cat': string
    'HeartDis_cat': string
    'Stroke_cat': string
    'Cancer_cat': string
    'Diabetes_cat': string
    'BMI_spline': string
    'baseline3_can_adj_sc': string
    'risk_can_adjusted': string
}> = csvParse(testDataCsvString, {
    columns: true,
    relax: true
})
var testData: Array<Array<Datum>> = meltemTestData.map((meltemTestDatum) => {
    var data: Array<Datum> = []

    for(var predictor in meltemTestDatum) {
        if(meltemTestDatum.hasOwnProperty(predictor)) {
            data.push(new Datum().constructorForNewDatum(predictor, Number(meltemTestDatum[predictor])))
        }
    }

    return data
})

describe(`MMPORT test data`, function() {
    before(async function() {
        var algorithmString = fs.readFileSync(path.join(__dirname, '../../assets/mmport/algorithm.xml'), 'utf8')    
        this.algorithm = await parsePmml(Algorithm, ExplanatoryPredictor, IntermediatePredictor, algorithmString) 
    })

    testData.map((testDatum, index) => {
        return it(`Row ${index}`, function() {
            var expectedOutput = Number(meltemTestData[index]['risk_can_adjusted'])
            var actualOutput = (this.algorithm as Algorithm).evaluate(testDatum)

            expect(actualOutput).to.equal(expectedOutput)
        })
    }) 
})