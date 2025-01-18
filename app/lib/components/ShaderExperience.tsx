import { Canvas } from "@react-three/fiber";
import ExperienceWrapper from "@/app/lib/components/ExperienceWrapper";
import * as THREE from 'three'
import ShaderPlane from "./ShaderPlane";


export default function ShaderExperience() {
  return (
    <>
    <ExperienceWrapper controls={{orbitControls: { }}}>
      <ambientLight />
      {/* <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh> */}
      <ShaderPlane
        scale={[10, 10, 10]}
      />
    </ExperienceWrapper>
    </>
  )
}