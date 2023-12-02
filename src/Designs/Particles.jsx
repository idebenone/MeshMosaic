import { useFrame } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { useRef, useEffect, useState } from "react";
import { getTrignometryAngles } from "../Utility/getTrignometryAngles";
import { generatePoints } from "../Utility/generatePoints";

export const Particles = () => {
  const spheres = useRef();
  const randomPositions = useRef([]);
  const uniformPositions = useRef([]);

  const [x, setX] = useState(true);
  const [y, setY] = useState(true);
  const [z, setZ] = useState(true);

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

  const {
    quantity,
    position,
    ratio,
    env_radius,
    max_size,
    min_size,
    enable,
    range,
    x_angle,
    x_inside,
    y_angle,
    y_inside,
    z_angle,
    z_inside,
    randomness_offset,
    movement_rate,
    ...lights
  } = useControls(
    {
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
      Particles: folder({
        quantity: {
          value: 500,
          max: 1000,
          min: 100,
        },
        position: { options: ["Random", "Uniform"] },
        ratio: 5,
        env_radius: 5,
        Size: folder({
          max_size: 0.1,
          min_size: 0.1,
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
            x_inside: false,
            x_toggle: button(() => setX(!x)),
          }),
          y_axis: folder({
            y_angle: {
              options: ["sin", "cos", "tan", "sinh", "cosh", "tanh"],
              disabled: y,
            },
            y_inside: false,
            y_toggle: button(() => setY(!y)),
          }),
          z_axis: folder({
            z_angle: {
              options: ["sin", "cos", "tan", "sinh", "cosh", "tanh"],
              disabled: z,
            },
            z_inside: false,
            z_toggle: button(() => setZ(!z)),
          }),
        }),

        randomness_offset: 0.5,
        movement_rate: 0.1,
      }),
    },
    [x, y, z]
  );

  if (
    position === "Random" &&
    (!randomPositions.current.length ||
      quantity !== randomPositions.current.length)
  ) {
    randomPositions.current = [...Array(quantity)].map(() =>
      generatePoints.generateRandomPointInSphere(env_radius)
    );
    uniformPositions.current = generatePoints.generateUniformPointsInSphere(
      env_radius,
      quantity,
      ratio
    );
  }

  useEffect(() => {
    randomPositions.current = [...Array(quantity)].map(() =>
      generatePoints.generateRandomPointInSphere(env_radius)
    );
    uniformPositions.current = generatePoints.generateUniformPointsInSphere(
      env_radius,
      quantity,
      ratio
    );
  }, [
    quantity,
    env_radius,
    x_angle,
    x_inside,
    y_angle,
    y_inside,
    z_angle,
    z_inside,
    range,
    position,
    ratio,
  ]);

  const randomPos = [];
  for (let i = 0; i < quantity; i++) {
    const randomValue = Math.random() * (range.max - range.min) + range.min;
    randomPos.push(randomValue);
  }

  useFrame(({ clock }) => {
    spheres.current.children.forEach((sphere, i) => {
      const randomness = randomPos[i] * randomness_offset;

      if (enable) {
        if (!x) {
          if (x_inside) {
            const adjustmentX =
              getTrignometryAngles(clock.elapsedTime * randomness, x_angle) *
              movement_rate;
            sphere.position.x += adjustmentX;
          } else {
            const adjustmentX =
              getTrignometryAngles(clock.elapsedTime, x_angle) *
              randomness *
              movement_rate;
            sphere.position.x += adjustmentX;
          }
        }
        if (!y) {
          if (y_inside) {
            const adjustmentY =
              getTrignometryAngles(clock.elapsedTime * randomness, y_angle) *
              movement_rate;
            sphere.position.y += adjustmentY;
          } else {
            const adjustmentY =
              getTrignometryAngles(clock.elapsedTime, y_angle) *
              randomness *
              movement_rate;
            sphere.position.y += adjustmentY;
          }
        }

        if (!z) {
          if (z_inside) {
            const adjustmentZ =
              getTrignometryAngles(clock.elapsedTime * randomness, z_angle) *
              movement_rate;
            sphere.position.z += adjustmentZ;
          } else {
            const adjustmentZ =
              getTrignometryAngles(clock.elapsedTime, z_angle) *
              randomness *
              movement_rate;
            sphere.position.z += adjustmentZ;
          }
        }
      }
    });
  });

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

  const renderParticles =
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

  return (
    <group ref={spheres}>
      {renderDirectionalLights()}
      {renderParticles}
    </group>
  );
};
