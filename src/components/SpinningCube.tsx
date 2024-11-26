import React, {useRef} from 'react';
import {useFrame} from "@react-three/fiber";

function SpinningCube() {
    const mesh = useRef();

    // Rotate mesh every frame
    useFrame((_state, _delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += 0.01;
            mesh.current.rotation.y += 0.01;
        }
    });

    // @ts-ignore
    return (
        <mesh ref={mesh}>
            <boxGeometry args={[5, 5, 5]} />
            <meshStandardMaterial color="hotpink" />
        </mesh>
    );



}

export default SpinningCube;