"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * A procedural stand-in shown when a project has no .glb uploaded yet, so the
 * viewer is demonstrably working before James exports anything.
 *
 * Delete nothing: it stays useful as the fallback for any future project whose
 * model isn't ready. Positions are hard-coded (not random) so the scene is
 * identical on every render.
 */

const ROCKS: [number, number, number, number][] = [
  // x, z, scale, rotation
  [1.5, 0.9, 0.28, 0.4],
  [-1.7, 0.5, 0.22, 1.1],
  [0.6, -1.6, 0.32, 2.2],
  [-1.1, -1.4, 0.19, 0.8],
  [1.9, -0.6, 0.16, 1.7],
];

const TREES: [number, number, number][] = [
  // x, z, scale
  [-0.7, 1.2, 1.0],
  [0.2, 1.5, 0.8],
  [-1.4, -0.3, 0.9],
  [0.9, 0.4, 0.72],
  [-0.2, -0.9, 0.85],
];

export function PlaceholderIsland() {
  // One shader family, as the project write-up describes.
  const materials = useMemo(
    () => ({
      grass: new THREE.MeshStandardMaterial({ color: "#6f8f4a", roughness: 0.9, flatShading: true }),
      soil: new THREE.MeshStandardMaterial({ color: "#7a5c42", roughness: 1, flatShading: true }),
      rock: new THREE.MeshStandardMaterial({ color: "#8a8781", roughness: 0.85, flatShading: true }),
      foliage: new THREE.MeshStandardMaterial({ color: "#4f7a3f", roughness: 0.95, flatShading: true }),
      trunk: new THREE.MeshStandardMaterial({ color: "#5b4331", roughness: 1, flatShading: true }),
      water: new THREE.MeshStandardMaterial({
        color: "#2f6f80",
        roughness: 0.25,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
        flatShading: true,
      }),
    }),
    [],
  );

  return (
    <group>
      {/* Water disc */}
      <mesh position={[0, -0.62, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={materials.water}>
        <circleGeometry args={[3.2, 48]} />
      </mesh>

      {/* Island body: a low-poly plug of soil */}
      <mesh position={[0, -0.55, 0]} material={materials.soil} castShadow receiveShadow>
        <cylinderGeometry args={[2.35, 1.35, 1.1, 7, 1]} />
      </mesh>

      {/* Grass cap */}
      <mesh position={[0, 0.05, 0]} material={materials.grass} castShadow receiveShadow>
        <cylinderGeometry args={[2.4, 2.35, 0.22, 7, 1]} />
      </mesh>

      {/* Headland */}
      <mesh position={[-0.55, 0.62, -0.5]} material={materials.rock} castShadow receiveShadow>
        <coneGeometry args={[0.95, 1.15, 6, 1]} />
      </mesh>

      {ROCKS.map(([x, z, s, r], i) => (
        <mesh
          key={`rock-${i}`}
          position={[x, 0.16 + s * 0.5, z]}
          rotation={[r * 0.3, r, r * 0.2]}
          scale={s}
          material={materials.rock}
          castShadow
          receiveShadow
        >
          <icosahedronGeometry args={[1, 0]} />
        </mesh>
      ))}

      {TREES.map(([x, z, s], i) => (
        <group key={`tree-${i}`} position={[x, 0.16, z]} scale={s}>
          <mesh position={[0, 0.18, 0]} material={materials.trunk} castShadow>
            <cylinderGeometry args={[0.055, 0.075, 0.36, 5]} />
          </mesh>
          <mesh position={[0, 0.62, 0]} material={materials.foliage} castShadow>
            <coneGeometry args={[0.34, 0.85, 6, 1]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
