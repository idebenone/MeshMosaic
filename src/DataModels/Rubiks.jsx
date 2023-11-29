import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";

const AXIS = {
  x: 0.001,
  y: 0.001,
  z: 0.001,
};

const COLORS = {
  standard: "#b3b3b3",
  edges: "#b0aeae",
};

const SCALE = {
  x: 0.25,
  y: 0.25,
  z: 0.25,
};

const getScale = (elapsedTime, offset, rate, constant, offsetValue) => {
  if (constant) {
    return Math.sin(elapsedTime * rate) + offsetValue;
  } else {
    return Math.sin((elapsedTime - offset) * rate) + offsetValue;
  }
};

const createCube = (geometry, material, position) => {
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      key={position.toString()}
    >
      <Edges color={COLORS.edges} />
    </mesh>
  );
};

export const RubiksEngine = () => {
  const {
    rotation,
    rotation_axis,
    scale,
    scale_animation,
    scale_constant,
    scale_rate,
    scale_offset,
  } = useControls({
    Rubiks: folder({
      rotation: false,
      rotation_axis: AXIS,
      scale: SCALE,
      scale_animation: false,
      scale_constant: true,
      scale_rate: { value: 2 },
      scale_offset: { value: 2 },
    }),
  });

  const cubes = useRef();
  const boxGeometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
  const standardMaterial = new THREE.MeshStandardMaterial({ color: "#b3b3b3" });
  const positions = [
    [0, 0, 0],
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
    [-1, -1, 0],
    [-1, -1, -1],
    [0, -1, -1],
    [-1, 1, 0],
    [0, 1, 0],
    [-1, 1, -1],
    [0, 1, -1],
    [-1, 0, -1],
    [-1, 1, 1],
    [0, 1, 1],
    [-1, -1, 1],
    [0, -1, 1],
    [-1, 0, 1],
    [0, 0, 1],
    [1, 0, 0],
    [1, 0, -1],
    [1, -1, 0],
    [1, -1, -1],
    [1, 1, 0],
    [1, 1, -1],
    [1, 1, 1],
    [1, -1, 1],
    [1, 0, 1],
  ];

  useFrame(({ clock }) => {
    cubes.current.children.forEach((cube, i) => {
      if (scale_animation) {
        const offset = i + 1;
        const scaleValue = getScale(
          clock.elapsedTime,
          offset,
          scale_rate,
          scale_constant,
          scale_offset
        );
        cube.scale.set(scaleValue, scaleValue, scaleValue);
      }
    });

    if (rotation) {
      cubes.current.rotation.x += rotation_axis.x;
      cubes.current.rotation.y += rotation_axis.y;
      cubes.current.rotation.z += rotation_axis.z;
    }
  });

  return (
    <>
      <group ref={cubes}>
        {positions.map((position, i) =>
          createCube(boxGeometry, standardMaterial, position)
        )}
      </group>
    </>
  );
};
