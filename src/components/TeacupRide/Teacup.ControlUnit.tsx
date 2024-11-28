import React from 'react';

interface TeacupControlUnitProps {
    startRide: () => void;
    stopRide: () => void;
    openGates: () => void;
    closeGates: () => void;
    openRestraints: () => void;
    closeRestraints: () => void;
    getGatesStatus:  boolean;
    getRestraintsStatus: boolean;
}

function TeacupControlUnit(props: TeacupControlUnitProps) {
    const [gatesOpen, setGatesOpen] = React.useState(props.getGatesStatus);
    const [restraintsOpen, setRestraintsOpen] = React.useState(props.getRestraintsStatus);

    return (
        <div>
            <button onClick={props.startRide}>Start Ride</button>
            <button onClick={props.stopRide}>Stop Ride</button>
            <button onClick={gatesOpen?props.closeGates:props.openGates}>open/close Gates</button>
            <button className={`bg-${restraintsOpen ? "green" : "red"}`} onClick={restraintsOpen ? props.closeRestraints : props.openRestraints}>open/close Restraints</button>

            <p>{
                `Gates: ${gatesOpen ? "Open" : "Closed"}
                Restraints: ${restraintsOpen ? "Open" : "Closed"}`
            }</p>
        </div>
    );
}

export default TeacupControlUnit;