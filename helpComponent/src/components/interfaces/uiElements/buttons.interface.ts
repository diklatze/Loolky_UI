export interface ButtonsInterface extends Array<{
    caption: string,
    id: string,
    class: string,
    disabled?: boolean,
    onClick: Function,
}> { };



export interface SegmentButtonInterface {
    id: string,
    value: string,
    iconName?: string,
    caption: string,
    onClick: Function,
}