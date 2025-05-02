import { useState, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import vertexShader from '@/lib/shaders/breathingLife/vertex.glsl'
import simplexAndWorleyNoiseFragmentShader from '@/lib/shaders/breathingLife/simplexAndWorleyNoiseFragment.glsl'


export function BreathingLifePlane(props: JSX.IntrinsicElements['mesh'] & {
  settings: {
    mixNoise: number,
    worleyNoiseScale: number,
    simplexNoiseScale: number,
    simplexSpeed: number,
    simplexIntensity: number,
    worleySpeed: number,
    worleyIntensity: number,
    image: string
  }
}) {
  const { mixNoise, worleyNoiseScale, simplexNoiseScale, simplexSpeed, simplexIntensity, worleySpeed, worleyIntensity, image } = props.settings
  if (!image) return null

  const meshRef = useRef<THREE.Mesh>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const { viewport } = useThree();

  // Load texture
  const texture = useTexture(image)
  texture.wrapS = THREE.MirroredRepeatWrapping;
  texture.wrapT = THREE.MirroredRepeatWrapping;
  texture.repeat.set(2, 2);

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
          uWorleyNoiseScale: { value: 0 },
          uSimplexNoiseScale: { value: 0 },
        },
        vertexShader,
        fragmentShader: simplexAndWorleyNoiseFragmentShader,
        side: THREE.DoubleSide
      })
    }
  }, [])



  useEffect(() => {
    if (!image) return;
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
    if (!meshRef.current) return
    const shaderMaterial = meshRef.current.material as THREE.ShaderMaterial
    shaderMaterial.uniforms.uTexture.value = texture
  }, [texture])


  // Update time uniform on each frame
  useFrame((state) => {
    if (meshRef.current) {
      const shaderMaterial = meshRef.current.material as THREE.ShaderMaterial
      shaderMaterial.uniforms.uTime.value = state.clock.getElapsedTime()
      shaderMaterial.uniforms.uSimplexSpeed.value = simplexSpeed
      shaderMaterial.uniforms.uWorleySpeed.value = worleySpeed
      shaderMaterial.uniforms.uWorleyNoiseScale.value = worleyNoiseScale
      shaderMaterial.uniforms.uSimplexNoiseScale.value = simplexNoiseScale
      shaderMaterial.uniforms.uSimplexIntensity.value = simplexIntensity
      shaderMaterial.uniforms.uWorleyIntensity.value = worleyIntensity
      shaderMaterial.uniforms.uMixNoise.value = mixNoise
    }
  })

  return (
    <mesh ref={meshRef} material={materials['simplexAndWorley']}>
      <planeGeometry args={[dimensions.width, dimensions.height]} />
    </mesh>
  )
}