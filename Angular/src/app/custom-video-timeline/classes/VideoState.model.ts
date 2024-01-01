import { VideoList } from "./VideoList.model";
const temp = memoryRead('context');
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
        this.totalTimelineInSeconds = temp?.totalTimelineInSeconds ?? totalTimelineInSeconds;
        this.totalDurationInSeconds = temp?.totalDurationInSeconds ?? totalDurationInSeconds;
        this.canvasWidth = temp?.canvasWidth ?? canvasWidth;
        this.canvasHeight = temp?.canvasHeight ?? canvasHeight;
        this.currentVideo = temp?.currentVideo ?? currentVideo;
        this.allVideos = temp?.allVideos ?? allVideos;
    }
}

function memoryRead(name: string) {
    return JSON.parse(localStorage.getItem(name) as string);
}
export type ContextKeys = keyof Context;

