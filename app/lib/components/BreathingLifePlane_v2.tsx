import { useState, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { Tables } from "@/supabase.types";
import vertexShader from '@/app/lib/shaders/breathingLife/vertex.glsl'
import simplexAndWorleyNoiseFragmentShader from '@/app/lib/shaders/breathingLife/simplexAndWorleyNoiseFragment.glsl'
import { useControls } from 'leva';


export function BreathingLifePlane_v2(props: JSX.IntrinsicElements['mesh'] & { settings: Tables<'settings'> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const { viewport } = useThree();

  const [texturePath, setTexturePath] = useState(props.settings.img_url!)

  // Load the texture
  const texture = useTexture(texturePath)
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const { textureWrapMode, effectType, simplexSpeed, simplexIntensity, worleySpeed, worleyIntensity, mixNoise, noiseScale, image } = useControls({
    // warpSpeed: { value: 0.1, min: -10.0, max: 10.0, step: 0.01 },
    // warpIntensity: { value: 0.05, min: -5.0, max: 5.0, step: 0.01 },
    textureWrapMode: {
      options: ['mirror', 'clamp', 'repeat'],
      value: 'mirror',
    },
    effectType: {
      value: 'simplexAndWorley',
      options: ['simplexAndWorley']
    },
    simplexSpeed: { value: 0.05, min: 0.0, max: 1.0, step: 0.01 },
    simplexIntensity: { value: 0.01, min: 0.0, max: 0.1, step: 0.001 },
    worleySpeed: { value: 0.05, min: 0.0, max: 1.0, step: 0.01 },
    worleyIntensity: { value: 0.01, min: 0.0, max: 0.1, step: 0.001 },
    mixNoise: { value: 0.2, min: 0.0, max: 1.0, step: 0.01 },
    noiseScale: { value: 5.0, min: 0.0, max: 10.0, step: 0.1 },
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
      shaderMaterial.uniforms.uSimplexSpeed.value = simplexSpeed
      shaderMaterial.uniforms.uWorleySpeed.value = worleySpeed
      shaderMaterial.uniforms.uNoiseScale.value = noiseScale
      shaderMaterial.uniforms.uSimplexIntensity.value = simplexIntensity
      shaderMaterial.uniforms.uWorleyIntensity.value = worleyIntensity
      shaderMaterial.uniforms.uMixNoise.value = mixNoise
    }
  })

  const materials: { [key: string]: THREE.ShaderMaterial } = useMemo(() => {
    return {
      simplexAndWorley: new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: 0 },
          uTime: { value: 0 },
          uSimplexSpeed: { value: 0 },
          uWorleySpeed: { value: 0 },
          uSimplexIntensity: { value: 0 },
          uWorleyIntensity: { value: 0 },
          uMixNoise: { value: 0 },
          uNoiseScale: { value: 0 },
        },
        vertexShader,
        fragmentShader: simplexAndWorleyNoiseFragmentShader,
        side: THREE.DoubleSide
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
    </mesh>
  )
}