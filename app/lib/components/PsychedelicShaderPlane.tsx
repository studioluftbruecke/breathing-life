import { useFrame, extend, useLoader } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { TextureLoader } from "three";
import vertexShader from '@/app/lib/shaders/psychedelic_loka_vision/vertex.glsl'
import fragmentShader from '@/app/lib/shaders/psychedelic_loka_vision/fragment.glsl'
import { Tables } from "@/supabase.types";
import { useControls } from "leva";


// Define Shader Material
const PsychedelicMaterial = shaderMaterial(
  {
    uWaveAmplitude: 0,
    uShiftAmplitude: 0,
    uShiftOffset: 0,
    time: 0,
    imageTexture: null
  },
  vertexShader,
  fragmentShader
);
extend({ PsychedelicMaterial });

// Declare the custom material type for TypeScript
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      psychedelicMaterial: any
    }
  }
}

export const PsychedelicPlane = (props: JSX.IntrinsicElements['mesh'] & { settings: Tables<'settings'> }) => {
  const materialRef = useRef<any>();
  const imageTexture = useLoader(TextureLoader, props.settings.img_url!);
  imageTexture.wrapS = imageTexture.wrapT = THREE.RepeatWrapping
  imageTexture.minFilter = THREE.LinearFilter

  const { uWaveAmplitude, uShiftAmplitude, uShiftOffset } = useControls({
    uWaveAmplitude: { value: 0.05, min: 0.01, max: 0.99, step: 0.01 },
    uShiftAmplitude: { value: 0.5, min: 0.0, max: 1.0, step: 0.01 },
    uShiftOffset: { value: 0.5, min: 0.0, max: 1.0, step: 0.01 },
  });

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.uWaveAmplitude.value = uWaveAmplitude
      materialRef.current.uniforms.uShiftAmplitude.value = uShiftAmplitude
      materialRef.current.uniforms.uShiftOffset.value = uShiftOffset
    }
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <psychedelicMaterial
        ref={materialRef}
        imageTexture={imageTexture}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};