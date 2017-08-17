import { Input } from '@angular/core';
import { DateConstraintsInterface, NumericConstraintsInterface, ListConstraintsInterface, BaseConstraintsInterface, MappingConstraintsInterface } from '../../interfaces/fieldMetadata.interface';

export declare abstract class ConstraintsComponent {
    @Input('isDisabled') isDisabled: boolean;
    @Input('constraints') constraints: DateConstraintsInterface | NumericConstraintsInterface | ListConstraintsInterface | BaseConstraintsInterface | MappingConstraintsInterface;
    abstract isValid(): boolean;
    //abstract getData(): any;//ScholarshipInterface | InfoScholarshipInterface | EligibilityScholarshipInterface | TCScholarshipInterface;
}