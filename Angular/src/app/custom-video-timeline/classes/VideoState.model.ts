import { VideoList } from "./VideoList.model";
export class Context {
    public default:any
    constructor(
        public totalTimelineInSeconds = 60*60*24,
        public totalDurationInSeconds = 0,
        public canvasWidth = 0,
        public canvasHeight = 0,
        public currentVideo: VideoList = new VideoList(),
        public allVideos: VideoList[] = [],
    ) {
        this.totalTimelineInSeconds = totalTimelineInSeconds;
        this.totalDurationInSeconds = totalDurationInSeconds;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.currentVideo = currentVideo;
        this.allVideos = allVideos;
    }
}
export type ContextKeys = keyof Context;

