import * as THREE from 'three';


class CupComponent {
    private config: {
        bodyColor: string;
        handleColor: string;
        size: { handleLength: number; radius: number; height: number };
        rotationVariance: number
    };

    constructor(config = {}) {
        this.config = {
            bodyColor: 'pink',
            handleColor: 'darkpink',
            size: {
                radius: 1.5,
                height: 2,
                handleLength: 1
            },
            rotationVariance: 0.02,
            ...config
        };

    }

    // Generate cup geometry
    createGeometry() {
        return {
            body: new THREE.CylinderGeometry(
                this.config.size.radius,
                this.config.size.radius,
                this.config.size.height,
                32
            ),
            handle: new THREE.CylinderGeometry(
                0.2, 0.2,
                this.config.size.handleLength,
                16
            )
        };
    }

    // Apply dynamic cup behavior
    animateCup(cupRef: React.MutableRefObject<undefined>, _delta: any) {
        if (cupRef.current) {
            // Add rotation to the cup
            cupRef.current.rotation.y += this.config.rotationVariance;
        }
    }
}

export default CupComponent;