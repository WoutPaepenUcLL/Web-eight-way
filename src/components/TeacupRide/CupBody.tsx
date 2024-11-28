
interface CupBodyProps {
    position?: [number, number, number];
    color?: string;
    scale?: number;
}
const CupBody =({
                     position = [0, 1, 0],
                     color = 'pink',
                     scale = 1
                 }:CupBodyProps)=> {

    return (
    <group position={position} scale={scale}>
        {/* Cup body */}
        <mesh>
            <cylinderGeometry args={[1.5, 1, 2, 32]} />
            <meshStandardMaterial color={color} />
        </mesh>

        {/* Cup handle */}
        <mesh position={[1, 0.5, 0]} rotation-z={Math.PI/4}>
            <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
            <meshStandardMaterial color="darkgray" />
        </mesh>
    </group>
);
}


export default CupBody;