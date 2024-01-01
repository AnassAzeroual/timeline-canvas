import { VideoList } from "./VideoList.model";
const temp = memoryRead('context');
export class Context {
    public default:any
    constructor(
        public totalDurationInSeconds = 0,
        public currentVideo: VideoList = new VideoList(),
        public allVideos: VideoList[] = [],
    ) {
        this.totalDurationInSeconds = temp?.totalDurationInSeconds ?? totalDurationInSeconds;
        this.currentVideo = temp?.currentVideo ?? currentVideo;
        this.allVideos = temp?.allVideos ?? allVideos;
    }
}

function memoryRead(name: string) {
    return JSON.parse(localStorage.getItem(name) as string);
}
export type ContextKeys = keyof Context;

