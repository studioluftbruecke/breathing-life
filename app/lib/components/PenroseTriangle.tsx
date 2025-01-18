declare global {
  namespace JSX {
    interface IntrinsicElements {
      penroseMaterial: any
    }
  }
}

import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'

import vertexShader from '@/app/lib/shaders/penrose/vertex.glsl'
import fragmentShader from '@/app/lib/shaders/penrose/fragment.glsl'

const PenroseMaterial = shaderMaterial(
  {},
  vertexShader,
  fragmentShader
)

extend({ PenroseMaterial })

const PenroseTriangle = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  const createPenroseGeometry = () => {
    const geometry = new THREE.BufferGeometry()
    
    // Scale factor for the triangle
    const s = 1.0
    // Bar width
    const w = 0.2 * s
    
    // Define the vertices for the three bars in isometric perspective
    const vertices = new Float32Array([
      // Horizontal bar
      -s, 0, 0,     -s, w, 0,      0, w, 0,     0, 0, 0,      // front
      -s, 0, -w,    -s, w, -w,     0, w, -w,    0, 0, -w,     // back
      
      // Diagonal bar
      -w*0.5, 0, -w*0.5,    w*0.5, 0, -w*0.5,     s*0.6, s*0.8, -w*0.5,    s*0.6-w, s*0.8, -w*0.5,  // front
      -w*0.5, 0, w*0.5,     w*0.5, 0, w*0.5,      s*0.6, s*0.8, w*0.5,     s*0.6-w, s*0.8, w*0.5,   // back
      
      // Vertical bar
      s*0.6-w, s*0.8-w, 0,    s*0.6, s*0.8-w, 0,    s*0.6, s*0.8, 0,    s*0.6-w, s*0.8, 0,     // front
      s*0.6-w, s*0.8-w, -w,   s*0.6, s*0.8-w, -w,   s*0.6, s*0.8, -w,   s*0.6-w, s*0.8, -w     // back
    ])

    // Define indices for triangles
    const indices = new Uint16Array([
      // Horizontal bar
      0, 1, 2,    0, 2, 3,    // front
      4, 6, 5,    4, 7, 6,    // back
      0, 4, 1,    1, 4, 5,    // left
      2, 6, 3,    3, 6, 7,    // right
      1, 5, 2,    2, 5, 6,    // top
      0, 3, 4,    3, 7, 4,    // bottom
      
      // Diagonal bar
      8, 9, 10,   8, 10, 11,  // front
      12, 14, 13, 12, 15, 14, // back
      8, 12, 9,   9, 12, 13,  // bottom
      10, 14, 11, 11, 14, 15, // top
      9, 13, 10,  10, 13, 14, // right
      8, 11, 12,  11, 15, 12, // left
      
      // Vertical bar
      16, 17, 18, 16, 18, 19, // front
      20, 22, 21, 20, 23, 22, // back
      16, 20, 17, 17, 20, 21, // bottom
      18, 22, 19, 19, 22, 23, // top
      17, 21, 18, 18, 21, 22, // right
      16, 19, 20, 19, 23, 20  // left
    ])

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))
    geometry.computeVertexNormals()

    return geometry
  }

  return (
    <mesh
      ref={meshRef}
      geometry={createPenroseGeometry()}
      rotation={[-Math.PI / 6, Math.PI / 4, 0]} // Isometric angle
      position={[0, 0, 0]}
    >
      <penroseMaterial />
    </mesh>
  )
}

export default PenroseTriangle