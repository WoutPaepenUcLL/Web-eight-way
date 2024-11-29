import {create} from 'zustand';
import RideMechanics from './Classes/RideMechanics';

interface RideState {
    isActive: boolean;
    runningTime: number | null;
    intensity: number;
    gatesOpen: boolean;
    restraintsOpen: boolean;
    cupRotations: number[];
    mainPlatformRotation: number;
    subPlatformRotations: number[];
    startRide: () => void;
    stopRide: () => void;
    openGates: () => void;
    closeGates: () => void;
    openRestraints: () => void;
    closeRestraints: () => void;
    updateCupRotation: (index: number, rotation: number) => void;
    updateMainPlatformRotation: (rotation: number) => void;
    updateSubPlatformRotation: (index: number, rotation: number) => void;
    updateIntensity: (delta: number) => void;
    calculateSubPlatformPositions: () =>  {x: number, y: number, z: number}[];
    rideConfig: {
        mainPlatformRadius: number;
        subPlatformRadius: number;
        cupCount: number;
        baseRotationSpeed: number;
        distanceFromCenter: number;
        cupDimensions: {width: number; height: number; depth: number; handleLength: number;};
    };
    rideMechanics: RideMechanics; //Instance of the RideMechanics class
}

const useRideStore = create<RideState>()((set, get) => ({
    isActive: false,
    runningTime: null,
    intensity: 0,
    gatesOpen: false,
    restraintsOpen: false,
    cupRotations: [],
    mainPlatformRotation: 0,
    subPlatformRotations: [],
    rideConfig: {
        mainPlatformRadius: 20,
        subPlatformRadius: 6,
        cupCount: 4,
        baseRotationSpeed: 0.005,
        distanceFromCenter: 12,
        cupDimensions: { width: 3, height: 2, depth: 1.5, handleLength: 1 },
    },
    rideMechanics: new RideMechanics(), //Initialize RideMechanics with config

    startRide: () => set({ isActive: true, runningTime: Date.now() }), // Set rideStartTime on start
    stopRide: () =>
        set({
            isActive: false,
            intensity: 0,
            runningTime: null, // Reset rideStartTime on stop
            mainPlatformRotation: 0,
            subPlatformRotations: [],
        }),
    openGates: () => set({ gatesOpen: true }),
    closeGates: () => set({ gatesOpen: false }),
    openRestraints: () => set({ restraintsOpen: true }),
    closeRestraints: () => set({ restraintsOpen: false }),
    updateCupRotation: (index: number, rotation: number) =>
        set((state: { cupRotations: string | any[]; }) => ({
            cupRotations: [...state.cupRotations.slice(0, index), rotation, ...state.cupRotations.slice(index + 1)],
        })),
    updateMainPlatformRotation: (rotation: number) => set({ mainPlatformRotation: rotation }),
    updateSubPlatformRotation: (index: number, rotation: number) =>
        set((state: { subPlatformRotations: string | any[]; }) => ({
            subPlatformRotations: [
                ...state.subPlatformRotations.slice(0, index),
                rotation,
                ...state.subPlatformRotations.slice(index + 1),
            ],
        })),
    updateIntensity: (delta: number) => set((state: { intensity: number; }) => ({ intensity: state.intensity + delta })),
    calculateSubPlatformPositions: () => get().rideMechanics.calculateSubPlatformPositions(),
}));

export default useRideStore;