import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from '@/app/lib/shaders/temporal_frame_interpolation/vertex.glsl'
import fragmentShader from '@/app/lib/shaders/temporal_frame_interpolation/fragment.glsl'


const MyShaderMaterial = shaderMaterial(
  {
    uTime: 0
  },
  vertexShader,
  fragmentShader
);

extend({ MyShaderMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      myShaderMaterial: any
    }
  }
}

export const MyTestShaderPlane = () => {
  const shaderRef = useRef<any>();

  useFrame(({ gl, scene, camera, clock }, delta) => {
    if (!shaderRef.current) return;
    shaderRef.current.uTime = clock.elapsedTime
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <myShaderMaterial
        ref={shaderRef}
        key={MyShaderMaterial.key}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};