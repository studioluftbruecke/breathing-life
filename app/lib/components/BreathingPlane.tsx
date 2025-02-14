import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { Tables } from "@/supabase.types";
import vertexShader from '@/app/lib/shaders/breathing/vertex.glsl'
import fragmentShader from '@/app/lib/shaders/breathing/fragment.glsl'
import { useControls } from 'leva';


// Create shader material
const BreathingShaderMaterial = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
    uWarpSpeed: 0,
    uWarpIntensity: 0,
  },
  vertexShader,
  fragmentShader,
)

// Register the material in R3F
extend({ BreathingShaderMaterial });

// Declare the custom material type for TypeScript
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      breathingShaderMaterial: any
    }
  }
}
export function BreathingPlane(props: JSX.IntrinsicElements['mesh'] & { settings: Tables<'settings'> }) {
  const shaderRef = useRef<any>(null)

  // Load the texture
  const texture = useTexture(props.settings.img_url!)
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const { warpSpeed, warpIntensity, warpMode } = useControls({
    warpSpeed: { value: 0.1, min: -10.0, max: 10.0, step: 0.01 },
    warpIntensity: { value: 0.05, min: -5.0, max: 5.0, step: 0.01 },
    warpMode: {
      options: ['mirror', 'clamp', 'repeat'],
      value: 'mirror',
    }
  });


  useEffect(() => {
    switch (warpMode) {
      case 'clamp':
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        break;
      case 'repeat':
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1); // Tile 2x2
        break;
      case 'mirror':
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(2, 2); // Tile 4x4
        break;
    }
    texture.needsUpdate = true;
  }, [warpMode])


  // Update time uniform on each frame
  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
      shaderRef.current.uniforms.uWarpSpeed.value = warpSpeed
      shaderRef.current.uniforms.uWarpIntensity.value = warpIntensity
    }
  })

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <breathingShaderMaterial
        ref={shaderRef}
        key={BreathingShaderMaterial.key}
        uTexture={texture}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}