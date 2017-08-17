import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Constants } from '../../utils/constans';
import { ModeType, InputListDataInterface, OutputItemInterface, InputItemInterface, OutputListDataInterface } from '../interfaces/listManage.interface';
import { MessageServices } from '../../services/message.services';

declare var $: any;

@Component({
    selector: 'listManage',
    templateUrl: 'listManage.component.html',
    styles: [`.icon-top {margin-bottom: 2.5em;}`],
    providers: [MessageServices]
})

export class ListManage implements OnChanges {
    @Input() mode: ModeType;
    @Input() title: string;
    @Input() noDataMessage: string;
    @Input() data: InputListDataInterface;
    @Input() freeTextValidator?: (value: string) => boolean;

    addClicked: boolean = false;
    changedArr: boolean[] = null;
    deletedCounter: number = 0; //counts the number of DELETED items in the list
    isValidFreeTextValue: boolean = true;

    public static DELETED: string = 'DELETED';
    public ModeTypeEnum = ModeType; //required for usage in the template
    currentlyEditedIndex: number = -1; //index of array item being currently edited (FREE_TEXT mode)

    //Error messages
    validationErrorMessage: string;
    duplicateValueMessage: string;
    pleaseTypeValidMessage: string;

    constructor(private _MessageServices: MessageServices) {
        this._MessageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.pleaseTypeValidMessage = resultMessage });
        this._MessageServices.getMessage(Constants.MESSAGE_DUPLICATE_VALUE, (resultMessage: string) => { this.duplicateValueMessage = resultMessage });
    }

    init() {
        this.addClicked = false;
        this.currentlyEditedIndex = -1;
        this.deletedCounter = 0;
        this.isValidFreeTextValue = true;

        if (!this.freeTextValidator && this.mode == ModeType.FREE_TEXT) {
            this.freeTextValidator = function (value: string): boolean { return true; }
        }

        $('#addItemCombo').parent().detach(); //remove the addItemCombo combobox if already shown

        //if data.current_data is null or undefined - generate an empty array
        if (!this.data.current_data) {
            this.data.current_data = <[InputItemInterface]>[];
        }

        //if data.available_values is null or undefined - generate an empty array
        if (this.mode == ModeType.LIST_OF_VALUES && !this.data.available_values) {
            this.data.available_values = <[InputItemInterface]>[];
        }

        //generate changedArr array and initialize the deletedCounter
        this.changedArr = new Array<boolean>(this.data.current_data.length);
        for (let i: number = 0; i < this.data.current_data.length; i++) {
            if (this.data.current_data[i].name == ListManage.DELETED) {
                this.deletedCounter++;
            }
            this.changedArr[i] = false;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        //execute init() if data or mode were changed on the fly
        if (changes['data'] || changes['mode']) {
            this.init();
        }

    }

    //returns true if there was change in the list
    public isDirty(): boolean {
        //Check if there's any changed elements
        if (this.changedArr != null) {
            for (let i = 0; i < this.changedArr.length; i++) {
                if (this.changedArr[i] == true) {
                    return true;
                }
            }
        }
        return false;
    }

    //get output list
    public getList(): OutputListDataInterface {
        let dataArr: [OutputItemInterface] = null;

        if (this.changedArr == null || this.changedArr.length == 0) {
            return { data: dataArr };
        }

        dataArr = <[OutputItemInterface]>[];

        for (let i = 0; i < this.changedArr.length; i++) {
            const name = this.data.current_data[i].name;
            let element: OutputItemInterface = { name: name, changed: this.changedArr[i] };
            dataArr.push(element);
        }

        return { data: dataArr };
    }

    onRemove(index) {
        const item: InputItemInterface = { name: this.data.current_data[index].name, code: this.data.current_data[index].code };

        //if this is a newly added item and deleted - remove it from the list
        if (this.changedArr[index] == true && this.data.current_data[index].name != ListManage.DELETED) {
            this.data.current_data.splice(index, 1);
            this.changedArr.splice(index, 1);
        }
        else { //mark as DELETED
            this.data.current_data[index].name = ListManage.DELETED;
            this.changedArr[index] = true;
            this.deletedCounter++;
        }

        this.data.available_values.push(item);

        // console.log('------------------------------');
        // console.log(this.getList());
        // console.log('isDirty(): ' + this.isDirty());
        // console.log('deletedCounter: ' + this.deletedCounter);
        // console.log('------------------------------');
    }

    isEmptyCurrentData(): boolean {
        return (!this.data || !this.data.current_data || this.data.current_data.length == 0 || this.deletedCounter == this.data.current_data.length);
    }

    onAdd() {
        if (this.addClicked == true) {
            return;
        }
        this.isValidFreeTextValue = true;
        this.currentlyEditedIndex = -1; //stop the editing (FREE_TEXT mode)
        this.addClicked = true;
        setTimeout(() => { $('#addItemCombo').dropdown(); }); //initialize combobox, should be performed only once
    }

    onEdit(index) {
        this.addClicked = false; //stop adding an element if started
        this.isValidFreeTextValue = true;
        //end of current update
        if (index == this.currentlyEditedIndex) {
            let newValue = $('#' + index + 'valTxt')[0].value;

            //check if the name is valid and check for duplication
            this.isValidFreeTextValue = this.validateFreeText(newValue, index);
            if (this.isValidFreeTextValue) {
                //check if name was not changed
                if (this.data.current_data[index].name != newValue) {
                    this.data.current_data[index].name = newValue;
                    this.changedArr[index] = true;
                }

                this.currentlyEditedIndex = -1;
            }
        }
        //start of new update
        else {
            this.currentlyEditedIndex = index;
        }

        // console.log('------------------------------');
        // console.log(this.get\List());
        // console.log('isDirty(): ' + this.isDirty());
        // console.log('deletedCounter: ' + this.deletedCounter);
        // console.log('------------------------------');
    }

    validateFreeText(value: string, currentEditedIndex?: number): boolean {
        this.validationErrorMessage = null;

        if (!this.freeTextValidator(value)) {
            this.validationErrorMessage = this.pleaseTypeValidMessage + ' ' + this.title;
            return false;
        }

        if (this.valueAlreadyExistsInList(this.data, value, currentEditedIndex)) {
            this.validationErrorMessage = this.duplicateValueMessage;
            return false;

        }
        return true;
    }

    //check if a given name already exists in the list
    valueAlreadyExistsInList(arr: InputListDataInterface, name: string, indexToIgnore?: number): boolean {
        for (let i = 0; i < arr.current_data.length; i++) {
            if (arr.current_data[i].name == name && indexToIgnore != i) {
                return true;
            }
        }

        return false;
    }

    addValue() {
        if (this.mode == ModeType.LIST_OF_VALUES) {
            const index: number = $("#addItemCombo option:selected").index() - 1; //1 is for the place holder

            const item: InputItemInterface = this.data.available_values[index];

            this.data.available_values.splice(index, 1);
            this.data.current_data.push(item);
            this.changedArr.push(true);
            setTimeout(() => { $('#addItemCombo').dropdown('clear'); }); //clear the value of the combo
        }
        else if (this.mode == ModeType.FREE_TEXT) {
            this.isValidFreeTextValue = true;
            const newValue = $('#addTxt')[0].value;

            //check if the value is valid and check if such a value already exists
            this.isValidFreeTextValue =  this.validateFreeText(newValue);
            if (this.isValidFreeTextValue) {
                this.data.current_data.push({ name: newValue });
                this.changedArr.push(true);

                $('#addTxt')[0].value = '';
            }
        }
        // console.log('------------------------------');
        // console.log(this.getList());
        // console.log('isDirty(): ' + this.isDirty());
        // console.log('deletedCounter: ' + this.deletedCounter);
        // console.log('------------------------------');
    }

}
