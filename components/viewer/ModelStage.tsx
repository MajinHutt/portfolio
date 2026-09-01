"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Bounds,
  Environment,
  Lightformer,
  OrbitControls,
  useAnimations,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils, type OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PlaceholderIsland } from "./PlaceholderIsland";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import type { ViewerMode } from "./types";

/**
 * Cinematic grade. Two effects only, both deliberately restrained.
 *
 * The failure mode of postprocessing on a portfolio is obvious: heavy bloom and
 * chromatic aberration read as a filter applied to hide the model rather than
 * to present it. A modeller looking at this wants to see topology and material
 * response, not a glow.
 *
 * So: bloom with a high luminance threshold, which means only genuine
 * highlights (a specular hit, an emissive) pick up any lift at all, and nothing
 * mid-tone does. Plus a vignette shallow enough that you would not name it if
 * asked what was different, but which stops the render bleeding into the plate
 * edges and keeps the eye centred.
 *
 * Chromatic aberration, depth of field, noise and scanlines were all
 * considered and rejected: each one obscures the thing being shown.
 *
 * Set CINEMATIC to false to turn the whole pass off.
 */
const CINEMATIC = true;

/**
 * The R3F scene. Loaded via next/dynamic with `ssr: false` from ProjectViewer,
 * so three.js stays out of the initial bundle entirely.
 *
 * Why react-three-fiber and not <model-viewer>: the design requires
 * Shaded / Wireframe / Clay display modes that swap materials on the loaded
 * mesh. <model-viewer> has no material-override API for that: you'd be reaching
 * into its internal scene graph anyway. Since we need R3F for the detail page,
 * using it for the hero too avoids shipping two 3D runtimes. (See docs/DECISIONS.md.)
 */

/**
 * Materials used for the non-shaded display modes. Created once.
 *
 * Both are DoubleSide deliberately. glTF materials carry a `doubleSided` flag,
 * which Blender sets whenever backface culling is off, and every model here
 * exports that way. three.js honours it for the authored materials but these
 * overrides are built from scratch, and three defaults new materials to
 * FrontSide. The result was back-facing polygons being culled in clay and
 * wireframe only: the chair appeared to have holes through its lower backrest
 * and armrest that were not there in shaded mode.
 *
 * DoubleSide is also simply the right choice for an inspection mode. Culling
 * hides geometry, and hidden geometry is the opposite of what someone switching
 * to wireframe is trying to see.
 */
const WIREFRAME_MATERIAL = new THREE.MeshBasicMaterial({
  color: "#f3f2f2",
  wireframe: true,
  side: THREE.DoubleSide,
});

const CLAY_MATERIAL = new THREE.MeshStandardMaterial({
  // A true mid grey, not the near-white this started as. Under the studio
  // environment a light albedo clipped to flat white and lost the shading
  // gradation across curved surfaces, which is the entire point of a clay
  // pass. Darker albedo gives the falloff somewhere to happen.
  color: "#a8a29e",
  roughness: 0.9,
  metalness: 0,
  side: THREE.DoubleSide,
});

/**
 * Swaps materials on every mesh below it to match the active display mode,
 * stashing the original on first run so "Shaded" can be restored exactly.
 */
function DisplayMode({
  mode,
  children,
}: {
  mode: ViewerMode;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const root = group.current;
    if (!root) return;

    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      // Stash the original once.
      if (!child.userData.originalMaterial) {
        child.userData.originalMaterial = child.material;
      }

      if (mode === "wireframe") {
        child.material = WIREFRAME_MATERIAL;
      } else if (mode === "clay") {
        child.material = CLAY_MATERIAL;
      } else {
        child.material = child.userData.originalMaterial;
      }
    });
  }, [mode, children]);

  return <group ref={group}>{children}</group>;
}

function LoadedModel({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url, "/draco/");

  /**
   * Clone the scene, always.
   *
   * useGLTF caches by URL and hands back the same Object3D to every caller. A
   * three.js object can only have one parent, so rendering it in two places
   * does not duplicate it: the second mount steals it from the first.
   *
   * That is exactly what happened when the homepage cards became live viewers.
   * The hero and the feature card both show red-velvet-chair/chair.glb, so the
   * card yanked the chair out of the hero and the hero went blank a moment
   * after loading.
   *
   * SkeletonUtils.clone rather than scene.clone() because it also rebinds
   * skinned meshes to their cloned skeleton, which a plain clone leaves
   * pointing at the original's bones.
   */
  const model = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Any clips exported with the model play on a loop. The island's boat rocks
  // on the water this way, which is the sort of thing a still render cannot
  // show and is half the reason for having a live viewer at all.
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!animations.length) return;

    // A model that moves on its own is exactly what reduced motion is asking
    // about, so it stays on its first frame instead.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Wrapped because a clip whose target nodes cannot be resolved will throw
    // from inside three's PropertyBinding, and a model that fails to animate
    // should still be a model you can look at.
    const playing = Object.values(actions).filter(Boolean);
    try {
      playing.forEach((action) => {
        action?.reset().setLoop(THREE.LoopRepeat, Infinity).play();
      });
    } catch (error) {
      console.error("[viewer] could not start the model's animation:", error);
    }

    return () => {
      try {
        playing.forEach((action) => action?.stop());
      } catch {
        // The mixer may already be gone if the scene unmounted first.
      }
    };
  }, [actions, animations]);

  // Enable shadow casting on the author's geometry.
  useLayoutEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [model]);

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

/**
 * Auto-rotate until the viewer is first touched, then stop for good:
 * and never start at all under prefers-reduced-motion.
 */
function Controls({
  interacted,
  allowZoom,
}: {
  interacted: React.MutableRefObject<boolean>;
  allowZoom: boolean;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current && controls.current) {
      controls.current.autoRotate = false;
    }
  }, []);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      // The hero is a full-bleed background: if it swallowed the wheel event
      // the page would become unscrollable over it. Drag-to-orbit still works.
      enableZoom={allowZoom}
      autoRotate={!interacted.current}
      autoRotateSpeed={0.6}
      minDistance={2}
      maxDistance={14}
      // Constrain vertical orbit so the model can't be viewed from underneath.
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI * 0.495}
      onStart={() => {
        interacted.current = true;
        if (controls.current) controls.current.autoRotate = false;
      }}
    />
  );
}

/**
 * Reports load progress up to the wrapper so the overlay can be determinate.
 * Lives inside the Canvas so drei is never pulled into the main bundle.
 */
function ProgressReporter({
  onProgress,
}: {
  onProgress: (percent: number) => void;
}) {
  const { progress, active } = useProgress();

  useEffect(() => {
    onProgress(active ? progress : 100);
  }, [progress, active, onProgress]);

  return null;
}

/** Fires once the suspended model has actually resolved. */
function LoadSignal({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);
  return null;
}

export default function ModelStage({
  url,
  mode,
  allowZoom,
  active,
  onProgress,
  onLoaded,
  onContextLost,
}: {
  url: string | null;
  mode: ViewerMode;
  allowZoom: boolean;
  /** False when the stage is scrolled well off screen: stops the render loop. */
  active: boolean;
  onProgress: (percent: number) => void;
  onLoaded: () => void;
  onContextLost: () => void;
}) {
  const interacted = useRef(false);

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      // Stops rendering entirely when scrolled away: no GPU, no battery drain.
      frameloop={active ? "always" : "never"}
      // Lets AdaptiveDpr drop resolution rather than drop frames on weak GPUs.
      performance={{ min: 0.5 }}
      camera={{ position: [4.5, 3, 5.5], fov: 38 }}
      gl={{
        antialias: true,
        preserveDrawingBuffer: true /* TEMP-CAPTURE */,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        // The plate colour, so there is no flash of a different ground.
        gl.setClearColor("#16150f");
        // Filmic tone mapping holds highlights instead of clipping them to
        // white, which is what makes a render read as a render rather than as
        // a screenshot of a viewport.
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.domElement.addEventListener("webglcontextlost", onContextLost);
      }}
    >
      {/* Explicit three-point lighting rather than drei's <Environment preset>,
          which would fetch a multi-megabyte HDRI from a third-party CDN on every
          page view. Swap it in later if you want truer reflections. */}
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#cfd8dc", "#2b2a24", 0.45]} />
      <directionalLight
        position={[5, 7, 4]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-6, 3, -4]} intensity={0.6} color="#ffd9c9" />

      {/* A studio environment built from light shapes rather than loaded from
          an HDRI file. Same benefit for reflections and roughness response,
          with no multi-megabyte download from a third-party CDN. `frames={1}`
          bakes it once instead of every frame. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 4, 2]}
          scale={[9, 4, 1]}
          color="#fff6ef"
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[-5, 1, -2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[6, 4, 1]}
          color="#cfe0ff"
        />
        <Lightformer
          form="ring"
          intensity={0.9}
          position={[4, 2, 3]}
          scale={3}
          color="#ffd9c9"
        />
      </Environment>

      <ProgressReporter onProgress={onProgress} />

      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.25}>
          <DisplayMode mode={mode}>
            {url ? <LoadedModel url={url} /> : <PlaceholderIsland />}
          </DisplayMode>
        </Bounds>
        <LoadSignal onLoaded={onLoaded} />
      </Suspense>

      <Controls interacted={interacted} allowZoom={allowZoom} />

      {/* Shaded only. Wireframe and clay are technical reads, and the grade
          would sit between the viewer and the thing being read: bloom on a
          light clay surface washes out exactly the shading that shows form. */}
      {CINEMATIC && mode === "shaded" && (
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom
            // Only true highlights lift. At 0.9 a mid-grey surface contributes
            // nothing, which is what keeps this from looking like a filter.
            luminanceThreshold={0.9}
            luminanceSmoothing={0.28}
            intensity={0.45}
            mipmapBlur
          />
          <Vignette offset={0.32} darkness={0.42} eskil={false} />
        </EffectComposer>
      )}

      {/* Drops pixel ratio while the camera is moving, restores it when still:
          smooth orbiting on a laptop, full crispness the moment you let go. */}
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}

/**
 * Warm the cache for a model before its viewer mounts. Called from the
 * homepage for the hero piece, so the first thing a visitor sees is ready.
 */
export function preloadModel(url: string) {
  useGLTF.preload(url, "/draco/");
}
