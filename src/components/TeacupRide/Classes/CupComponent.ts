import * as THREE from 'three';
import {Group, Object3DEventMap} from "three";
import FlatRide from './FlatRide';

class CupComponent extends FlatRide {
    private config: {
        bodyColor: string;
        handleColor: string;
        size: { handleLength: number; width: number; height: number, depth: number };
        rotationVariance: number
    };

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

        this.config = {
            bodyColor: 'pink',
            handleColor: 'darkpink',
            size: {
                width: 8,
                height: 2,
                depth: 6,
                handleLength: 1
            },
            rotationVariance: 0.02,
            ...config
        };
    }

    // Generate cup geometry
    createGeometry() {
        return {
            body: new THREE.BoxGeometry(
                this.config.size.width,
                this.config.size.height,
                this.config.size.depth,
                32
            ),
            handle: new THREE.BoxGeometry(
                0.2, 0.2,
                this.config.size.handleLength,
                16
            )
        };
    }

    // Apply dynamic cup behavior
    animateCup(cupRef: React.RefObject<Group<Object3DEventMap>>, _delta: any) {
        if (cupRef.current) {
            // Add rotation to the cup
        }
    }

    start(): void {
        this.isRunning = true;
        console.log(`${this.name} started.`);
    }

    stop(): void {
        this.isRunning = false;
        console.log(`${this.name} stopped.`);
    }

    openGates(): void {
        this.gates = true;
        console.log(`${this.name} gates opened.`);
    }

    closeGates(): void {
        this.gates = false;
        console.log(`${this.name} gates closed.`);
    }

    updateRideState(): void {
        console.log(`${this.name} state updated.`);
    }
}

export default CupComponent;
