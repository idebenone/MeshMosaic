import { useFrame } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { useRef } from "react";

const getRandomPointInSphere = (radius) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  return { x, y, z };
};

export const Particles = () => {
  const { quantity, dispersed } = useControls({
    Particles: folder({
      quantity: {
        value: 100,
        max: 1000,
        min: 100,
      },
      dispersed: false,
    }),
  });

  const spheres = useRef();
  const randomPos = [...Array(quantity)].map(() => (Math.random() - 0.5) * 10);

  useFrame(({ clock }) => {
    spheres.current.children.map((sphere, i) => {
      if (dispersed) {
        const offset = randomPos[i] * 0.25;
        sphere.position.x += Math.sin(clock.elapsedTime * offset) * 0.01;
        sphere.position.y += Math.cos(clock.elapsedTime * offset) * 0.01;
        sphere.position.z += Math.sin(clock.elapsedTime * offset) * 0.01;
      }
    });
  });

  return (
    <>
      <group ref={spheres}>
        {[...Array(quantity)].map((sphere, i) => {
          const { x, y, z } = getRandomPointInSphere(5);
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry
                args={[
                  (Math.random() * (0.05 - 0.001) + 0.001).toFixed(3),
                  100,
                  8,
                ]}
              />
              <meshStandardMaterial color="#b3b3b3" />
            </mesh>
          );
        })}
      </group>
    </>
  );
};
