import { GenericAlgorithm, Algorithm } from '../../algorithm';
import DataField, { IExplanatoryPredictor } from '../../predictors/explanatory_predictor';
import DerivedField, { GenericIntermediatePredictor } from '../../predictors/intermediate_predictor';
import Field from '../../predictors/predictor';
import { constructFromICustomFunction } from './custom_function';
import { OpType } from '../../op_type';

export interface AlgorithmJson extends GenericAlgorithm<string, IExplanatoryPredictor, GenericIntermediatePredictor<string>> {

}

export function constructFromAlgorithmJson(algorithm: AlgorithmJson): Algorithm {
    const dataFields: Array<DataField> = algorithm.explanatoryPredictors
        .map((dataField) => {
            return Object.setPrototypeOf(dataField, DataField.prototype);
        });
    const derivedFields: Array<DerivedField> = algorithm.intermediatePredictors
        .map((derivedField) => {
            return Object.setPrototypeOf(derivedField, DerivedField.prototype);
        });
    
    const fields: Array<Field> = (dataFields as Array<Field>).concat(derivedFields);
    
    derivedFields.forEach((derivedField) => {
        derivedField.explanatoryPredictors = derivedField.explanatoryPredictors
            .map((explanatoryPredictor) => {
                const fieldFound = fields.find(field => field.name === explanatoryPredictor as any);
                if(fieldFound) {
                    return fieldFound;
                }
                else {
                    const newField = new Field();
                    newField.name = explanatoryPredictor as any;
                    newField.opType = OpType.Continuous;
                    fields.push(newField);

                    return newField;
                }
            })
    });

    dataFields.forEach((dataField) => {
        dataField.customFunction = dataField.customFunction ? 
            constructFromICustomFunction(dataField.customFunction, dataFields) : null;

        const derivedFieldFound = derivedFields
            .find(derivedField =>  derivedField.name === dataField.name);
        dataField.intermediatePredictor = derivedFieldFound ? derivedFieldFound : null;
    });

    return Object.setPrototypeOf(Object.assign({}, algorithm, {
        explanatoryPredictor: dataFields,
        intermediatePredictors: derivedFields
    }), Algorithm.prototype);
} 