import { extend, useLoader } from "@react-three/fiber";
import { shaderMaterial, useFBO } from "@react-three/drei";
// import { vertexShader, fragmentShader } from "@/app/lib/shaders/TemporalShader"; // Import shaders
import { useRef, useEffect, useState } from "react";
import { LinearFilter, WebGLRenderTarget } from "three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from '@/app/lib/shaders/temporal_frame_interpolation/vertex.glsl'
import fragmentShader from '@/app/lib/shaders/temporal_frame_interpolation/fragment.glsl'
import { Tables } from "@/supabase.types";
import { useControls } from "leva";


// Create a custom ShaderMaterial
const TemporalShaderMaterial = shaderMaterial(
  {
    currentFrameTexture: null,
    previousFrameTexture: null,
    imageTexture: null,
    decaySpeed: 0.95,
    noiseFactor: 0.02,
    time: 0,
    mixFactor: 0,  // Starts with image, then fades to effect
  },
  vertexShader,
  fragmentShader
);

// Register the material in R3F
extend({ TemporalShaderMaterial });

// Declare the custom material type for TypeScript
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      temporalShaderMaterial: any
    }
  }
}



export const TemporalInterpolationShaderPlane = (props: JSX.IntrinsicElements['mesh'] & { settings: Tables<'settings'> }) => {
  const shaderRef = useRef<any>(null!);
  // const { gl, scene, camera } = useThree();

  // Load the image texture
  const imageTexture = useLoader(THREE.TextureLoader, props.settings.img_url!)

  // Create ping-pong framebuffers
  const [fboA, setFboA] = useState(() => new WebGLRenderTarget(window.innerWidth, window.innerHeight));
  const [fboB, setFboB] = useState(() => new WebGLRenderTarget(window.innerWidth, window.innerHeight));

  // Track time for transition effect
  // const [mixFactor, setMixFactor] = useState(0);

  useEffect(() => {
    fboA.texture.minFilter = fboB.texture.minFilter = LinearFilter;
  }, [fboA, fboB]);
  
  const { decaySpeed, noiseFactor, mixFactor } = useControls({
    decaySpeed: { value: 0.01, min: 0.01, max: 0.99, step: 0.01 },
    noiseFactor: { value: 0.02, min: 0.0, max: 1.0, step: 0.01 },
    mixFactor: { value: 0.01, min: 0.0, max: 1.0, step: 0.01 },
  });

  useFrame(({ gl, scene, camera }, delta) => {
    if (!shaderRef.current) return;
    shaderRef.current.decaySpeed = decaySpeed;
    shaderRef.current.noiseFactor = noiseFactor;
    shaderRef.current.mixFactor = mixFactor;

    // Swap framebuffers (ping-pong technique)
    gl.setRenderTarget(fboA);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Update shader textures
    shaderRef.current.currentFrameTexture = fboA.texture;
    shaderRef.current.previousFrameTexture = fboB.texture;
    shaderRef.current.imageTexture = imageTexture;
    shaderRef.current.time += delta;

    // Swap buffers for next frame
    // [setFboA, setFboB] = [setFboB, setFboA];
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <temporalShaderMaterial
        ref={shaderRef}
        key={TemporalShaderMaterial.key}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};