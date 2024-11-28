import {useRef, useState} from 'react';
import {useFrame} from "@react-three/fiber";
import Teacups from "./Teacups.tsx";
import RideMechanics from "./Classes/RideMechanics.ts";
import ConfigurableCupCluster from "./ConfigurableCupCluster.tsx";
import {Html} from "@react-three/drei";
import TeacupControlUnit from "./Teacup.ControlUnit.tsx";
import useRideStore from "./RideStore.ts";

function TeaCupRide() {
    const [rideMechanics, setRideMechanics] = useState(new RideMechanics());
    const mainPlatformRef = useRef();
    const subPlatformRefs = useRef([]);

    const [isRideActive, setIsRideActive] = useState(rideMechanics.getState().isActive);
    const [gatesOpen, setGatesOpen] = useState(rideMechanics.getGatesStatus());
    const [restraintsOpen, setRestraintsOpen] = useState(rideMechanics.getRestraintsStatus());


    const {
        isActive,
        intensity,
        startRide,
        stopRide,
        openGates,
        closeGates,
        openRestraints,
        closeRestraints,
        gatesOpen,
        restraintsOpen,

    } = useRideStore(); // Get state and actions from Zustand


    // Prepare sub-platform positions
    const subPlatformPositions = rideMechanics.calculateSubPlatformPositions();

    const handleRide = (delta: number) => {
        // Rotate main platform
        if (mainPlatformRef.current) {
            mainPlatformRef.current.rotation.y += rideMechanics.config.baseRotationSpeed;
        }

        // Rotate sub-platforms with variance
        subPlatformRefs.current.forEach((ref, index) => {
            if (ref) {
                ref.rotation.y += rideMechanics.config.baseRotationSpeed * (index + 1);
            }
        });

        // Update ride intensity and effects
        rideMechanics.updateRideIntensity(delta);

    }

    useFrame((_state, delta) => {
        if (rideMechanics.getState().isActive) {
            setIsRideActive(true);
            handleRide(delta);
        }else{
            setIsRideActive(false);
        }

    });

    const startRide = () => {
        rideMechanics.startRide();

    }
    const stopRide = () => {
        rideMechanics.stopRide();
    }

    const openGates = () => {
        rideMechanics.openGates();
        setGatesOpen(true);
    }

    const closeGates = () => {
        rideMechanics.closeGates();
        setGatesOpen(false);
    }

    const openRestraints = () => {
        rideMechanics.openRestraints();
        setRestraintsOpen(true);
    }

    const closeRestraints = () => {
        rideMechanics.closeRestraints();
        setRestraintsOpen(false);
    }



    return (
        <>
            <Html>
                <TeacupControlUnit startRide={startRide} stopRide={stopRide} openGates={openGates} closeGates={closeGates} openRestraints={openRestraints} closeRestraints={closeRestraints} getGatesStatus={gatesOpen} getRestraintsStatus={restraintsOpen}/>
            </Html>
        <group ref={mainPlatformRef}>
            {/* Base Platform */}
            <mesh >
                <cylinderGeometry args={[rideMechanics.config.mainPlatformRadius, rideMechanics.config.mainPlatformRadius, 1, 64]} />
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
                        <cylinderGeometry args={[rideMechanics.config.subPlatformRadius, rideMechanics.config.subPlatformRadius, 0.5, 32]} />
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