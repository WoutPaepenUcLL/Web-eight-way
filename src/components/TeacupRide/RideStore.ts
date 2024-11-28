import create from 'zustand';

interface RideState {
    isActive: boolean;
    intensity: number;
    gatesOpen: boolean;
    restraintsOpen: boolean;
    // Add other relevant state variables here (e.g., cup rotations, special effects)
}

const useRideStore = create<RideState>()((set) => ({
    isActive: false,
    intensity: 0,
    gatesOpen: false,
    restraintsOpen: false,
    startRide: () => set({ isActive: true, intensity: 0 }), //add intensity to zero before it starts increasing
    stopRide: () => set({ isActive: false, intensity: 0 }), //add intensity to zero after it stops
    openGates: () => set({ gatesOpen: true }),
    closeGates: () => set({ gatesOpen: false }),
    openRestraints: () => set({ restraintsOpen: true }),
    closeRestraints: () => set({ restraintsOpen: false }),
    // Add other actions here (e.g., updateCupRotation)
}));

export default useRideStore;