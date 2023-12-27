import { Component, ElementRef, ViewChild } from '@angular/core';
import { PointOfInterest } from './custom-video-timeline/classes/PointOfInterest.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'timelinePro';
  pointOfInterestMarkers: PointOfInterest[];

  constructor() {
    this.pointOfInterestMarkers = [
      { title: 'Fire', timeInSecondes: 1800, color: '#FF5733' },
      { title: 'Humidity', timeInSecondes: 7200, color: '#cd0cca' },
    ];
  }
}
