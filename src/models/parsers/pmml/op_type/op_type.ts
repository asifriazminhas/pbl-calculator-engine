import { OpType } from '../../../algorithm/op_types/op_type';
import { addCategoricalFieldsIfCategorical } from './categorical';
import { addContinuousFieldsIfContinuous } from './continuous';
import { GenericDataField } from '../../../common';
import { IDataField } from '../../../pmml';

export function addCategoricalOrContinuousFields<T extends GenericDataField>(
    field: T,
    dataFieldNode: IDataField
): T {
    return addContinuousFieldsIfContinuous(
        addCategoricalFieldsIfCategorical(field, dataFieldNode),
        dataFieldNode
    );
}

export function getOpTypeFromPmmlOpType(opType: string): OpType {
    switch(opType) {
        case 'continuous': {
            return OpType.Continuous
        }
        case 'categorical': {
            return OpType.Categorical
        }
        default: {
            throw new Error(`Unknown Pmml OpType ${opType}`)
        }
    }
}