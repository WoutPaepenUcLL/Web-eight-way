import { create } from 'zustand';
import RideMechanics from './Classes/RideMechanics';
import FlatRide from './Classes/FlatRide';

interface RideState {
    rides: FlatRide[];
    addRide: (ride: FlatRide) => void;
    removeRide: (rideName: string) => void;
    startRide: (rideName: string) => void;
    stopRide: (rideName: string) => void;
    openGates: (rideName: string) => void;
    closeGates: (rideName: string) => void;
    updateRideState: (rideName: string) => void;
}

const useRideStore = create<RideState>((set, get) => ({
    rides: [],
    addRide: (ride: FlatRide) => set((state) => ({ rides: [...state.rides, ride] })),
    removeRide: (rideName: string) => set((state) => ({ rides: state.rides.filter(ride => ride.name !== rideName) })),
    startRide: (rideName: string) => {
        const ride = get().rides.find(ride => ride.name === rideName);
        if (ride) {
            ride.start();
            set((state) => ({
                rides: state.rides.map(r => r.name === rideName ? ride : r)
            }));
        }
    },
    stopRide: (rideName: string) => {
        const ride = get().rides.find(ride => ride.name === rideName);
        if (ride) {
            ride.stop();
            set((state) => ({
                rides: state.rides.map(r => r.name === rideName ? ride : r)
            }));
        }
    },
    openGates: (rideName: string) => {
        const ride = get().rides.find(ride => ride.name === rideName);
        if (ride) {
            ride.openGates();
            set((state) => ({
                rides: state.rides.map(r => r.name === rideName ? ride : r)
            }));
        }
    },
    closeGates: (rideName: string) => {
        const ride = get().rides.find(ride => ride.name === rideName);
        if (ride) {
            ride.closeGates();
            set((state) => ({
                rides: state.rides.map(r => r.name === rideName ? ride : r)
            }));
        }
    },
    updateRideState: (rideName: string) => {
        const ride = get().rides.find(ride => ride.name === rideName);
        if (ride) {
            ride.updateRideState();
            set((state) => ({
                rides: state.rides.map(r => r.name === rideName ? ride : r)
            }));
        }
    }
}));

export default useRideStore;
