import { Injectable } from '@angular/core';
import { Context, ContextKeys } from '../classes/VideoState.model';
import { VideoList } from '../classes/VideoList.model';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  context: Context = new Context();
  constructor() { }

  randomHexColor(colorsToAvoid: string[] = []) {
    let colors: string[] = [
      "#000000", "#001F3F", "#228B22", "#8B0000", "#FF8C00",
      "#9400D3", "#008080", "#D2691E", "#d41e1e", "#708090",
      "#4B0082", "#800000", "#A0522D", "#008B8B", "#483D8B",
      "#8B4513", "#556B2F", "#191970", "#B22222", "#4682B4"
    ];
    colors = colors.filter(v => !colorsToAvoid.includes(v))
    const randomIndex = Math.floor(Math.random() * colors.length);

    return colors[randomIndex];
  }

  async loadAndRetrieveDurations(videos: VideoList[]): Promise<VideoList[]> {
    for (const video of videos) {
      video.durationInSeconds = await this.getVideoDuration(video.source);
    }
    return videos
  }

  private async getVideoDuration(videoPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        resolve(video.duration);
        // Clean up: remove the video element from the DOM
        document.body.removeChild(video);
      };

      video.onerror = (error) => {
        reject(error);
        // Clean up: remove the video element from the DOM
        document.body.removeChild(video);
      };

      video.src = videoPath;
      // Append the video element to the body to trigger loading
      document.body.appendChild(video);
    });
  }

  setContext(key: ContextKeys = 'default', value: any = null) {
    this.context[key] = value;
    this.memoryAdd('context', this.context);
  }
  getContext() {
    return this.context;
  }

  findInContext(key: ContextKeys) {
    return this.context[key];
  }

  memoryAdd(name: string, value: any) {
    localStorage.setItem(name, JSON.stringify(value));
  }

  memoryRead(name: string) {
    return JSON.parse(localStorage.getItem(name) as string) ?? [];
  }

}
