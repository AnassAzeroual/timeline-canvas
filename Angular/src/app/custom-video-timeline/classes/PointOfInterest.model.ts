export class PointOfInterest {

    constructor(
        public timeInSecondes: number = 0,
        public title = 'unknown',
        public color = 'black',
    ) {
        this.timeInSecondes = timeInSecondes;
        this.title = title;
        this.color = color;
    }
}