
export enum ModeType {
    FREE_TEXT,
    LIST_OF_VALUES
}

export interface InputItemInterface {
    name: string,
    code?: string //code is not required in FREE_TEXT mode
}

export interface OutputItemInterface {
    name: string,
    changed: boolean
}

export interface InputListDataInterface {
    available_values?: InputItemInterface[] //available_values is not required in FREE_TEXT mode
    current_data: InputItemInterface[],
}

export interface OutputListDataInterface {
    data: OutputItemInterface[];
}