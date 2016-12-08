export interface Node {
    '#name': string
}

export interface PCell {
    parameterName: string
    df: string
    beta: string
}

export interface Parameter {
    name: string
    label: string
    referencePoint: string
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
    Apply: Apply
}

export interface Pmml {
    PMML: {
        LocalTransformations: {
            DerivedField: Array<DerivedField>
        }
        GeneralRegressionModel: {
            ParameterList: {
                Parameter: Array<{
                    $: Parameter
                }>
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
                baselineHazard: number
            }
        },
        DataDictionary: {
            DataField: Array<{
                $: DataField
            }>
        }
    }
}