import { Component, ElementRef, ViewChild } from '@angular/core';
import { PointOfInterest } from './custom-video-timeline/classes/PointOfInterest.model';
import { VideoList } from './custom-video-timeline/classes/VideoList.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'timelinePro';
  pointOfInterestMarkers: PointOfInterest[] = [];
  videoList: VideoList[] = []

  constructor() {
    this.pointOfInterestMarkers = [
      { title: 'Fire', timeInSecondes: 1800, color: '#FF5733' },
      { title: 'Humidity', timeInSecondes: 5000, color: '#cd0cca' },
    ];
    this.videoList = [
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1703688473.60407700/MN03211_logo_00000000_00103202.mp4',
        (300),
        1,
        this.pointOfInterestMarkers,
        'orange'
      ),
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1703714974.74221000/MN01218_logo_00000000_00054005.mp4',
        (3600+3600+3600+3600+3600+3600),
        2,
        [],
        'red'
      ),
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1703715409.37637700/MN02936_logo_00000000_06101614.mp4',
        14500,
        3,
        [],
        'purple'
      ),
    ];
  }

  PlayPauseStopMethod(e: string) {
    console.log(e);
  }

  seekMethod(e: number) {
    console.log(e);
  }
}
