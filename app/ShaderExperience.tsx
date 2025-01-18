import { Canvas } from "@react-three/fiber";
import ExperienceWrapper from "./lib/components/ExperienceWrapper";
import * as THREE from 'three'


export default function ShaderExperience() {
  return (
    <>
    <ExperienceWrapper controls={{orbitControls: { }}}>
      <ambientLight />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </ExperienceWrapper>
    </>
  )
}