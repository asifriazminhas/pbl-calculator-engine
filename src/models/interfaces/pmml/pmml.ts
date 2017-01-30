export interface Node {
    '#name': string
}

export interface PCell {
    parameterName: string
    df: string
    beta: string
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

export interface DataField {
    name: string
    optype: string
    dataType: string
}

export interface PPCell {
    predictorName: string
    parameterName: string
}

export interface FieldRef {
    '#name': 'FieldRef'
    $: {
        field: string
    }
}

export interface Constant {
    '#name': 'Constant'
    $: {
        dataType: string
    }
    _: string
}

export type ApplyChildNode = Apply | Constant | FieldRef

export interface Apply {
    '#name': 'Apply'
    $: {
        function: string
    }
    $$: Array<ApplyChildNode>
}

export interface DerivedField {
    $: {
        name: string
        optype: string,
        Apply: Array<Apply>
    }
}

export interface DerivedField {
    Apply?: Apply;
    Constant?: Constant
}

/**
 * The root XML node for a PMML file
 * 
 * @export
 * @interface Pmml
 */
export interface Pmml {
    PMML: {
        LocalTransformations: {
            DerivedField: Array<DerivedField>
        }
        GeneralRegressionModel: {
            //The nodes inside this nodes is what should be used to as the list of pedictors a certain algorithm needs
            ParameterList: {
                Parameter: Array<Parameter>
            }
            ParamMatrix: {
                PCell: Array<{
                    $: PCell
                }>
            }
            PPMatrix: {
                PPCell: Array<{
                    $: PPCell
                }>
            },
            $: {
                baselineHazard: string
            }
        },
        DataDictionary: {
            DataField: Array<{
                $: DataField
            }>
        }
    }
}