import { useFrame } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { useRef, useEffect } from "react";

const getAngles = (value, operation) => {
  switch (operation) {
    case "sin":
      return Math.sin(value);
    case "cos":
      return Math.cos(value);
    case "tan":
      return Math.tan(value);
    case "sec":
      return 1 / Math.cos(value);
    case "cosec":
      return 1 / Math.sin(value);
    default:
      return value;
  }
};

function generateRandomPointInSphere(radius) {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  // const r = radius * Math.cbrt(Math.random());
  const r = radius;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  return { x, y, z };
}

function generateUniformPointsInSphere(radius, numberOfPoints) {
  const points = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < numberOfPoints; i++) {
    const theta = 2 * Math.PI * (i / goldenRatio);
    const phi = Math.acos(1 - (2 * (i + 0.5)) / numberOfPoints);
    // const r = radius * Math.cbrt(Math.random());
    const r = radius;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    points.push([x, y, z]);
  }
  return points;
}

export const Particles = () => {
  const {
    quantity,
    position,
    env_radius,
    max_size,
    min_size,
    enable,
    range,
    x_angle,
    y_angle,
    z_angle,
    dispersion_offset,
    dispersion_rate,
  } = useControls({
    Particles: folder({
      quantity: {
        value: 100,
        max: 1000,
        min: 100,
      },
      position: { options: ["Random", "Uniform"] },
      env_radius: 5,
      Size: folder({
        max_size: 0.05,
        min_size: 0.001,
      }),
      Movement: folder({
        enable: false,
        range: {
          max: 5,
          min: -5,
        },
        x_axis: folder({
          x_angle: {
            options: ["sin", "cos", "tan", "cot", "sec", "cosec"],
          },
        }),
        y_axis: folder({
          y_angle: {
            options: ["sin", "cos", "tan", "cot", "sec", "cosec"],
          },
        }),
        z_axis: folder({
          z_angle: {
            options: ["sin", "cos", "tan", "cot", "sec", "cosec"],
          },
        }),
      }),

      dispersion_offset: 0.25,
      dispersion_rate: 0.01,
    }),
  });

  const spheres = useRef();
  const randomPositions = useRef([]);
  const uniformPositions = useRef([]);

  if (
    position === "Random" &&
    (!randomPositions.current.length ||
      quantity !== randomPositions.current.length)
  ) {
    randomPositions.current = [...Array(quantity)].map(() =>
      generateRandomPointInSphere(env_radius)
    );
  }

  useEffect(() => {
    randomPositions.current = [...Array(quantity)].map(() =>
      generateRandomPointInSphere(env_radius)
    );
    uniformPositions.current = generateUniformPointsInSphere(
      env_radius,
      quantity
    );
  }, [quantity, env_radius, x_angle, y_angle, z_angle, range]);

  const randomPos = [];
  for (let i = 0; i < quantity; i++) {
    const randomValue = Math.random() * (range.max - range.min) + range.min;
    randomPos.push(randomValue);
  }

  useFrame(({ clock }) => {
    spheres.current.children.forEach((sphere, i) => {
      if (enable) {
        const adjustmentX =
          getAngles(clock.elapsedTime * randomPos[i], x_angle) *
          dispersion_rate;
        const adjustmentY =
          getAngles(clock.elapsedTime * randomPos[i], y_angle) *
          dispersion_rate;
        const adjustmentZ =
          getAngles(clock.elapsedTime * randomPos[i], z_angle) *
          dispersion_rate;

        sphere.position.x += adjustmentX;
        sphere.position.y += adjustmentY;
        sphere.position.z += adjustmentZ;
      }
    });
  });

  const particleComponents =
    position === "Random"
      ? randomPositions.current.map((point, i) => {
          const { x, y, z } = point;
          const sphereSize = (
            Math.random() * (max_size - min_size) +
            min_size
          ).toFixed(3);

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[sphereSize, 100, 8]} />
              <meshStandardMaterial color="#b3b3b3" />
            </mesh>
          );
        })
      : uniformPositions.current.map((point, i) => {
          const [x, y, z] = point;
          const sphereSize = (
            Math.random() * (max_size - min_size) +
            min_size
          ).toFixed(3);

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[sphereSize, 100, 8]} />
              <meshStandardMaterial color="#b3b3b3" />
            </mesh>
          );
        });

  return <group ref={spheres}>{particleComponents}</group>;
};
