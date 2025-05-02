'use client';

import ExperienceWrapper from "@/lib/components/ExperienceWrapper";
import * as THREE from 'three'
import { ToastContainer } from 'react-toastify';
import { BreathingLifePlaneWrapper } from "./BreathingLifePlane";
import dynamic from "next/dynamic";
import { useShaderSettings } from "../stores/useShaderSettings";


const ShaderSettingsInterface = dynamic(() => import('./ShaderSettingsInterface'), { ssr: false })


export default function ShaderExperience() {
  const { mixNoise, worleyNoiseScale, simplexNoiseScale, simplexSpeed, simplexIntensity, worleySpeed, worleyIntensity, image } = useShaderSettings()

  return (
    <>
      <ToastContainer />
      <ShaderSettingsInterface />
      <ExperienceWrapper
        controls={{ orbitControls: {} }}
        initialCameraPosition={new THREE.Vector3(0, 0, 1)}
        cameraFov={75}
      >
        <ambientLight />
        <BreathingLifePlaneWrapper
          settings={{
            mixNoise,
            worleyNoiseScale,
            simplexNoiseScale,
            simplexSpeed,
            simplexIntensity,
            worleySpeed,
            worleyIntensity,
            image
          }}
        />
      </ExperienceWrapper>
    </>
  )
}