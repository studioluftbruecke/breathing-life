import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { Tables } from "@/supabase.types";
import vertexShader from '@/app/lib/shaders/breathing/vertex.glsl'
import fragmentShader from '@/app/lib/shaders/breathing/fragmentMultiFx.glsl'
import { button, useControls } from 'leva';
import { toast } from 'react-toastify';


// Create shader material
const BreathingShaderMaterial = shaderMaterial(
  {
    // uTexture: null,
    // uTime: 0,
    // uWarpSpeed: 0,
    // uWarpIntensity: 0,
    texture1: 0,
    time: 0,
    speed: 0,
    intensity: 0,
    frequency: 0,
    noiseScale: 0,
    effectType: 0,
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
export function MultiFxPlane(props: JSX.IntrinsicElements['mesh'] & { settings: Tables<'settings'> }) {
  const shaderRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({width: 0, height: 0});
  const { viewport } = useThree();

  const [texturePath, setTexturePath] = useState(props.settings.img_url!)

  // Load the texture
  const texture = useTexture(texturePath)
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const { textureWrapMode, effectType, speed, intensity, frequency, noiseScale, image } = useControls({
    // warpSpeed: { value: 0.1, min: -10.0, max: 10.0, step: 0.01 },
    // warpIntensity: { value: 0.05, min: -5.0, max: 5.0, step: 0.01 },
    textureWrapMode: {
      options: ['mirror', 'clamp', 'repeat'],
      value: 'mirror',
    },
    effectType: {
      value: 2,
      options: {
        'Breathing Wave': 0,
        'Spiral': 1,
        'Noise': 2,
        'Ripple': 3,
        'Kaleidoscope': 4
      }
    },
    speed: { value: 0.05, min: -5.0, max: 5.0, step: 0.01 },
    intensity: { value: 0.02, min: -10.0, max: 10.0, step: 0.01 },
    frequency: { value: 3.0, min: -20, max: 20, step: 0.1 },
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
    if (shaderRef.current) {
      // shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
      // shaderRef.current.uniforms.uWarpSpeed.value = warpSpeed
      // shaderRef.current.uniforms.uWarpIntensity.value = warpIntensity

      shaderRef.current.uniforms.time.value = state.clock.getElapsedTime()
      shaderRef.current.uniforms.speed.value = speed
      shaderRef.current.uniforms.intensity.value = intensity
      shaderRef.current.uniforms.frequency.value = frequency
      shaderRef.current.uniforms.noiseScale.value = noiseScale
      shaderRef.current.uniforms.effectType.value = effectType
    }
  })

  return (
    <mesh>
      <planeGeometry args={[dimensions.width, dimensions.height]} />
      <breathingShaderMaterial
        ref={shaderRef}
        key={BreathingShaderMaterial.key}
        texture1={texture}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}