import { Component, ElementRef, ViewChild } from '@angular/core';
import { PointOfInterest } from './custom-video-timeline/classes/PointOfInterest.model';
import { VideoList } from './custom-video-timeline/classes/VideoList.model';
import { ToolsService } from './custom-video-timeline/services/tools.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'timelinePro';
  pointOfInterestMarkers: PointOfInterest[] = [];
  videoList: VideoList[] = [];

  constructor(private srvTools: ToolsService) {
    this.pointOfInterestMarkers = [
      { title: 'Fire', timeInSecondes: 1800, color: '#FF5733' },
      { title: 'Humidity', timeInSecondes: 5000, color: '#cd0cca' },
    ];
    
  }

  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.videoList = await this.srvTools.loadAndRetrieveDurations([
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1704112388.38894300/MN00734_logo_01000000_01250000.mp4',
        0,
        2,
        [],
        'green'
      ),
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1704112419.32380900/MN00699_logo_01000000_01145402.mp4',
        0,
        1,
        this.pointOfInterestMarkers,
        'black'
      ),
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1704112145.86600700/M00216_logo_10000000_10250103.mp4',
        0,
        3,
        [], 
        'lime'
      ),
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1704112573.91903300/MN00878_logo_00595700_01381014.mp4',
        0,
        3,
        [],
        'purple'
      ),
      new VideoList(
        'https://mediavideo.cnrs.fr/media/visionnage/1704112750.35448400/MN00661_logo_00000000_00230001.mp4',
        0,
        3,
        [],
        'silver'
      ),
    ]);
  }

  PlayPauseStopMethod(e: string) {
    // console.log(e);
  }

  seekMethod(e: number) {
    // console.log(e);
  }
}
