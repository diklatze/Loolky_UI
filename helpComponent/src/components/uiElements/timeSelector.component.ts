import { Component, OnInit, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { TimeInterface } from '../interfaces/dateTime.interface';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

declare var $: any;

const doNothingFunc = () => { };

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimeSelector),
    multi: true
};

@Component({
    selector: 'timeSelector',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
    styles: [`.blackColor{color: black}`],
    template:
    `
    <span>
            <select class="ui compact search dropdown" #hoursCombo name="hoursCombo" [(ngModel)]="time.hh">
                <option value="">hh</option>
                <option *ngFor="let hour of hoursArr" [value]="hour.value">{{hour.desc}}</option>
            </select>
        :
            <select class="ui compact search dropdown" #minutesCombo name="minutesCombo" [(ngModel)]="time.mm">
                <option value="">mm</option>
                <option *ngFor="let minute of minutesArr" [value]="minute.value">{{minute.desc}}</option>
            </select>

            <a [hidden]="readOnly || (isEmptyValue(time?.mm) && isEmptyValue(time?.hh))" class='blackColor'>
                <i name="removeTime" class="remove icon" (click)="clearTime()"></i>
            </a>
    </span>
    `
})
export class TimeSelector implements OnInit, ControlValueAccessor {
    @ViewChild('hoursCombo') hoursCombo: ElementRef;
    @ViewChild('minutesCombo') minutesCombo: ElementRef;
    time: TimeInterface;
    initialized: boolean = false;
    readOnly: boolean = false;

    hoursArr: { value: number, desc: string }[] = [];
    minutesArr: { value: number, desc: string }[] = [];

    constructor() {
        for (let i = 0; i < 24; i++) {
            let desc: string = i < 10 ? ('0' + i) : ('' + i);
            this.hoursArr[i] = { value: i, desc: desc };
        }

        for (let i = 0; i < 60; i++) {
            let desc: string = i < 10 ? ('0' + i) : ('' + i);
            this.minutesArr[i] = { value: i, desc: desc };
        }
    }

    clearTime() {
        this.clearCombos();
        setTimeout(() => {
            this.valueChanged();
        });
    }

    clearCombos() {
        $(this.hoursCombo.nativeElement).dropdown('clear');
        $(this.minutesCombo.nativeElement).dropdown('clear');
    }

    ngOnInit() {
        $(this.hoursCombo.nativeElement).dropdown(
            {
                onChange: (value, text, $choice) => { this.valueChanged() }
            }
        );
        $(this.minutesCombo.nativeElement).dropdown(
            {
                onChange: (value, text, $choice) => { this.valueChanged() }
            }
        );
        this.initialized = true;
    }

    isEmptyValue(val: any) {
        return (val == '' || val == undefined || val == null);
    }

    writeValue(time: TimeInterface): void {
        this.time = time;

        if (this.initialized) {
            if (!time || (time.hh == undefined && time.mm == undefined)) {
                this.clearCombos();
            }
            else {
                setTimeout(() => {
                    $(this.hoursCombo.nativeElement).dropdown('set selected', '' + time.hh);
                    $(this.minutesCombo.nativeElement).dropdown('set selected', '' + time.mm);
                });
            }
        }
    }

    setDisabledState(isDisabled: boolean): void {
        this.readOnly = isDisabled;

        $(this.hoursCombo.nativeElement).parent().toggleClass("disabled", isDisabled);
        $(this.minutesCombo.nativeElement).parent().toggleClass("disabled", isDisabled);
    }

    valueChanged() {
        this.onTouchedCallback();
        this.onChangeCallback(this.time);
    }

    registerOnChange(fn: any): void { this.onChangeCallback = fn; }
    registerOnTouched(fn: any): void { this.onTouchedCallback = fn; }

    //Placeholders for the callbacks which are later provided by the Control Value Accessor
    private onTouchedCallback: () => void = doNothingFunc;
    private onChangeCallback: (_: any) => void = doNothingFunc;
}