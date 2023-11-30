import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { folder, useControls } from "leva";
import { RubiksEngine } from "./DataModels/Rubiks";
import { Particles } from "./DataModels/Particles";

export default function App() {
  const lightProperties = [
    {
      position: { x: 5, y: 10, z: 1 },
      color: "red",
      intensity: 4,
    },
    {
      position: { x: -5, y: 10, z: 1 },
      color: "blue",
      intensity: 4,
    },
    {
      position: { x: 5, y: 10, z: 10 },
      color: "green",
      intensity: 4,
    },
    {
      position: { x: -5, y: -10, z: -20 },
      color: "orange",
      intensity: 4,
    },
  ];

  const { model, camera_fov, orbit_control, canvas_color, ...lights } =
    useControls({
      Canvas: folder({
        model: {
          options: ["Particles", "Rubik's"],
        },
        camera_fov: {
          value: 35,
          min: 0,
          max: 100,
        },
        orbit_control: true,
        canvas_color: "#101010",
        Lights: folder(
          lightProperties.reduce((acc, _, index) => {
            acc[index + 1] = folder({
              [`position_${index + 1}`]: lightProperties[index].position,
              [`color_${index + 1}`]: lightProperties[index].color,
              [`intensity_${index + 1}`]: 4,
            });
            return acc;
          }, {}),
          { collapsed: true }
        ),
      }),
    });

  const cameraRef = useRef();

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = camera_fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [camera_fov]);

  const renderDirectionalLights = () => {
    return lightProperties.map((light, index) => (
      <directionalLight
        key={`light_${index}`}
        intensity={lights[`intensity_${index + 1}`]}
        position={[
          lights[`position_${index + 1}`].x,
          lights[`position_${index + 1}`].y,
          lights[`position_${index + 1}`].z,
        ]}
        color={lights[`color_${index + 1}`]}
      />
    ));
  };

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
        {orbit_control && <OrbitControls />}
        {renderDirectionalLights()}
        {model === "Particles" && <Particles />}
        {model === "Rubik's" && <RubiksEngine />}
      </Canvas>
    </div>
  );
}
