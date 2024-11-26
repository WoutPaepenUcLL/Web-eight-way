import React, {useRef} from 'react';
import {useFrame} from "@react-three/fiber";
import CupComponent from "./Classes/CupComponent";


const Teacups =(config:any)=> {

    const cupComponent = new CupComponent(config);
    const bodyGeometry = cupComponent.createGeometry().body;
    const handleGeometry = cupComponent.createGeometry().handle;
    const cupRef = useRef();

    useFrame((_state, delta) => {
        cupComponent.animateCup(cupRef, delta);
    });
    return (
        <group ref={cupRef} position={[0, 1, 0]}>
            <mesh geometry={bodyGeometry}>
                <meshStandardMaterial color={config?.bodyColor || 'pink'}/>
            </mesh>
            <mesh
                position={[1, 0.5, 0]}
                rotation-z={Math.PI / 4}
                geometry={handleGeometry}
            >
                <meshStandardMaterial color={config?.handleColor || 'darkpink'}/>
            </mesh>
        </group>
    );
}

export default Teacups;