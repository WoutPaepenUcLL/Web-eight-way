abstract class FlatRide {
    seats: number;
    groupedSeats: number;
    name: string;
    duration: number;
    gates: boolean;
    isOpen: boolean;
    isRunning: boolean;
    queue: any[];
    operatorControl: any;
    objects: any[];

    constructor(
        seats: number,
        groupedSeats: number,
        name: string,
        duration: number,
        gates: boolean,
        isOpen: boolean,
        isRunning: boolean,
        queue: any[],
        operatorControl: any,
        objects: any[]
    ) {
        this.seats = seats;
        this.groupedSeats = groupedSeats;
        this.name = name;
        this.duration = duration;
        this.gates = gates;
        this.isOpen = isOpen;
        this.isRunning = isRunning;
        this.queue = queue;
        this.operatorControl = operatorControl;
        this.objects = objects;
    }

    abstract start(): void;
    abstract stop(): void;
    abstract openGates(): void;
    abstract closeGates(): void;
    abstract updateRideState(): void;
}
