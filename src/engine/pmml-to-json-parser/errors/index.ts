export function NoDataFieldNodeFound(dataFieldName: string) {
    return new Error(`No DataField node found with name ${dataFieldName}`);
}

export function NoParameterNodeFoundWithLabel(parameterLabel: string) {
    return new Error(`No Parameter node found with name ${parameterLabel}`);
}

export function NoPCellNodeFoundWithParameterName(pCellParameterName: string) {
    return new Error(`No PCell node found with parameter name ${pCellParameterName}`);
}