import FlatRide from './FlatRide';

class RideMechanics extends FlatRide {
    public config: {
        subPlatformVariance: number;
        cupCount: number;
        mainPlatformRadius: number;
        baseRotationSpeed: number;
        subPlatformRadius: number;
        distanceFromCenter: number;
    };
    private state: { intensity: number; specialEffects: any[]; isActive: boolean, restraintsOpen: boolean, gatesOpen: boolean};

    constructor(config = {}) {
        super(
            4, // seats
            1, // groupedSeats
            'Teacup Ride', // name
            60, // duration
            false, // gates
            false, // isOpen
            false, // isRunning
            [], // queue
            {}, // operatorControl
            [] // objects
        );

        // Base configuration for ride mechanics
        this.config = {
            mainPlatformRadius: 20,
            subPlatformRadius: 6,
            cupCount: 4,
            baseRotationSpeed: 0.005,
            subPlatformVariance: 0.01,
            distanceFromCenter: 12,
            ...config
        };

        // Ride state tracking
        this.state = {
            isActive: false,
            intensity: 0,
            specialEffects: [],
            restraintsOpen: false,
            gatesOpen: false
        };
        // Bind methods to the correct `this` context
        this.canDispatch = this.canDispatch.bind(this);
        this.openGates = this.openGates.bind(this);
        this.closeGates = this.closeGates.bind(this);
        this.openRestraints = this.openRestraints.bind(this);
        this.closeRestraints = this.closeRestraints.bind(this);
        this.startRide = this.startRide.bind(this);
        this.stopRide = this.stopRide.bind(this);
    }
    canDispatch(): boolean {
        if (this.state.gatesOpen  || this.state.restraintsOpen) {
            return false;
        }else {
            return true;
        }

    }

    //status gates

    getGatesStatus() {
        return this.state.gatesOpen;
    }


    //status restraints

    getRestraintsStatus() {
        return this.state.restraintsOpen;
    }

    // Open the ride gates
    openGates() {
        this.state.gatesOpen = true;
        console.log("Gates Opened");
    }

    // Close the ride gates
    closeGates() {
        this.state.gatesOpen = false;
        console.log("Gates Closed");
    }

    // Open the restraints
    openRestraints() {
        this.state.restraintsOpen = true;
        console.log("Restraints Opened");
    }

    // Close the restraints
    closeRestraints() {
        this.state.restraintsOpen = false;
        console.log("Restraints Closed");
    }

    // Start the ride
    startRide() {
        if (!this.canDispatch()) {
            console.log("Ride is not ready to dispatch");
        } else {
            this.state.isActive = true;
        }
    }

    // Stop the ride
    stopRide() {
        this.state.isActive = false;
    }

    getState() {
        return this.state;
    }

    // Calculate sub-platform positions
    calculateSubPlatformPositions() {
        const positions = [];
        const angleStep = (2 * Math.PI) / this.config.cupCount;

        for (let i = 0; i < this.config.cupCount; i++) {
            const angle = i * angleStep;
            positions.push({
                x: Math.cos(angle) * this.config.distanceFromCenter,
                y: 1.5,
                z: Math.sin(angle) * this.config.distanceFromCenter

            });
        }

        return positions;
    }

    // Simulate ride intensity and effects
    updateRideIntensity(_delta: any) {
        // Simulate dynamic intensity changes
        if (this.state.isActive) {
            this.state.intensity = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
        }
    }
}

export default RideMechanics;
