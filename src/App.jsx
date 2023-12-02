import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { folder, useControls } from "leva";
import { RubiksEngine } from "./Designs/Rubiks";
import { Particles } from "./Designs/Particles";
import { Plane } from "./Designs/Plane";

export default function App() {
  const { model, camera_fov, orbit_control, canvas_color } = useControls({
    Canvas: folder({
      model: {
        options: ["Particles", "Rubik", "Plane"],
      },
      camera_fov: {
        value: 35,
        min: 0,
        max: 100,
      },
      orbit_control: true,
      canvas_color: "#101010",
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
    <div style={{ width: "100vw", height: "100vh", background: canvas_color }}>
      <p
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          color: "grey",
        }}
      >
        Vineeth V G
      </p>
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
        {orbit_control && <OrbitControls enablePan="true" />}
        {model === "Particles" && <Particles />}
        {model === "Rubik" && <RubiksEngine />}
        {model === "Plane" && <Plane />}
      </Canvas>
    </div>
  );
}
