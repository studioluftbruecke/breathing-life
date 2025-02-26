'use client';

import ExperienceWrapper from "@/app/lib/components/ExperienceWrapper";
import * as THREE from 'three'
import { useEffect, useState } from "react";
import { fetchFromSupabase } from "../actions.ts/supabase";
import { ToastContainer } from 'react-toastify';
import { PsychedelicPlane } from "./PsychedelicShaderPlane";
import { BreathingPlane } from "./BreathingPlane";
import { MultiFxPlane } from "./MultiFxPlane";
import { BreathingLifePlane } from "./BreathingLifePlane";
import { BreathingLifePlane_v2 } from "./BreathingLifePlane_v2";


export default function ShaderExperience(props: { nftAddress: string }) {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<any>(null)

  // useEffect(() => {
  //   const getSettings = async () => {
  //     const result = await fetchFromSupabase("settings", '*', { id: props.nftAddress })
  //     if (result.length > 0) {
  //       const settings = result[0] as unknown as {
  //         id: string,
  //         created_at: Date,
  //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //         filter_values: any,
  //       }
  //       setSettings(settings)
  //     }
  //   }
  //   getSettings()
  // }, [props.nftAddress])


  return (
    <>
      <ToastContainer />
      <ExperienceWrapper
        controls={{ orbitControls: {} }}
        initialCameraPosition={new THREE.Vector3(0, 0, 1)}
        cameraFov={75}
        environmentFilePath={settings?.environment_url || "/syferfontein_1d_clear_puresky_1k.hdr"}
      >
        <ambientLight />
        {/* <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh> */}
        {settings && settings.filter_values && settings.img_url && <>
          {/* <ShaderPlane
            settings={settings}
          /> */}
          {/* <TemporalInterpolationGlitchShaderPlane
            settings={settings}
          /> */}
          {/* <PsychedelicPlane
            settings={settings}
          /> */}
          {/* <BreathingPlane
            settings={settings}
          /> */}
          {/* <MultiFxPlane
            settings={settings}
          /> */}
        </>}
        <BreathingLifePlane_v2
          settings={settings}
        />
        {/* <PenroseTriangle /> */}
      </ExperienceWrapper>
    </>
  )
}