import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { getTrignometryAngles } from "../Utility/getTrignometryAngles";
import { useControls, folder, button } from "leva";

function generateUniformPointsInCircle(radius, numberOfPoints, numberOfLevels) {
  const points = [];
  const particlesPerLevel = numberOfPoints / numberOfLevels;
  for (let level = 0; level < numberOfLevels; level++) {
    const levelRadius = (level + 1) * (radius / numberOfLevels);
    for (let i = 0; i < particlesPerLevel; i++) {
      const theta = (i / particlesPerLevel) * Math.PI * 2;
      const x = levelRadius * Math.cos(theta);
      const y = levelRadius * Math.sin(theta);
      points.push([x, y]);
    }
  }
  return points;
}

function generateRandomPointsInCircle(radius, numberOfPoints) {
  const points = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < numberOfPoints; i++) {
    const theta = 2 * Math.PI * (i / goldenRatio);
    const phi = Math.acos(1 - (2 * (i + 0.5)) / numberOfPoints);
    const r = Math.cbrt(Math.random()) * radius;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    points.push([x, y]);
  }
  return points;
}

export const Plane = () => {
  const [stateUniform, setStateUniform] = useState("Levels");
  const spheres = useRef();

  const uniform = useRef([]);
  const random = useRef([]);

  const [x, setX] = useState(true);
  const [y, setY] = useState(true);
  const [z, setZ] = useState(true);

  const {
    quantity,
    type,
    level,
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
      Plane_Particles: folder({
        quantity: {
          value: 500,
          max: 1000,
          min: 100,
        },
        type: {
          options: ["Levels", "Randomized"],
          onChange: (e) => setStateUniform(e),
        },
        level: { value: 10, disabled: stateUniform != "Levels" },
        Plane_Size: folder({
          max_size: 0.05,
          min_size: 0.05,
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
          dispersion_offset: 0.25,
          dispersion_rate: 0.01,
        }),
      }),
    },
    [x, y, z, stateUniform]
  );

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
            getTrignometryAngles(clock.elapsedTime * randomness, x_angle) *
            dispersion_rate;
          sphere.position.x += adjustmentX;
        }
        if (!y) {
          const adjustmentY =
            getTrignometryAngles(clock.elapsedTime * randomness, y_angle) *
            dispersion_rate;
          sphere.position.y += adjustmentY;
        }

        if (!z) {
          const adjustmentZ =
            getTrignometryAngles(clock.elapsedTime * randomness, z_angle) *
            dispersion_rate;
          sphere.position.z += adjustmentZ;
        }
      }
    });
  });

  uniform.current = generateUniformPointsInCircle(5, quantity, level);
  useEffect(() => {
    uniform.current = [];
    uniform.current = generateUniformPointsInCircle(5, quantity, level);
    random.current = [];
    random.current = generateRandomPointsInCircle(5, quantity);
  }, [quantity, enable, x_angle, y_angle, z_angle, range, stateUniform]);

  const renderParticles =
    stateUniform === "Levels"
      ? uniform.current.map((val, i) => {
          const [x, y] = val;
          const sphereSize = (
            Math.random() * (max_size - min_size) +
            min_size
          ).toFixed(3);
          return (
            <mesh key={i} position={[x, y, 0]}>
              <sphereGeometry args={[sphereSize, 100, 30]} />
              <meshStandardMaterial color="#b3b3b3" />
            </mesh>
          );
        })
      : random.current.map((val, i) => {
          const [x, y] = val;
          const sphereSize = (
            Math.random() * (max_size - min_size) +
            min_size
          ).toFixed(3);
          return (
            <mesh key={i} position={[x, y, 0]}>
              <sphereGeometry args={[sphereSize, 100, 30]} />
              <meshStandardMaterial color="#b3b3b3" />
            </mesh>
          );
        });

  return (
    <>
      <group ref={spheres}>
        <directionalLight position={[0, 10, 0]} />
        <directionalLight position={[0, -10, 0]} color={"yellow"} />
        {renderParticles}
      </group>
    </>
  );
};
