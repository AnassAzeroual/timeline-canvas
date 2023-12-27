import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToHours'
})
export class SecondsToHoursPipe implements PipeTransform {

  transform(value: number): string {
       const hours: number = Math.floor(value / 3600);
       const minutes: number = Math.floor(value % 3600);
       return hours + ':' + minutes;
    }

}