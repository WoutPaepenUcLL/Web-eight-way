import {useRef} from 'react';
import {useFrame} from "@react-three/fiber";
import Teacups from "./Teacups.tsx";
import RideMechanics from "./Classes/RideMechanics.ts";

function TeaCupRide() {
    const rideMechanics = new RideMechanics();
    const mainPlatformRef = useRef();
    const subPlatformRefs = useRef([]);

    // Prepare sub-platform positions
    const subPlatformPositions = rideMechanics.calculateSubPlatformPositions();

    useFrame((_state, delta) => {
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
    });

    return (
        <group ref={mainPlatformRef}>
            {/* Base Platform */}
            <mesh >
                <cylinderGeometry args={[10, 10, 1, 64]} />
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
                        <cylinderGeometry args={[2, 2, 0.5, 32]} />
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
        </group>
    );
}

export default TeaCupRide;