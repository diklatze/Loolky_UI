export interface ColumnInterface {
    title: string,
    fieldName: string,
    fieldType: 'string' | 'number' | 'boolean' | 'Date' | 'multiSelection',
    customFormatter?: (x: any) => string,
    multiSelectionList?: MultiSelectionItemInterface[],
}

export interface MultiSelectionItemInterface {
    value: string,
    desc: string
}

export interface PageInterface {
    filter?: FilterInterface,
    sort?: SortInterface,
    number?: number, //number of current page
    size: number, //max number of rows per page
    totalElements?: number, //total number of rows
    content?: any[]
}

export enum SortDirectionEnum {
    ASC, DESC
}

export interface SortInterface {
    [index: string]: SortDirectionEnum
}

export interface FilterInterface {
    [index: string]: string
}