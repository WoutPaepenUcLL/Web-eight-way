import * as THREE from 'three';
import {Group, Object3DEventMap} from "three";


class CupComponent {
    private config: {
        bodyColor: string;
        handleColor: string;
        size: { handleLength: number; width: number; height: number,depth:number };
        rotationVariance: number
    };

    constructor(config = {}) {
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
    animateCup(cupRef: React.RefObject<Group<Object3DEventMap>> , _delta: any) {
        if (cupRef.current) {
            // Add rotation to the cup
        }
    }
}

export default CupComponent;