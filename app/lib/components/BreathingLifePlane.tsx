import { useState, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { Tables } from "@/supabase.types";
import vertexShader from '@/app/lib/shaders/breathingLife/vertex.glsl'
import simplexNoiseFragmentShader from '@/app/lib/shaders/breathingLife/simplexNoiseFragment.glsl'
import worleyNoiseFragmentShader from '@/app/lib/shaders/breathingLife/worleyNoiseFragment.glsl'
import { useControls } from 'leva';


// // Create simplexNoise shader material
// const SimplexNoiseShaderMaterial = shaderMaterial(
//   {
//     uTexture: 0,
//     uTime: 0,
//     uSpeed: 0,
//     uIntensity: 0,
//     uNoiseScale: 0,
//   },
//   vertexShader,
//   simplexNoiseFragmentShader,
// )

// // Register the material in R3F
// extend({ SimplexNoiseShaderMaterial });


// // Create worley shader material
// const WorleyNoiseShaderMaterial = shaderMaterial(
//   {
//     uTexture: 0,
//     uTime: 0,
//     uSpeed: 0,
//     uIntensity: 0,
//     uNoiseScale: 0,
//   },
//   vertexShader,
//   simplexNoiseFragmentShader,
// )

// // Register the material in R3F
// extend({ WorleyNoiseShaderMaterial });

// // Declare the custom material type for TypeScript
// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace JSX {
//     interface IntrinsicElements {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       simplexNoiseShaderMaterial: any
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       worleyNoiseShaderMaterial: any
//     }
//   }
// }


export function BreathingLifePlane(props: JSX.IntrinsicElements['mesh'] & { settings: Tables<'settings'> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const { viewport } = useThree();

  const [texturePath, setTexturePath] = useState(props.settings.img_url!)

  // Load the texture
  const texture = useTexture(texturePath)
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const { textureWrapMode, effectType, speed, intensity, noiseScale, image } = useControls({
    // warpSpeed: { value: 0.1, min: -10.0, max: 10.0, step: 0.01 },
    // warpIntensity: { value: 0.05, min: -5.0, max: 5.0, step: 0.01 },
    textureWrapMode: {
      options: ['mirror', 'clamp', 'repeat'],
      value: 'mirror',
    },
    effectType: {
      value: 'worley',
      options: ['simplex', 'worley']
    },
    speed: { value: 0.05, min: -5.0, max: 5.0, step: 0.01 },
    intensity: { value: 0.02, min: -10.0, max: 10.0, step: 0.01 },
    noiseScale: { value: 4.0, min: -10, max: 10, step: 0.1 },
    image: { image: undefined }
  });

  useEffect(() => {
    if (!image) return;
    setTexturePath(image)
    const img = new Image();
    img.src = image;
    img.onload = () => {
      // Calculate aspect ratio
      const aspectRatio = img.width / img.height;

      // Ensure the plane fits within the camera's view
      const maxWidth = viewport.width * 0.8; // 80% of viewport width
      const maxHeight = viewport.height * 0.8; // 80% of viewport height

      let planeWidth = maxWidth;
      let planeHeight = maxWidth / aspectRatio;

      if (planeHeight > maxHeight) {
        planeHeight = maxHeight;
        planeWidth = maxHeight * aspectRatio;
      }
      setDimensions({ width: planeWidth, height: planeHeight });
    };
  }, [image]);


  useEffect(() => {
    switch (textureWrapMode) {
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
  }, [textureWrapMode])


  // Update time uniform on each frame
  useFrame((state) => {
    if (meshRef.current) {
      const shaderMaterial = meshRef.current.material as THREE.ShaderMaterial
      shaderMaterial.uniforms.uTime.value = state.clock.getElapsedTime()
      shaderMaterial.uniforms.uSpeed.value = speed
      shaderMaterial.uniforms.uIntensity.value = intensity
      shaderMaterial.uniforms.uNoiseScale.value = noiseScale
    }
  })

  const materials: {[key: string]: THREE.ShaderMaterial} = useMemo(() => {
    const uniforms = {
      uTexture: { value: 0 },
      uTime: { value: 0 },
      uSpeed: { value: 0 },
      uIntensity: { value: 0 },
      uNoiseScale: { value: 0 },
    }
    return {
      simplex: new THREE.ShaderMaterial({
        uniforms: { ...uniforms },
        vertexShader,
        fragmentShader: simplexNoiseFragmentShader
      }),
      worley: new THREE.ShaderMaterial({
        uniforms: { ...uniforms },
        vertexShader,
        fragmentShader: worleyNoiseFragmentShader
      })
    }
  }, [])


  useEffect(() => {
    if (!meshRef.current) return
    const shaderMaterial = meshRef.current.material as THREE.ShaderMaterial
    shaderMaterial.uniforms.uTexture.value = texture
  }, [texture])

  return (
    <mesh ref={meshRef} material={materials[effectType]}>
      <planeGeometry args={[dimensions.width, dimensions.height]} />
      {/* {effectType === 'Simplex' &&
        <simplexNoiseShaderMaterial
          ref={shaderRef}
          key={SimplexNoiseShaderMaterial.key}
          uTexture={texture}
          side={THREE.DoubleSide}
        />
      }
      {effectType === 'Worley' &&
        <worleyNoiseShaderMaterial
          ref={shaderRef}
          key={WorleyNoiseShaderMaterial.key}
          uTexture={texture}
          side={THREE.DoubleSide}
        />
      } */}
    </mesh>
  )
}