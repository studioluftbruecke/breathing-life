// components/CustomShaderMaterial.tsx
import { extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'

// Import shaders
import vertexShader from '@/app/lib/shaders/vertex.glsl'
import fragmentShader from '@/app/lib/shaders/fragment.glsl'
import { useWindowSize } from '../hooks/useWindowSize'
import { button, useControls } from 'leva'
import { updateRowSupabase } from '../actions.ts/supabase'
import { toast } from 'react-toastify';
import { Tables } from '@/supabase.types'


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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ShaderPlane(props: JSX.IntrinsicElements['mesh'] & { settings: Tables<'settings'> }){
  // const [filterVar1, setFilterVar1] = useState(0)
  // const [filterVar2, setFilterVar2] = useState(0)

  const [texturePath, _setTexturePath] = useState('/IMG_9969.jpg')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [filterValues, setFilterValues] = useState<any>(props.settings?.filter_values)

  // useEffect(() => {
  //   if (props.settings) {
  //     setFilterValues(props.settings.filter_values)
  //   }
  // }, [props.settings])

  const { filterVar1, filterVar2 } = useControls({ filterVar1: {
    value: (props.settings?.filter_values as any)?.filter_value_1 ?? 0,
    min: 0,
    max: 10,
    step: 0.01,
  }, filterVar2: {
    value: (props.settings?.filter_values as any)?.filter_value_2 ?? 0,
    min: -100,
    max: 100,
    step: 0.1,
  },
  Save: button(async (get) => {
    const _filterVar1 = get('filterVar1')
    const _filterVar2 = get('filterVar2')
    await handleSaveFilterValues(_filterVar1, _filterVar2)
    toast("Saved!")
  })
}, [(props.settings?.filter_values as any)?.filter_value_1, (props.settings?.filter_values as any)?.filter_value_2])


async function handleSaveFilterValues(filterVar1: number, filterVar2: number) {
  if (!props.settings.id) {
    throw new Error('No id to store settings to')
  }
  const data = {
    filter_values: {
      filter_value_1: filterVar1,
      filter_value_2: filterVar2
    },
  }
  const result = await updateRowSupabase('settings', data,
    'id',
    props.settings.id
  )
}


  const meshRef = useRef<THREE.Mesh>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null)

  const { intensity } = {
    intensity: 3
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
    <>
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
    </>
    )
}

export default ShaderPlane