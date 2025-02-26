import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import vertexShader from '@/app/lib/shaders/temporal_frame_glitch/vertex.glsl'
import fragmentShader from '@/app/lib/shaders/temporal_frame_glitch/fragment.glsl'
import { WebGLRenderTarget, TextureLoader, LinearFilter } from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
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
    glitchIntensity: 0,  // Controls glitch level dynamically
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


export const TemporalInterpolationGlitchShaderPlane = (props: JSX.IntrinsicElements['mesh'] & { settings: Tables<'settings'> }) => {
  const shaderRef = useRef<any>();
  const { gl, scene, camera } = useThree();

  // Load the image texture
  const imageTexture = useLoader(TextureLoader, props.settings.img_url!);

  // Create ping-pong framebuffers
  const [fboA, setFboA] = useState(() => new WebGLRenderTarget(window.innerWidth, window.innerHeight));
  const [fboB, setFboB] = useState(() => new WebGLRenderTarget(window.innerWidth, window.innerHeight));

  // Track time for transition effect
  // const [mixFactor, setMixFactor] = useState(0);
  // const [glitchIntensity, setGlitchIntensity] = useState(0);

  useEffect(() => {
    fboA.texture.minFilter = fboB.texture.minFilter = LinearFilter;
  }, [fboA, fboB]);

  const { decaySpeed, noiseFactor, mixFactor, glitchIntensity } = useControls({
      decaySpeed: { value: 0.01, min: 0.01, max: 0.99, step: 0.01 },
      noiseFactor: { value: 0.02, min: 0.0, max: 1.0, step: 0.01 },
      mixFactor: { value: 0.01, min: 0.0, max: 1.0, step: 0.01 },
      glitchIntensity: { value: 0.01, min: 0.0, max: 10.0, step: 0.01 },
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

    // Increase mixFactor over time for a smooth transition
    shaderRef.current.mixFactor = mixFactor;

    // Randomly trigger glitch effects
    // setGlitchIntensity(Math.random() > 0.95 ? 0.5 : 0.0);
    shaderRef.current.glitchIntensity = glitchIntensity;

    // Swap buffers for next frame
    // [setFboA, setFboB] = [setFboB, setFboA];
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <temporalShaderMaterial ref={shaderRef} />
    </mesh>
  );
};