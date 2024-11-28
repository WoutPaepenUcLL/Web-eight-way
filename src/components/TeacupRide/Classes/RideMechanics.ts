import {dispose} from "@react-three/fiber";


class RideMechanics {
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
    }
    canDispatch(): boolean {
        if (this.state.gatesOpen  || this.state.restraintsOpen) {
            return false;
        }else {
            return true;
        }

    }
    // Open the ride gates
    openGates() {
        this.state.gatesOpen = true;
    }

    // Close the ride gates
    closeGates() {
        this.state.gatesOpen = false;
    }

    // Open the restraints
    openRestraints() {
        this.state.restraintsOpen = true;
    }

    // Close the restraints
    closeRestraints() {
        this.state.restraintsOpen = false;
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