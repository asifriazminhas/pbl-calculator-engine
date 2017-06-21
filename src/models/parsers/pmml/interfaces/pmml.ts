/**
 * PCell node inside of a ParamMatri which has the beta for a certain data field. The paramaterName matches with the name field in a Parameter node.
 * 
 * @export
 * @interface PCell
 */
export interface PCell {
    $: {
        parameterName: string
        df: string
        beta: string
    }
}

/**
 * The Paramater node in a PMML file. Has information for a certain predictor.
 * 
 * @export
 * @interface Parameter
 */
export interface Parameter {
    $: {
        name: string
        //Human readable name
        label: string
        referencePoint: string
    }
}

/**
 * The DataField node which has information about the optype and datatype of a certain field
 * 
 * @export
 * @interface DataField
 */
export interface DataField {
    $: {
        name: string
        optype: string
        dataType: string
    }
}

/**
 * Usually inside of a DerivedField node. Refers to another predictor
 * 
 * @export
 * @interface FieldRef
 */
export interface FieldRef {
    '#name': 'FieldRef'
    $: {
        field: string
    }
}

/**
 * Usually inside of a DerivedField. A Constant value like a number or a string
 * 
 * @export
 * @interface Constant
 */
export interface Constant {
    '#name': 'Constant'
    $: {
        dataType: string
    }
    _: string
}
//The tyoe of nodes that can be children of an Apply node
export type ApplyChildNode = Apply | Constant | FieldRef

/**
 * Usually inside of a DerivedField. Represents a function apply on the nodes underneath it
 * 
 * @export
 * @interface Apply
 */
export interface Apply {
    '#name': 'Apply'
    $: {
        function: string
    }
    $$: Array<ApplyChildNode>
}

/**
 * Inside of a LocalTransformation. Represents a predictor that can be derived from other predictors
 * 
 * @export
 * @interface DerivedField
 */
export interface DerivedField {
    $: {
        name: string;
        optype: string;
    }
    Apply?: Apply;
    Constant?: Constant;
    FieldRef?: FieldRef;
}

/**
 * The Header node inside the PMML node. We get the version of the PMML file from this
 * 
 * @export
 * @interface Header
 */
export interface Header {
    $: {
        description: string
    }
}


/**
 * The interface for a the PMML node in the xml file
 * 
 * @export
 * @interface Pmml
 */
export interface Pmml {
    Header: Header
    LocalTransformations: {
        DerivedField: Array<DerivedField>
    }
    GeneralRegressionModel: {
        //The nodes inside this nodes is what should be used to as the list of pedictors a certain algorithm needs
        ParameterList: {
            Parameter: Array<Parameter>
        }
        ParamMatrix: {
            PCell: Array<PCell>
        };
        CovariateList: {
            Predictor: Array<{
                $: {
                    name: string
                }
            }>
        };
        $: {
            baselineHazard: string
        }
    },
    DataDictionary: {
        DataField: Array<DataField>;
        $: {
            numberOfFields: string;
        }
    }
}

/**
 * The structure of a regular pmml file
 * 
 * @export
 * @interface PmmlXml
 */
export interface PmmlXml {
    PMML: Pmml
}