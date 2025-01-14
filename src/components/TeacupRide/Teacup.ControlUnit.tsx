import useRideStore from './RideStore';
import { useState } from 'react';
import FlatRide from './Classes/FlatRide';

function TeacupControlUnit() {
    const {
        rides,
        startRide,
        stopRide,
        openGates,
        closeGates,
        updateRideState,
    } = useRideStore();

    const [selectedRide, setSelectedRide] = useState<FlatRide | null>(null);

    const handleRideSelection = (rideName: string) => {
        const ride = rides.find(r => r.name === rideName) || null;
        setSelectedRide(ride);
    };

    const handleStartRide = () => {
        if (selectedRide) {
            startRide(selectedRide.name);
        }
    };

    const handleStopRide = () => {
        if (selectedRide) {
            stopRide(selectedRide.name);
        }
    };

    const handleOpenGates = () => {
        if (selectedRide) {
            openGates(selectedRide.name);
        }
    };

    const handleCloseGates = () => {
        if (selectedRide) {
            closeGates(selectedRide.name);
        }
    };

    const handleUpdateRideState = () => {
        if (selectedRide) {
            updateRideState(selectedRide.name);
        }
    };

    return (
        <div>
            <select onChange={(e) => handleRideSelection(e.target.value)}>
                <option value="">Select a ride</option>
                {rides.map((ride) => (
                    <option key={ride.name} value={ride.name}>
                        {ride.name}
                    </option>
                ))}
            </select>

            <button onClick={handleStartRide} disabled={!selectedRide}>Start Ride</button>
            <button onClick={handleStopRide} disabled={!selectedRide}>Stop Ride</button>
            <button onClick={handleOpenGates} disabled={!selectedRide}>Open Gates</button>
            <button onClick={handleCloseGates} disabled={!selectedRide}>Close Gates</button>
            <button onClick={handleUpdateRideState} disabled={!selectedRide}>Update Ride State</button>

            {selectedRide && (
                <div>
                    <p>Ride: {selectedRide.name}</p>
                    <p>Seats: {selectedRide.seats}</p>
                    <p>Grouped Seats: {selectedRide.groupedSeats}</p>
                    <p>Duration: {selectedRide.duration} seconds</p>
                    <p>Gates: {selectedRide.gates ? 'Open' : 'Closed'}</p>
                    <p>Running: {selectedRide.isRunning ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
}

export default TeacupControlUnit;
