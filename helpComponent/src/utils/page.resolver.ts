import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class PageResolver {
    constructor(private platform: Platform) { }
    // getPage(name: string): any {
    //     if (this.platform.is("core")) {
    //         return eval(name);
    //     } else {
    //         try {
    //             return eval(name + "Android");
    //         } catch (e) {
    //             return eval(name);
    //         }
    //     }
    // }

    isMobile() {
        return !this.platform.is('core');
    }

    isIOS() {
        return this.platform.is('ios');
    }
    
}