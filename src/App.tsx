
import './App.css'
import {Canvas} from "@react-three/fiber";
import TeaCupRide from "./components/TeacupRide/TeaCupRide.tsx";
import {CameraControls, OrbitControls} from "@react-three/drei";


function App() {


    return (
       <div style={{width: '100vw', height: '100vh'}}>
           <Canvas
               camera={{position: [0, 5, 10]}}
               onCreated={({gl}) => {
                   gl.setClearColor('lightblue')
               }}
           >
               <CameraControls />

               <OrbitControls/>
               <ambientLight/>
               <pointLight position={[10, 10, 10]}/>
               <TeaCupRide />
           </Canvas>
       </div>
    );
}

export default App
