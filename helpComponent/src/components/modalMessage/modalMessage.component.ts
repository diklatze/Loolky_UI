import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Constants } from '../../utils/constans';

declare var $: any;

@Component({
    selector: 'modalMessage',
    templateUrl: 'modalMessage.component.html',
})

export class ModalMessage implements OnInit, AfterViewInit, OnChanges {
    @Input() active: boolean = false;
    @Input() actions: ActionsInterface;
    @Input() content: string;
    @Input() header?: string;

    DEFAULT_BUTTON_CLASS: string = "ui button";


    isShown: boolean = false; //current state shown or hidden

    constructor() {
    }

    ngOnInit() {
        $('#msgModal.hidden').detach(); //Remove the previously created hidden modals from DOM
    }


    ngOnChanges(changes: SimpleChanges) {
        //console.log('OnChanges()');

        //catch the change of active input param to hide or show the modal
        if (this.isShown != this.active) {
            $('#msgModal').modal('toggle');
            this.isShown = this.active;
        }

    }

    ngAfterViewInit() {
        $('#msgModal').modal({
            detachable: false,
            closable: false, //Make the underlying area not accessible
        });
    }


    //return pattern of ActionsInterface for single OK button modal layout
    static getModalActionsOKPattern(callbackFunction: Function): ActionsInterface {
        return {
            actions: [
                { buttonCaption: Constants.BUTTON_CAPTION_OK, buttonId: 'okMsgBtn', buttonClass: 'ui button ok', callback: callbackFunction, /*iconClass: 'checkmark icon'*/ },
            ]
        };
    }

    //return pattern of ActionsInterface for Yes/No button modal layout
    static getModalActionsYesNoPattern(yesButtonCallback: Function, noButtonCallback: Function): ActionsInterface {
        return {
            actions: [
                { buttonCaption: Constants.BUTTON_CAPTION_NO, buttonId: 'noMsgBtn', buttonClass: 'ui red button negative', callback: noButtonCallback, /*iconClass: 'checkmark icon'*/ },
                { buttonCaption: Constants.BUTTON_CAPTION_YES, buttonId: 'yesMsgBtn', buttonClass: 'ui green button positive', callback: yesButtonCallback, /*iconClass: 'checkmark icon'*/ }
            ]
        };
    }

    //return pattern of ActionsInterface pattern Yes/No or Ok by function arguments
    static getModalActionsPattern(callbackFunction1: Function, callbackFunction2?: Function): ActionsInterface {
        let retValue;
        if (callbackFunction2 == undefined) {
            retValue = ModalMessage.getModalActionsOKPattern(callbackFunction1);
        }
        else {
            retValue = ModalMessage.getModalActionsYesNoPattern(callbackFunction2, callbackFunction1);
        }

        return retValue;
    }

}

export interface ActionsInterface {
    actions: [{
        buttonCaption: string;
        buttonId: string;
        buttonClass?: string; //for example: 'ui ok green button positive'
        iconClass?: string; //for example 'checkmark icon'
        callback: Function;
    }]

}
