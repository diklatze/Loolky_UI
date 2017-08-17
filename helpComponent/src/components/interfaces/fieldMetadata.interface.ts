export interface FieldMetadataInterface {
    index: number,
    name: string,
    description: string,
    type?: FieldTypeEnum, //TODO: remove the 'type' and change the code to use the BaseConstraintsInterface.type
    isMandatory: boolean,
    isPredefined: boolean,
    maxLength?: number,
    constraints: DateConstraintsInterface | NumericConstraintsInterface | ListConstraintsInterface | BaseConstraintsInterface | MappingConstraintsInterface,
}

export interface FieldMetadataValueInterface extends FieldMetadataInterface {
    value: string | number | Date,
}

export enum FieldTypeEnum {
    list = <any>"list",
    free_text = <any>"free_text",
    numeric = <any>"numeric",
    date = <any>"date",
    mapping = <any>"mapping"
}

export function getFieldTypeDescription(value: FieldTypeEnum): string {
    let FieldTypeDescription = {
        list: "List",
        free_text: "Free Text",
        numeric: "Numeric",
        date: "Date",
        mapping: "Mapping"
    }
    return (FieldTypeDescription[value]);
}

export interface BaseConstraintsInterface {
    type?: FieldTypeEnum
}

export interface DateConstraintsInterface extends BaseConstraintsInterface {
    minDate?: Date,
    maxDate?: Date
}

export interface NumericConstraintsInterface extends BaseConstraintsInterface {
    minValue?: number,
    maxValue?: number
}

export interface ListConstraintsInterface extends BaseConstraintsInterface {
    listOfValues?: string[]
}

export const LIST_VALUES_DELIMITER = '|';

export interface DynamicFieldsValuesInterface {
    dynamicFields: { [key: string]: string | number | Date }
}

export interface MappingConstraintsInterface extends BaseConstraintsInterface {
    contractName?: string,
    contractField?: string
}