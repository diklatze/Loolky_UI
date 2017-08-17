import { Input } from '@angular/core';
import { FieldMetadataInterface } from '../../interfaces/fieldMetadata.interface';

export declare abstract class RepresentationComponent {
    @Input('fieldMetadata') fieldMetadata: FieldMetadataInterface;

    abstract isValid(): boolean;
    abstract getData(): number | string | Date;
}