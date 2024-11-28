import React from 'react';
import CupBody from "./CupBody.tsx";



function ConfigurableCupCluster({
                                    cupCount = 1,
                                    radius = 3,
                                    startAngle = 0
}) {
    return (
        <group>
            {Array.from({ length: cupCount }).map((_, index) => {
                const angle = startAngle + (index / cupCount) * Math.PI * 2;
                const randomOffset = Math.random() * 0.5; // Random slight variation

                return (
                    <group key={index} rotation-y={randomOffset}>
                        <CupBody
                            position={[
                                Math.cos(angle) * radius,
                                1, // Slight vertical variation
                                Math.sin(angle) * radius
                            ]}
                            color={`hsl(${index * 60}, 70%, 60%)`}
                            scale={1} // Slight scale variation
                        />
                    </group>
                );
            })}
        </group>
    );
}

export default ConfigurableCupCluster;