import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PointOfInterest } from './classes/PointOfInterest.model';
import { ToolsService } from './services/tools.service';
import { VideoList } from './classes/VideoList.model';

@Component({
  selector: 'custom-video-timeline',
  templateUrl: './custom-video-timeline.component.html',
  styleUrls: ['./custom-video-timeline.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CustomVideoTimelineComponent implements OnInit, AfterViewInit {
  /* -------------------------------------------------------------------------- */
  /*                           @Inputs and Properties                           */
  /* -------------------------------------------------------------------------- */
  // pointOfInterestMarkers: PointOfInterest[] = [];
  // @Input('PointOfInterest') set newPointOfInterestMethod(list: PointOfInterest[]) {
  //   this.pointOfInterestMarkers = list
  // }
  showPreview: boolean = true;
  @Input('ShowPreview') set newShowPreviewMethod(list: boolean) {
    this.showPreview = list;
  }
  videoList: VideoList[] = [];
  @Input('VideoList') set newVideoListMethod(list: VideoList[]) {
    this.videoList = list;
  }
  CanvasHeight: number = 120;
  @Input('CanvasHeight') set newCanvasHeightMethod(list: number) {
    if (list < 120) return
    this.CanvasHeight = list;
  }
  /* -------------------------------------------------------------------------- */
  /*                                  @Outputs                                  */
  /* -------------------------------------------------------------------------- */
  @Output('PlayPauseStop') playPauseStopEmitter = new EventEmitter<'Play' | 'Pause' | 'Stop'>();
  @Output('Seek') seekEmitter = new EventEmitter<number>();


  @ViewChild('timelineCanvas', { static: true }) canvasRef!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  private video!: HTMLVideoElement;

  private lastTimestamp = new Date();
  private isShowingPreviewLine = false;
  private previewLineX = 0;
  private totalTime = 60 * 60 * 24;
  private indicatorHeight = 40;
  private animationSpeed = 1;
  private lineColors: string[] = [];
  public isAnimating = false;
  public currentTimeInSeconds = 0;

  constructor(private tools: ToolsService) { }

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.video = document.getElementById('myVideo') as HTMLVideoElement;

    this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasRef.nativeElement.height = this.CanvasHeight;

    this.video.addEventListener('loadedmetadata', () => {
      console.log(this.video.duration);
      
      this.drawTimeline();
    });

    this.video.addEventListener('timeupdate', () => {
      this.currentTimeInSeconds = this.video.currentTime;
      this.drawTimeline();
    });

    this.video.addEventListener('waiting', () => {
      this.onVideoWaiting();
    });
  
    this.video.addEventListener('playing', () => {
      this.onVideoPlaying();
    });
  
    this.video.addEventListener('ended', () => {
      this.onVideoEnded();
    });
    for (let i = 0; i < this.videoList.length; i++) {
      this.lineColors.push(this.tools.randomHexColor(this.lineColors))
    }
  }
  ngAfterViewInit(): void {
    this.addEventListeners();
  }
  addEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());
    this.canvasRef.nativeElement.addEventListener('click', (event: any) =>
      this.selectTimeAndSeekVideo(event)
    );
    this.canvasRef.nativeElement.addEventListener('mousemove', (event: any) =>
      this.showTimePreview(event)
    );
    this.canvasRef.nativeElement.addEventListener('mouseleave', () =>
      this.hideTimePreview()
    );
  }
  drawVideoDurationLine(video: VideoList[], i: number) {
    let lineY = this.canvasRef.nativeElement.height / 1.3;
    this.ctx.lineWidth = 12;
    this.ctx.strokeStyle = video[i].backgroundColor;
    let startX = 0;
    for (let idx = 0; idx < i; idx++) {
      startX += (video[idx].durationInSeconds / this.totalTime) * this.canvasRef.nativeElement.width;
    }

    const endX = ((video[i].durationInSeconds / this.totalTime) * this.canvasRef.nativeElement.width) + startX;

    this.ctx.beginPath();
    this.ctx.moveTo((startX), lineY);
    this.ctx.lineTo(endX, lineY);
    this.ctx.stroke();
  }

  drawTimeline() {
    this.ctx.clearRect(
      0,
      0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );

    this.drawGraduationStepsHours(3600, '|', 18, '#ce1b24', 16);
    this.drawGraduationStepsHalfHours(1800, 10, '#34a853');
    this.drawGraduationStepsMinutes(300, '|', 18, '#fbbc05', 8);

    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(
      0,
      20,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height - 20
    );

    this.drawTimeLabels(3600, 40);
    for (let i = 0; i < this.videoList.length; i++) {
      const video = this.videoList[i];
      this.drawVideoDurationLine(this.videoList, i);
      this.drawMarkers(video.pointOfInterest);
    }

    const indicatorX =
      (this.currentTimeInSeconds / this.totalTime) *
      this.canvasRef.nativeElement.width;
    this.drawCustomIndicator(indicatorX);

    this.drawPreviewLine();

    if (this.isAnimating) {
      requestAnimationFrame(() => {
        this.drawTimeline();
        this.updateTimeline();
      });
    }
  }

  drawPreviewLine() {
    if (this.isShowingPreviewLine && this.showPreview) {
      // Draw the red vertical line
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(this.previewLineX, 20);
      this.ctx.lineTo(this.previewLineX, this.canvasRef.nativeElement.height);
      this.ctx.stroke();

      // Draw the time below the line
      const previewedTimeInSeconds =
        (this.previewLineX / this.canvasRef.nativeElement.width) *
        this.totalTime;
      const previewedTimeFormatted = this.formatTime(previewedTimeInSeconds);
      this.ctx.fillStyle = 'red';
      this.ctx.textAlign = 'start';
      this.ctx.fillText(
        previewedTimeFormatted,
        this.previewLineX,
        this.canvasRef.nativeElement.height - 5
      );
    }
  }
  drawMarkers(markers: PointOfInterest[]) {
    markers.forEach(
      (marker: PointOfInterest) => {
        const markerX =
          (marker.timeInSecondes / this.totalTime) * this.canvasRef.nativeElement.width;
        const markerY = 10;

        this.ctx.fillStyle = marker.color;
        this.ctx.beginPath();
        this.ctx.arc(markerX, markerY, 5, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = marker.color;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(marker.title, markerX, markerY + 45);
      }
    );
  }

  drawCustomIndicator(x: number) {
    const indicatorColor = '#4CAF50';
    const shadowColor = 'rgba(0, 0, 0, 0.3)';
    const shadowBlur = 5;

    this.ctx.shadowColor = shadowColor;
    this.ctx.shadowBlur = shadowBlur;

    this.ctx.fillStyle = indicatorColor;
    this.ctx.beginPath();
    this.ctx.moveTo(x, 20);
    this.ctx.lineTo(x, 20 + this.indicatorHeight);
    this.ctx.arc(x, 20 + this.indicatorHeight, 5, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;

    const currentTimeFormatted = this.formatTime(
      this.currentTimeInSeconds,
      true
    );
    this.ctx.fillStyle = '#000';
    this.ctx.textAlign = 'start';
    this.ctx.fillText(currentTimeFormatted, x, 20 + this.indicatorHeight + 15);
  }

  drawGraduationStepsHours(
    interval: number,
    symbol: string,
    y: number,
    color: string | CanvasGradient | CanvasPattern,
    fontSize: number
  ) {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px Arial`;
    for (let i = 0; i <= this.totalTime; i += interval) {
      const x = (i / this.totalTime) * this.canvasRef.nativeElement.width;
      this.ctx.fillText(symbol, x - 2, y);
    }
  }

  drawGraduationStepsMinutes(
    interval: number,
    symbol: string,
    y: number,
    color: string | CanvasGradient | CanvasPattern,
    fontSize: number
  ) {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px Arial`;
    for (let i = 0; i <= this.totalTime; i += interval) {
      if (i % 1800 !== 0) {
        const x = (i / this.totalTime) * this.canvasRef.nativeElement.width;
        this.ctx.fillText(symbol, x, y);
      }
    }
  }

  drawGraduationStepsHalfHours(
    interval: number,
    height: number,
    color: string | CanvasGradient | CanvasPattern
  ) {
    this.ctx.fillStyle = color;
    this.ctx.font = '8px Arial';
    for (let i = 0; i <= this.totalTime; i += interval) {
      if (i % 3600) {
        const x = (i / this.totalTime) * this.canvasRef.nativeElement.width;
        this.ctx.fillRect(x - 1, 10, 3, height);
      }
    }
  }

  drawTimeLabels(interval: number, y: number) {
    this.ctx.fillStyle = '#333';
    this.ctx.font = '12px Arial';
    for (let i = 0; i <= this.totalTime; i += interval) {
      const x = (i / this.totalTime) * this.canvasRef.nativeElement.width;
      const formattedTime = this.formatTime(i);
      this.ctx.fillText(formattedTime, x, y);
    }
  }

  updateTimeline() {
    const now = new Date();
    const elapsedMilliseconds = now.getTime() - this.lastTimestamp.getTime();
    const elapsedSeconds = elapsedMilliseconds / 1000;

    // Update timeline only if the video is not ended
    if (!this.video.ended) {
      this.currentTimeInSeconds += elapsedSeconds * this.animationSpeed;
    }

    if (this.currentTimeInSeconds >= this.totalTime) {
      this.currentTimeInSeconds = 0;
      this.onStopButtonClick();
    }

    this.lastTimestamp = now;
  }

  formatTime(seconds: number, isIndicator = false) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (isIndicator) {
      return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
    } else if (this.canvasRef.nativeElement.width < 1200) {
      return `${this.padZero(hours)}:${this.padZero(minutes)}`;
    } else {
      return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
    }
  }

  padZero(num: number) {
    return num < 10 ? `0${num}` : num;
  }

  showTimePreview(event: { clientX: any }) {
    const mouseX = event.clientX;
    const previewedTimeInSeconds =
      (mouseX / this.canvasRef.nativeElement.width) * this.totalTime;
    this.previewLineX = mouseX;
    // console.log('Previewed Time: ' + this.formatTime(previewedTimeInSeconds));
    this.isShowingPreviewLine = true;
    this.drawTimeline();
  }

  hideTimePreview() {
    this.isShowingPreviewLine = false;
    this.drawTimeline();
  }

  onStartButtonClick() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.lastTimestamp = new Date();
      this.playPauseStopEmitter.emit('Play');
      this.video.play();
    }
  }
  
  onPauseButtonClick() {
    if (this.isAnimating) {
      this.isAnimating = false;
      this.playPauseStopEmitter.emit('Pause');
      this.video.pause();
    }
  }

  onStopButtonClick() {
    this.isAnimating = false;
    this.playPauseStopEmitter.emit('Stop');
    this.video.pause();
    this.video.currentTime = 0;
    this.currentTimeInSeconds = 0;
    this.drawTimeline();
  }

  onTenSecondsBackwardButtonClick() {
    // this.isAnimating = false;
    this.currentTimeInSeconds = this.currentTimeInSeconds - 10;
    this.video.currentTime = this.currentTimeInSeconds;
    this.seekEmitter.emit(this.video.currentTime);
    if (this.isAnimating) {
      this.lastTimestamp = new Date();
      requestAnimationFrame(() => this.drawTimeline());
    }
  }

  onTenSecondsForwardButtonClick() {
    return
    this.animationSpeed *= 4;
    const maxSpeed = 2000;
    if (this.animationSpeed > maxSpeed) {
      this.animationSpeed = maxSpeed;
    }

    if (this.isAnimating) {
      this.lastTimestamp = new Date();
      requestAnimationFrame(() => this.drawTimeline());
    }
  }

  onFastForwardButtonClick() {
    this.animationSpeed *= 4;
    const maxSpeed = 2000;
    if (this.animationSpeed > maxSpeed) {
      this.animationSpeed = maxSpeed;
    }

    if (this.isAnimating) {
      this.lastTimestamp = new Date();
      requestAnimationFrame(() => this.drawTimeline());
    }
  }

  onSlowForwardButtonClick() {
    this.animationSpeed = 0.5;
    if (this.isAnimating) {
      this.lastTimestamp = new Date();
      requestAnimationFrame(() => this.drawTimeline());
    }
  }

  onNormalSpeedButtonClick() {
    this.animationSpeed = 1;
    if (this.isAnimating) {
      this.lastTimestamp = new Date();
      requestAnimationFrame(() => this.drawTimeline());
    }
  }

  onWindowResize() {
    this.canvasRef.nativeElement.width = window.innerWidth;
    this.drawTimeline();
  }

  onVideoWaiting() {
    // Video is buffering, stop the animation or perform any other actions
    this.isAnimating = false;
    this.drawTimeline();
  }
  
  onVideoPlaying() {
    // Video is playing after buffering, resume animation or perform any other actions
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.lastTimestamp = new Date();
      this.playPauseStopEmitter.emit('Play');
      // Resume other actions as needed
    }
  }

  onVideoEnded() {
    this.isAnimating = false;
    this.drawTimeline(); // Stop the animation
    this.playPauseStopEmitter.emit('Stop');
    // You can add any additional actions needed when the video ends
  }
  

  selectTimeAndSeekVideo(event: { clientX: any }) {
    const mouseX = event.clientX;
    const timelineSelectedTimeInSeconds = (mouseX / this.canvasRef.nativeElement.width) * this.totalTime;
    this.currentTimeInSeconds = timelineSelectedTimeInSeconds;
    this.video.currentTime = timelineSelectedTimeInSeconds;
    this.seekEmitter.emit(timelineSelectedTimeInSeconds);
    this.drawTimeline();
  }
}
