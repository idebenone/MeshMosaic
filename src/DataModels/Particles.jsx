import { useFrame } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { useRef, useEffect, useState } from "react";

const getAngles = (value, operation) => {
  switch (operation) {
    case "sin":
      return Math.sin(value);
    case "cos":
      return Math.cos(value);
    case "tan":
      return Math.tan(value);
    case "sinh":
      return Math.sinh(value);
    case "cosh":
      return Math.cosh(value);
    case "tanh":
      return Math.tanh(value);
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
  const [x, setX] = useState(true);
  const [y, setY] = useState(true);
  const [z, setZ] = useState(true);
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
  } = useControls(
    {
      Particles: folder({
        quantity: {
          value: 500,
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
              options: ["sin", "cos", "tan", "sinh", "cosh", "tanh"],
              disabled: x,
            },
            x_toggle: button(() => setX(!x)),
          }),
          y_axis: folder({
            y_angle: {
              options: ["sin", "cos", "tan", "sinh", "cosh", "tanh"],
              disabled: y,
            },
            y_toggle: button(() => setY(!y)),
          }),
          z_axis: folder({
            z_angle: {
              options: ["sin", "cos", "tan", "sinh", "cosh", "tanh"],
              disabled: z,
            },
            z_toggle: button(() => setZ(!z)),
          }),
        }),

        dispersion_offset: 0.25,
        dispersion_rate: 0.01,
      }),
    },
    [x, y, z]
  );

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
      const randomness = randomPos[i] * dispersion_offset;
      if (enable) {
        if (!x) {
          const adjustmentX =
            getAngles(clock.elapsedTime * randomness, x_angle) *
            dispersion_rate;
          sphere.position.x += adjustmentX;
        }
        if (!y) {
          const adjustmentY =
            getAngles(clock.elapsedTime * randomness, y_angle) *
            dispersion_rate;
          sphere.position.y += adjustmentY;
        }

        if (!z) {
          const adjustmentZ =
            getAngles(clock.elapsedTime * randomness, z_angle) *
            dispersion_rate;
          sphere.position.z += adjustmentZ;
        }
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
