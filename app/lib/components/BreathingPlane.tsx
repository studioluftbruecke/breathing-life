import { useState, useRef } from 'react'
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
    uBreathingSpeed: 0,
    uBreathingIntensity: 0,
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
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  const { uBreathingSpeed, uBreathingIntensity } = useControls({
    uBreathingSpeed: { value: 0.01, min: 0.01, max: 1.0, step: 0.01 },
    uBreathingIntensity: { value: 0.02, min: 0.0, max: 1.0, step: 0.01 },
  });


  // Update time uniform on each frame
  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
      shaderRef.current.uniforms.uBreathingSpeed.value = uBreathingSpeed
      shaderRef.current.uniforms.uBreathingIntensity.value = uBreathingIntensity
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