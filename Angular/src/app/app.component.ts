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
        'https://mediavideo.cnrs.fr/media/visionnage/1703857449.64990500/M03013_logo_00595901_01194501.mp4',
        1186.069333,
        2,
        [],
        'green'
      ),
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1703857124.40809200/F00434_logo_00000000_00232720.mp4',
        1407.829333,
        1,
        this.pointOfInterestMarkers,
        'black'
      ),
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1703857629.46074500/MN01473_logo_00000000_00031507.mp4',
        195.306667,
        3,
        [], 
        'lime'
      ),
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1703857924.85440200/M01290_logo_01000000_03384408.mp4',
        9524.352,
        3,
        [],
        'purple'
      ),
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1703858070.03604500/MN02937_logo_00000000_11592424.mp4',
        43164.905,
        3,
        [],
        'silver'
      ),
    ];
  }

  PlayPauseStopMethod(e: string) {
    // console.log(e);
  }

  seekMethod(e: number) {
    // console.log(e);
  }
}
