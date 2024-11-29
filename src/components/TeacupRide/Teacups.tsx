import  {useRef} from 'react';
import {useFrame} from "@react-three/fiber";
import CupComponent from "./Classes/CupComponent";
import {Group} from "three";


const Teacups =(config:any)=> {

    const cupComponent = new CupComponent(config);
    const bodyGeometry = cupComponent.createGeometry().body;
    const handleGeometry = cupComponent.createGeometry().handle;
    const cupRef = useRef<Group>(null);

    useFrame((_state, delta) => {
        cupComponent.animateCup(cupRef, delta);
    });
    // @ts-ignore
    return (
        <group ref={cupRef} position={[0, 1, 0]}>
            <mesh geometry={bodyGeometry}>
                <meshStandardMaterial color={config?.bodyColor || 'brown'}/>
            </mesh>
            <mesh
                position={[2, 0.5, 0]}
                rotation-z={Math.PI / 4}
                geometry={handleGeometry}
            >
                <meshStandardMaterial color={config?.handleColor || 'darkpink'}/>
            </mesh>
        </group>
    );
}

export default Teacups;