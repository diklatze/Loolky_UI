import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'visualize',
    template:
    `
    <iframe frameBorder="0" [src]="url | safe" [width]="width" [height]="height"></iframe>
    `
})
export class Visualize implements OnInit {
    @Input() width?: string;
    @Input() height?: string;
    @Input() url: string;

    constructor() { }

    ngOnInit() {
        if (!this.width) {
            this.width = '100%';
        }

        if (!this.height) {
            this.height = '100%';
        }
    }

}