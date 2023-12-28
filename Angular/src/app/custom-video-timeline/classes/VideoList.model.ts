import { PointOfInterest } from "./PointOfInterest.model";

export class VideoList {
    constructor(
        public source = '',
        public durationInSeconds = 0,
        public order = 0,
        public pointOfInterest:PointOfInterest[] = [],
        public backgroundColor:string = 'black'
    ) {
        this.source = source;
        this.durationInSeconds = durationInSeconds;
        this.order = order;
        this.pointOfInterest = pointOfInterest;
        this.backgroundColor = backgroundColor;
    }
}