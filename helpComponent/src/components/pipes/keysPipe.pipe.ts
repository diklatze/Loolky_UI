import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
    transform(value: Object, args: string[]): { key: any, value: any }[] {
        let keys = [];
        for (var member in value) {
            if (value.hasOwnProperty(member)) {
                keys.push({ key: member, value: value[member] });
            }
        }
        return keys;
    }
}