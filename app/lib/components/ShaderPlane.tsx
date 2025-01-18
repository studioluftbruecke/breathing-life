// components/CustomShaderMaterial.tsx
import { extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'

// Import shaders
import vertexShader from '@/app/lib/shaders/vertex.glsl'
import fragmentShader from '@/app/lib/shaders/fragment.glsl'

// Create custom shader material
const CustomShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uIntensity: 1.0
  },
  vertexShader,
  fragmentShader
)

// Extend Three.js materials with our custom material
extend({ CustomShaderMaterial })

// Declare the custom material type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      customShaderMaterial: any
    }
  }
}

// Create the component that uses the shader
function ShaderPlane(props: JSX.IntrinsicElements['mesh']){
  const meshRef = useRef<THREE.Mesh>(null)
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
      position={props.position ?? [0, 0, 0]}
      {...props}
    >
      <planeGeometry args={[1, 1, 16, 16]} />
      {/* <sphereGeometry args={[1, 32, 32]} /> */}
      {/* <torusKnotGeometry args={[0.5, 0.1, 16, 16]} /> */}
      {/* <customShaderMaterial ref={materialRef} side={THREE.DoubleSide} /> */}
      <customShaderMaterial 
        ref={materialRef}
        transparent
        uTexture={texture}
        uIntensity={intensity}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default ShaderPlane