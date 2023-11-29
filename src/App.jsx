import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { folder, useControls } from "leva";
import { RubiksEngine } from "./DataModels/Rubiks";
import { Particles } from "./DataModels/Particles";

export default function App() {
  const {
    model,
    camera_fov,
    orbit_control,
    light1,
    light2,
    light3,
    light4,
    color1,
    color2,
    color3,
    color4,
    intensity1,
    intensity2,
    intensity3,
    intensity4,
  } = useControls({
    Canvas: folder({
      model: {
        options: ["Particles", "Rubik's"],
      },
      camera_fov: {
        value: 35,
        min: 30,
        max: 100,
      },
      orbit_control: true,
      Lights: folder({
        light1: {
          x: 5,
          y: 10,
          z: 1,
        },
        color1: "red",
        intensity1: 4,

        light2: {
          x: -5,
          y: 10,
          z: 1,
        },
        color2: "blue",
        intensity2: 4,

        light3: {
          x: 5,
          y: 10,
          z: 10,
        },
        color3: "green",
        intensity3: 4,

        light4: {
          x: -5,
          y: -10,
          z: -20,
        },
        color4: "orange",
        intensity4: 4,
      }),
    }),
  });

  const cameraRef = useRef();

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = camera_fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [camera_fov]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        pixelratio={window.devicePixelRatio}
        camera={{ fov: camera_fov, position: [0, 0, 20] }}
        onCreated={({ gl, size, camera }) => {
          if (size.width < 600) {
            camera.position.z = 45;
          }
          cameraRef.current = camera;
        }}
      >
        {orbit_control && <OrbitControls />}
        <directionalLight
          intensity={intensity1}
          position={[light1.x, light1.y, light1.z]}
          color={color1}
        />
        <directionalLight
          intensity={intensity2}
          position={[light2.x, light2.y, light2.z]}
          color={color2}
        />
        <directionalLight
          intensity={intensity3}
          position={[light3.x, light3.y, light3.z]}
          color={color3}
        />
        <directionalLight
          intensity={intensity4}
          position={[light4.x, light4.y, light4.z]}
          color={color4}
        />

        {/* {experience === "data flock" && (
          <Physics gravity={[0]}>
            <DataFlock />
          </Physics>
        )} */}
        {model === "Particles" && <Particles />}
        {model === "Rubik's" && <RubiksEngine />}
      </Canvas>
    </div>
  );
}
