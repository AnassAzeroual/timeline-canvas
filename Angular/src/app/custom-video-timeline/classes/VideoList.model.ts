import { PointOfInterest } from "./PointOfInterest.model";

export class VideoList {
    constructor(
        public source = '',
        public durationInSeconds = 0,
        public order = 0,
        public pointOfInterest:PointOfInterest[] = [],
        public backgroundColor:string = 'black',
        public videoState : 'waiting' | 'ended' | 'playing' | 'loadedmetadata' | 'timeupdate' | '' = '',
        public id: number = Math.floor(Math.random() * 10000000) + 1
    ) {
        this.source = source;
        this.durationInSeconds = durationInSeconds;
        this.order = order;
        this.pointOfInterest = pointOfInterest;
        this.backgroundColor = backgroundColor;
        this.videoState = videoState;
    }
}