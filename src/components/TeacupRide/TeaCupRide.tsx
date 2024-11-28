import {useRef, useState} from 'react';
import {useFrame} from "@react-three/fiber";
import Teacups from "./Teacups.tsx";
import RideMechanics from "./Classes/RideMechanics.ts";
import ConfigurableCupCluster from "./ConfigurableCupCluster.tsx";
import {Html} from "@react-three/drei";
import TeacupControlUnit from "./Teacup.ControlUnit.tsx";

function TeaCupRide() {
    const rideMechanics = new RideMechanics();
    const mainPlatformRef = useRef();
    const subPlatformRefs = useRef([]);

    const [isRideActive, setIsRideActive] = useState(false);

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
        if (rideMechanics.getState().isActive){
            setIsRideActive(true);
            handleRide(delta);
        }else{
            setIsRideActive(false);
        }

    });

    return (
        <>
            <Html>
                <TeacupControlUnit startRide={rideMechanics.startRide} stopRide={rideMechanics.stopRide} openGates={rideMechanics.openGates} closeGates={rideMechanics.closeGates} openRestraints={rideMechanics.openRestraints} closeRestraints={rideMechanics.closeRestraints} gatesOpen={rideMechanics.getState().gatesOpen} restraintsOpen={rideMechanics.getState().restraintsOpen}/>
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
                     <ConfigurableCupCluster/>
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