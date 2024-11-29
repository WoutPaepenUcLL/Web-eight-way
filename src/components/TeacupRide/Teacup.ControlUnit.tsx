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
    const switchGates = () => {
        if (isActive){
            console.log('Cannot switch gates while ride is active');
            return;
        }
        if (gatesOpen) {
            closeGates();
        } else {
            openGates();
        }
    }

    const switchRestraints = () => {
        if (isActive){
            console.log('Cannot switch restraints while ride is active');
            return;
        }
        if (restraintsOpen) {
            closeRestraints();
        } else {
            openRestraints();
    }
    }

    return (
        <div>
            <button onClick={checkDispatch}>Start Ride</button>
            <button onClick={stopRide}>Stop Ride</button>
            <button onClick={switchGates}>
                {gatesOpen ? 'Close Gates' : 'Open Gates'}
            </button>
            <button
                className={`bg-${restraintsOpen ? 'green' : 'red'}`}
                onClick={switchRestraints}
            >
                {restraintsOpen ? 'Close Restraints' : 'Open Restraints'}
            </button>

            <p>
                Gates: {gatesOpen ? 'Open' : 'Closed'}
                <br/>
                Restraints: {restraintsOpen ? 'Open' : 'Closed'}
            </p>
            {isActive && remainingTime !== null && (
                <p>Time remaining: {remainingTime} seconds</p>
            )}
        </div>
    );
}

export default TeacupControlUnit;