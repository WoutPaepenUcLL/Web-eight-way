import {useEffect, useRef, useState,} from 'react';
import {useFrame} from "@react-three/fiber";
import Teacups from "./Teacups.tsx";
import * as THREE from "three";
import {Html} from "@react-three/drei";
import TeacupControlUnit from "./Teacup.ControlUnit.tsx";
import useRideStore from "./RideStore.ts";
import {update} from "@tweenjs/tween.js";
import {PerspectiveCamera} from "@react-three/drei";
import RideMechanics from "./Classes/RideMechanics";
import CupComponent from "./Classes/CupComponent";

interface PlatformAnimation {
    name: string;
    time: number;
    rotationY: number;
    rotationX: number;
    rotationZ: number;
}

function TeaCupRide() {
    const {
        rides,
        addRide,
        startRide,
        stopRide,
        openGates,
        closeGates,
        updateRideState,
    } = useRideStore();

    const [selectedRide, setSelectedRide] = useState<RideMechanics | null>(null);

    useEffect(() => {
        const rideMechanics = new RideMechanics();
        const cupComponent = new CupComponent();
        addRide(rideMechanics);
        addRide(cupComponent);
        setSelectedRide(rideMechanics);
    }, [addRide]);

    //camera states
    const cameraRef = useRef<PerspectiveCamera>(null!);
    const cupRef = useRef<THREE.Group>(null!); // Ref to the specific cup you want to attach the camera to
    const [cameraAttached, setCameraAttached] = useState(false);

    const mainPlatformRef = useRef<THREE.Group>(null);
    const subPlatformRefs = useRef<(THREE.Group | null)[]>([]);

    const [animationStartTime, setAnimationStartTime] = useState<number | null>(null);

    const [mainPlatformAnimation, setMainPlatformAnimation] = useState<PlatformAnimation[]>([]);
    const [currentAnimation, setCurrentAnimation] = useState<PlatformAnimation | null>(null);

    const cameraOffset = new THREE.Vector3(0, 3, 5);

    useEffect(() => {
        // Load main platform animation from JSON
        fetch('/main_platform_animation.json') // Adjust path as needed
            .then(response => response.json())
            .then(animationData => setMainPlatformAnimation(animationData));

        if (cupRef.current && cameraRef.current && !cameraAttached) {
            cupRef.current.add(cameraRef.current);  // Make camera a child of the cup
            setCameraAttached(true); // Prevent repeated attachment
        }
    }, []);

    const handleRide = (delta: number) => {
        if (mainPlatformAnimation.length > 0 && mainPlatformRef.current) {
            if (animationStartTime === null) {
                setAnimationStartTime(Date.now());
            }

            const currentTime = (Date.now() - animationStartTime!) / 1000;
            // Find the correct animation segment

            let nextAnimationIndex = mainPlatformAnimation.findIndex(anim => anim.time >= currentTime);
            const currentAnimationIndex = Math.max(0, nextAnimationIndex - 1);

            if (nextAnimationIndex === -1) {
                // Reached end of animation loop back or stop
                nextAnimationIndex = 0; // Loop back to the start if needed
                setAnimationStartTime(Date.now()) // reset
            }

            const currentAnim = mainPlatformAnimation[currentAnimationIndex];
            const nextAnim = mainPlatformAnimation[nextAnimationIndex];
            if (currentAnimation !== currentAnim) {
                setCurrentAnimation(currentAnim);
                console.log(`Switching to animation: ${currentAnim.name}`);
            }
            const maxTilt = Math.PI / 4; // Maximum tilt angle in radians

            const segmentStartTime = currentAnim.time;
            const segmentEndTime = nextAnim.time;

            // Calculate easing between current and next frame
            const alpha = (currentTime - segmentStartTime) / (segmentEndTime - segmentStartTime);

            const targetRotation = new THREE.Euler(
                nextAnim.rotationX * alpha + currentAnim.rotationX * (1 - alpha), //rotation x
                nextAnim.rotationY * alpha + currentAnim.rotationY * (1 - alpha), //rotation y
                nextAnim.rotationZ * alpha + currentAnim.rotationZ * (1 - alpha) //rotation z
            );

            targetRotation.x = Math.min(maxTilt, Math.max(-maxTilt, targetRotation.x)); // Clamp tilt angle
            targetRotation.z = Math.min(maxTilt, Math.max(-maxTilt, targetRotation.z)); // Clamp tilt angle
            // Apply rotation to main platform.
            mainPlatformRef.current.setRotationFromEuler(targetRotation);

            // Rotate sub-platforms (child of main platform, inheritance handled by Three.js)
            subPlatformRefs.current.forEach((ref, index) => {
                if (ref) {
                    ref.rotation.y += selectedRide?.config.baseRotationSpeed * (index + 1) * delta;
                }
            });
        }

        if (subPlatformRefs.current[1] && cameraRef.current) {
            const subPlatformPosition = new THREE.Vector3();
            subPlatformRefs.current[1].getWorldPosition(subPlatformPosition); // Get world position and rotation

            // Move camera to a position offset from the subplatform and set rotation
            cameraRef.current.setRotationFromEuler(subPlatformRefs.current[1].rotation);
            const cameraPosition = subPlatformPosition.clone().add(cameraOffset);
            cameraRef.current.position.copy(cameraPosition);
        }

        update(delta) // Update tweening
    }

    useFrame((_state, delta) => {
        if (selectedRide?.isRunning) {
            handleRide(delta);
            if (selectedRide?.duration && Date.now() - selectedRide?.duration >= 60000) {
                stopRide(selectedRide.name);
                console.log('Ride stopped after 1 minute.');
            }
        }
    });

    return (
        <>
            <Html>
                <TeacupControlUnit />
            </Html>
            <group ref={mainPlatformRef}>
                {/* Base Platform */}
                <mesh>
                    <cylinderGeometry args={[selectedRide?.config.mainPlatformRadius, selectedRide?.config.mainPlatformRadius, 1, 64]} />
                    <meshStandardMaterial color="gray" />
                </mesh>

                {/* Sub-platforms with Cups */}
                {selectedRide?.calculateSubPlatformPositions().map((pos: { x: number; y: number; z: number; }, index: number | undefined) => (
                    <group
                        key={index}
                        ref={el => subPlatformRefs.current[index ? index : 8] = el}
                        position={[pos.x, pos.y, pos.z]}
                    >
                        {/* Sub-platform */}
                        <mesh>
                            <cylinderGeometry args={[selectedRide?.config.subPlatformRadius, selectedRide?.config.subPlatformRadius, 0.5, 32]} />
                            <meshStandardMaterial color="lightblue" />
                        </mesh>

                        {/* Cup */}
                        <Teacups
                            config={{
                                bodyColor: `hsl(${index ? index * 90 : 10}, 70%, 60%)`,
                                handleColor: `hsl(${index ? index * 90 + 30 : 30}, 70%, 50%)`
                            }}
                        />
                        {index === 0 && (
                            <PerspectiveCamera
                                makeDefault
                                fov={75}
                                near={0.1}
                                far={1000}
                                position={[pos.x - 9, pos.y + 5, pos.z]}
                            />
                        )}
                    </group>
                ))}
            </group>
        </>
    );
}

export default TeaCupRide;
