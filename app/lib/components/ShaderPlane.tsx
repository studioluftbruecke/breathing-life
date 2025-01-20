// components/CustomShaderMaterial.tsx
import { extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'

// Import shaders
import vertexShader from '@/app/lib/shaders/vertex.glsl'
import fragmentShader from '@/app/lib/shaders/fragment.glsl'
import { useWindowSize } from '../hooks/useWindowSize'
import { useControls } from 'leva'

// Create custom shader material
const CustomShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    filterVar1: 0,
    filterVar2: 0
  },
  vertexShader,
  fragmentShader
)

// Extend Three.js materials with our custom material
extend({ CustomShaderMaterial })

// Declare the custom material type for TypeScript
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customShaderMaterial: any
    }
  }
}

// Create the component that uses the shader
function ShaderPlane(props: JSX.IntrinsicElements['mesh']){
  // const [filterVar1, setFilterVar1] = useState(0)
  // const [filterVar2, setFilterVar2] = useState(0)

  const { filterVar1, filterVar2 } = useControls({ filterVar1: {
    value: 0,
    min: 0,
    max: 23,
    step: 0.01,
  }, filterVar2: {
    value: 0,
    min: -100,
    max: 100,
    step: 0.1,
  } })


  const meshRef = useRef<THREE.Mesh>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null)

  const { texturePath, intensity } = {
    texturePath: '/IMG_9969.jpg',
    intensity: 1
  }

  // Load texture
  const texture = useLoader(THREE.TextureLoader, texturePath)
  
  // Optional: Configure texture
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearFilter

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
      materialRef.current.uIntensity = intensity
    }
  })

  return (
    <mesh
      ref={meshRef}
      {...props}
    >
      <planeGeometry args={[1, 1, 16, 16]} />
      {/* <sphereGeometry args={[1, 32, 32]} /> */}
      {/* <torusKnotGeometry args={[0.5, 0.1, 16, 16]} /> */}
      {/* <customShaderMaterial ref={materialRef} side={THREE.DoubleSide} /> */}
      <customShaderMaterial 
        ref={materialRef}
        uTexture={texture}
        filterVar1={filterVar1}
        filterVar2={filterVar2}
        transparent
        uIntensity={intensity}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default ShaderPlane