import {useRef, useState} from 'react';
import {useFrame} from "@react-three/fiber";
import Teacups from "./Teacups.tsx";
import * as THREE from "three";
import RideMechanics from "./Classes/RideMechanics.ts";
import ConfigurableCupCluster from "./ConfigurableCupCluster.tsx";
import {Html} from "@react-three/drei";
import TeacupControlUnit from "./Teacup.ControlUnit.tsx";
import useRideStore from "./RideStore.ts";

function TeaCupRide() {
    const {
        isActive,
        runningTime,
        intensity,
        startRide,
        stopRide,
        openGates,
        closeGates,
        openRestraints,
        closeRestraints,
        gatesOpen,
        restraintsOpen,
        updateMainPlatformRotation,
        updateSubPlatformRotation,
        updateIntensity,
        calculateSubPlatformPositions,
        rideConfig
    } = useRideStore();

    const mainPlatformRef = useRef();
    const subPlatformRefs = useRef([]);

    const subPlatformPositions = calculateSubPlatformPositions();

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

        // Rotate main platform
        if (mainPlatformRef.current) {
            mainPlatformRef.current.rotation.y += rideConfig.baseRotationSpeed;
        }

        // Rotate sub-platforms with variance
        subPlatformRefs.current.forEach((ref, index) => {
            if (ref) {
                ref.rotation.y += rideConfig.baseRotationSpeed * (index + 1);
            }
        });

        // Update ride intensity and effects
        updateIntensity(delta);
        //Update intensity (if needed -  you might want to move this logic into another function)
        //useRideStore.setState({ intensity: Math.sin(Date.now() * 0.001) * 0.5 + 0.5 });
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




    return (
        <>
            <Html>
                <TeacupControlUnit startRide={startRide} stopRide={stopRide} openGates={openGates} closeGates={closeGates} openRestraints={openRestraints} closeRestraints={closeRestraints} getGatesStatus={gatesOpen} getRestraintsStatus={restraintsOpen}/>
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
                    ref={el => subPlatformRefs.current[index] = el}
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
                </group>
            ))}
        </group></>
    );
}

export default TeaCupRide;