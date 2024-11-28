import React from 'react';

interface TeacupControlUnitProps {
    startRide: () => void;
    stopRide: () => void;
    openGates: () => void;
    closeGates: () => void;
    openRestraints: () => void;
    closeRestraints: () => void;
    gatesOpen: boolean;
    restraintsOpen: boolean;
}

function TeacupControlUnit(props: TeacupControlUnitProps) {
    return (
        <div>
            <button onClick={props.startRide}>Start Ride</button>
            <button onClick={props.stopRide}>Stop Ride</button>
            <button onClick={props.gatesOpen?props.closeGates:props.openGates}>open/close Gates</button>
            <button className={`bg-${props.restraintsOpen ? "green" : "red"}`} onClick={props.restraintsOpen ? props.closeRestraints : props.openRestraints}>open/close Restraints</button>        </div>
    );
}

export default TeacupControlUnit;