import React from 'react';
import useRideStore from './RideStore';


function TeacupControlUnit() {
    const {
        isActive,
        startRide,
        stopRide,
        openGates,
        closeGates,
        openRestraints,
        closeRestraints,
        gatesOpen,
        restraintsOpen,
        runningTime,
    } = useRideStore();

    const checkDispatch = () => {
        if (gatesOpen || restraintsOpen) {
            console.log('Cannot dispatch ride');
        } else {
            startRide();
        }
    }
    const remainingTime = isActive && runningTime
        ? Math.max(0, 60 - Math.floor((Date.now() - runningTime) / 1000))
        : null;

    return (
        <div>
            <button onClick={checkDispatch}>Start Ride</button>
            <button onClick={stopRide}>Stop Ride</button>
            <button onClick={() => (gatesOpen ? closeGates() : openGates())}>
                {gatesOpen ? 'Close Gates' : 'Open Gates'}
            </button>
            <button
                className={`bg-${restraintsOpen ? 'green' : 'red'}`}
                onClick={() => (restraintsOpen ? closeRestraints() : openRestraints())}
            >
                {restraintsOpen ? 'Close Restraints' : 'Open Restraints'}
            </button>

            <p>
                Gates: {gatesOpen ? 'Open' : 'Closed'}
                <br />
                Restraints: {restraintsOpen ? 'Open' : 'Closed'}
            </p>
            {isActive && remainingTime !== null && (
                <p>Time remaining: {remainingTime} seconds</p>
            )}
        </div>
    );
}

export default TeacupControlUnit;