'use client';

import ExperienceWrapper from "@/lib/components/ExperienceWrapper";
import * as THREE from 'three'
import { ToastContainer } from 'react-toastify';
import { BreathingLifePlaneWrapper } from "./BreathingLifePlane";
import dynamic from "next/dynamic";
import { useShaderSettings } from "../stores/useShaderSettings";
import { Button } from "./ui/button";


const ShaderSettingsInterface = dynamic(() => import('./ShaderSettingsInterface'), { ssr: false })
const initCameraPosition = new THREE.Vector3(0, 0, 1)

export default function ShaderExperience(props: {
  userHasAccess: boolean
}) {
  const { mixNoise, worleyNoiseScale, simplexNoiseScale, simplexSpeed, simplexIntensity, worleySpeed, worleyIntensity, image, cameraPosition, triggerReset, setCameraPosition, setTriggerReset } = useShaderSettings()

  return (
    <>
      {new THREE.Vector3().copy(cameraPosition).sub(initCameraPosition).length() > 0.01 && (
        <div className="fixed bottom-2 z-50">
          <Button
            variant={'ghost'}
            className={`border rounded-md flex items-center justify-center`}
            onClick={() => { setTriggerReset(Math.random().toString()) }}
          >
            <span>Re-center</span>
          </Button>
        </div>
      )}
      <ToastContainer />
      <ShaderSettingsInterface userHasAccess={props.userHasAccess} />
      <ExperienceWrapper
        controls={{ orbitControls: {} }}
        initialCameraPosition={initCameraPosition}
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
            image,
            triggerReset,
            setCameraPosition
          }}
        />
      </ExperienceWrapper>
    </>
  )
}