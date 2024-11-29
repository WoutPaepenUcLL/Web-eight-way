import {useEffect, useRef, useState,} from 'react';
import {useFrame} from "@react-three/fiber";
import Teacups from "./Teacups.tsx";
import * as THREE from "three";
import {Html} from "@react-three/drei";
import TeacupControlUnit from "./Teacup.ControlUnit.tsx";
import useRideStore from "./RideStore.ts";
import {update} from "@tweenjs/tween.js";
import {PerspectiveCamera} from "@react-three/drei";

interface PlatformAnimation {
    name: string;
    time: number;
    rotationY: number;
    rotationX: number;
    rotationZ: number;
}


function TeaCupRide() {
    const {
        isActive,
        runningTime,
        intensity,
        stopRide,
        updateIntensity,
        calculateSubPlatformPositions,
        rideConfig
    } = useRideStore();

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
    const subPlatformPositions = calculateSubPlatformPositions();

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

    const handleRide = (delta: number) =>
    {
        /*
        const mainRotation = useRideStore.getState().mainPlatformRotation + 0.005;
        useRideStore.getState().updateMainPlatformRotation(mainRotation);
        mainPlatformRef.current?.setRotationFromEuler(new THREE.Euler(0, mainRotation, 0));


        subPlatformRefs.current.forEach((ref, index) => {
            const subRotation = useRideStore.getState().subPlatformRotations[index] + 0.005 * (index + 1);
            useRideStore.getState().updateSubPlatformRotation(index, subRotation);
            ref.current!.rotation.y = subRotation
        });
        */
/*
        // Rotate main platform
        if (mainPlatformRef.current) {
            // @ts-ignore
            mainPlatformRef.current.rotation.y += rideConfig.baseRotationSpeed;
        }

        // Rotate sub-platforms with variance
        subPlatformRefs.current.forEach((ref, index) => {
            if (ref) {
                // @ts-ignore
                ref.rotation.y += rideConfig.baseRotationSpeed;
            }
        });

        // Update ride intensity and effects
        updateIntensity(delta);
        //Update intensity (if needed -  you might want to move this logic into another function)
        useRideStore.setState({ intensity: Math.sin(Date.now() * intensity) * 0.5 + 0.5 });
        */
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
                    ref.rotation.y += rideConfig.baseRotationSpeed * (index + 1) * delta;
                }
            });
        }

        if (subPlatformRefs.current[1] && cameraRef.current) {
            const subPlatformPosition = new THREE.Vector3();
            subPlatformRefs.current[1].getWorldPosition(subPlatformPosition); // Get world position and rotation

            // Move camera to a position offset from the subplatform and set rotation

           // const cameraRotation = new THREE.Euler(0, 0, 0);
            cameraRef.current.setRotationFromEuler(subPlatformRefs.current[1].rotation);
            const cameraPosition = subPlatformPosition.clone().add(cameraOffset);
            cameraRef.current.position.copy(cameraPosition);

            // Make camera look at the subplatform's center:
            //cameraRef.current.lookAt(subPlatformPosition);

        }

    update(delta) // Update tweening
    }





    useFrame((_state, delta) => {
        if (isActive) {
            handleRide(delta);
            if (runningTime !== null && Date.now() - runningTime >= 60000) {
                stopRide();
                console.log('Ride stopped after 1 minute.');
            }
        }

    });




    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <Html>
                <TeacupControlUnit />
            </Html>
        <group ref={mainPlatformRef}>
            {/* Base Platform */}
            <mesh >
                <cylinderGeometry args={[rideConfig.mainPlatformRadius,rideConfig.mainPlatformRadius, 1, 64]} />
                <meshStandardMaterial color="gray" />
            </mesh>

            {/* Sub-platforms with Cups */}
            {subPlatformPositions.map((pos: { x: number;y:number; z: number; }, index:  number  | undefined) => (
                <group
                    key={index}
                    ref={el => subPlatformRefs.current[index?index:8] = el}
                    position={[pos.x, pos.y, pos.z]}
                >
                    {/* Sub-platform */}
                    <mesh >
                        <cylinderGeometry args={[rideConfig.subPlatformRadius, rideConfig.subPlatformRadius, 0.5, 32]} />
                        <meshStandardMaterial color="lightblue" />
                    </mesh>

                    {/* Cup */}
                    <Teacups
                        config={{
                            bodyColor: `hsl(${index? index * 90: 10}, 70%, 60%)`,
                            handleColor: `hsl(${index? index * 90 + 30:30}, 70%, 50%)`
                        }}
                    />
                    {index === 0 && (
                        <PerspectiveCamera

                            makeDefault
                            fov={75}
                            near={0.1}
                            far={1000}
                            position={[subPlatformPositions[0].x-9, subPlatformPositions[0].y+5 , subPlatformPositions[0].z]}
                        />)}
                </group>
            ))}
        </group></>
    );
}

export default TeaCupRide;