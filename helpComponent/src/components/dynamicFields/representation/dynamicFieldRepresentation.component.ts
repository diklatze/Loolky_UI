import { Component, ViewChild, Directive, ElementRef, OnDestroy, OnInit, Input } from '@angular/core';
import { RepresentationComponent } from './representation.component';
import { FieldMetadataInterface, FieldTypeEnum } from '../../interfaces/fieldMetadata.interface';
import { Accordion } from '../../uiElements/accordion.component';

declare var $: any

@Component({
    selector: 'dynamicFieldRepresentation',
    templateUrl: 'dynamicFieldRepresentation.component.html',
    styles: [
        `div.title label.header {
        display:inline;
    }`,
        `.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 200px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 1s;
}

.tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
}

#overflow {
    white-space: nowrap; 
    width: 8em; 
    overflow: hidden;
    text-overflow: ellipsis; 
    display:inline-block;
   
    
}

.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}`





    ]
})
export class DynamicFieldRepresentation implements RepresentationComponent, OnInit {
    @Input() fieldMetadata: FieldMetadataInterface;
    descriptionSizeLimit: number = 10;
    showFullDescription: boolean = false;

    constructor() { }


    showAccordion(): boolean {
        if (this.fieldMetadata.description.length > this.descriptionSizeLimit) {
            return true;
        }
        else
            return false;
    }


    @ViewChild('descriptionAccordion') descriptionAccordionElementRef: ElementRef;


    @ViewChild('field') dynamicFieldRepresentation: RepresentationComponent;
    fieldTypeEnum = FieldTypeEnum; //required in order to use it in the html template

    isValid(): boolean {
        return this.dynamicFieldRepresentation.isValid();
    }

    getData(): number | string | Date {
        return this.dynamicFieldRepresentation.getData();
    }

    ngOnInit() {
        $(this.descriptionAccordionElementRef.nativeElement)
            .accordion({
                onOpen: function () {
                    this.parentElement.querySelector('a').text = "  read less...";
                    //this.parentElement.querySelector('span').hidden = true;
                },
                onClose: function () {
                    this.parentElement.querySelector('a').text = "  read more...";
                    //this.parentElement.querySelector('span').hidden = false;
                }

            });
    }


}                            