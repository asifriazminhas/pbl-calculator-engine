import * as fs from 'fs';
import { TestAlgorithmsFolderPath } from './constants';
import { SurvivalModelBuilder } from '../index';
import { ModelTypes } from '../engine/model/index';

function getAlgorithmNamesToTest(excludeAlgorithms: string[]): string[] {
    return fs
        .readdirSync(TestAlgorithmsFolderPath)
        .filter(
            algorithmName => excludeAlgorithms.indexOf(algorithmName) === -1,
        )
        .filter(algorithmName => algorithmName !== '.DS_Store');
}

async function getModelObjFromAlgorithmName(
    algorithmName: string,
): Promise<ModelTypes> {
    return (await SurvivalModelBuilder.buildFromAssetsFolder(
        `${TestAlgorithmsFolderPath}/${algorithmName}`,
    )).getModel();
}

export async function getModelsToTest(
    modelsToExclude: string[],
): Promise<Array<{ model: ModelTypes; name: string }>> {
    const modelNames = getAlgorithmNamesToTest(modelsToExclude);
    const models = await Promise.all(
        modelNames.map(algorithmName => {
            return getModelObjFromAlgorithmName(algorithmName);
        }),
    );

    return models.map((model, index) => {
        return {
            model,
            name: modelNames[index],
        };
    });
}

export function getPmmlString(
    derivedFields: Array<{
        name: string;
        mapValues: {
            tableName: string;
            outputColumn: string;
            fieldColumnPairs: Array<{
                column: string;
                constant: any;
            }>;
        };
    }>,
    tables: Array<{
        name: string;
        rows: Array<{
            [index: string]: any;
        }>;
    }>,
): string {
    const derivedFieldsPmmlString = derivedFields.map(derivedField => {
        return `<DerivedField name="${derivedField.name}" optype="continuous">
            <MapValues outputColumn="${derivedField.mapValues.outputColumn}">
                ${derivedField.mapValues.fieldColumnPairs.map(
                    fieldColumnPair => {
                        return `<FieldColumnPair
                            column="${fieldColumnPair.column}"
                            constant="${fieldColumnPair.constant}">
                        </FieldColumnPair>`;
                    },
                )}
                <TableLocator location="taxonomy" name="${derivedField.mapValues
                    .tableName}"/>
            </MapValues>
        </DerivedField>`;
    });

    const taxonomyPmmlString = tables.map(table => {
        return `<Taxonomy name="${table.name}">
                <InlineTable>
                    ${table.rows.map(row => {
                        return `<row>
                            ${Object.keys(row).map(columnName => {
                                return `<${columnName}>${row[
                                    columnName
                                ]}</${columnName}>`;
                            })}
                        </row>`;
                    })}
                </InlineTable>
            </Taxonomy>`;
    });

    return `<PMML>
        <Header copyright="Copyright (c) 2016" description="CVDPoRTMale_v0.9">
            <Extension name="user" value="user" extender="COXPH"/>
            <Application name="COXPH" version="1.4"/>
            <Timestamp>2016-08-30 11:53:28</Timestamp>
        </Header>
        <DataDictionary>
            <DataField name="dataFieldOne"/>
            <DataField name="dataFieldTwo"/>
        </DataDictionary>
        <LocalTransformations>
            <DefineFunction name="testFunctionOne">
                <ParameterField name="test"/>
                <FieldRef field="sex" />
            </DefineFunction>
            <DefineFunction name="testFunctionTwo">
                <ParameterField name="test"/>
                <FieldRef field="sex" />
            </DefineFunction>
            ${derivedFieldsPmmlString}
        </LocalTransformations>
        ${taxonomyPmmlString}
        <GeneralRegressionModel
                modelType="CoxRegression"
                modelName="CVDPoRT_malemodel"
                functionName="regression"
                algorithmName="coxph"
                endTimeVariable="ttcvd_dec12_year"
                statusVariable="censor_cvd_dec12">
            <MiningSchema>
                <MiningField name="survival" usageType="predicted"/>
                <MiningField name="dataFieldTwo" usageType="active"/>
                <MiningField name="dataFieldOne" usageType="active"/>
            </MiningSchema>
            <Output>
                <OutputField name="Predicted_survival" feature="predictedValue"/>
                <OutputField name="cumulativeHazard" feature="transformedValue">
                    <Apply function="*">
                        <Constant>-1.0</Constant>
                        <Apply function="ln">
                            <FieldRef field="Predicted_survival"/>
                        </Apply>
                    </Apply>
                </OutputField>
            </Output>
            <ParameterList>
                <Parameter name="p0" label="dataFieldOne"/>
                <Parameter name="p1" label="dataFieldTwo"/>
            </ParameterList>
            <FactorList/>
            <CovariateList>
                <Predictor name="dataFieldOne" />
                <Predictor name="dataFieldTwo"/>
            </CovariateList>
            <PPMatrix>
                <PPCell
                    value="1" predictorName="dataFieldOne" parameterName="p0"/>
                <PPCell
                    value="1" predictorName="dataFieldTwo" parameterName="p1"/>
            </PPMatrix>
            <ParamMatrix>
                <PCell parameterName="p0" df="1" beta="0.2022114164395"/>
                <PCell parameterName="p1" df="1" beta="-0.27529830694182"/>
            </ParamMatrix>
        </GeneralRegressionModel>
        <CustomPMML>
        </CustomPMML>
    </PMML>`;
}
