import { OpTypes } from '../../common/op-types';
import { addCategoricalFieldsIfCategorical } from './categorical';
import { addContinuousFieldsIfContinuous } from './continuous';
import { GenericField } from '../../field';
import { IDataField } from '../../pmml';

export function addCategoricalOrContinuousFields<T extends GenericField>(
    field: T,
    dataFieldNode: IDataField
): T {
    return addContinuousFieldsIfContinuous(
        addCategoricalFieldsIfCategorical(field, dataFieldNode),
        dataFieldNode
    );
}

export function getOpTypeFromPmmlOpType(opType: string): OpTypes {
    switch(opType) {
        case 'continuous': {
            return OpTypes.Continuous
        }
        case 'categorical': {
            return OpTypes.Categorical
        }
        default: {
            throw new Error(`Unknown Pmml OpType ${opType}`)
        }
    }
}