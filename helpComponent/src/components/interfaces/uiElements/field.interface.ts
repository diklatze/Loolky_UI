export interface FieldInterface {
    name: string,
    id: string,
    formatter? : (any) => string;
    text? :string;
}