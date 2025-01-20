'use client';

import { Canvas } from "@react-three/fiber";
import ExperienceWrapper from "@/app/lib/components/ExperienceWrapper";
import * as THREE from 'three'
import ShaderPlane from "./ShaderPlane";
import PenroseTriangle from "./PenroseTriangle";
import { useEffect, useState } from "react";
import { fetchFromSupabase } from "../actions.ts/supabase";
import { ToastContainer } from 'react-toastify';


export default function ShaderExperience() {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<any>()

  useEffect(() => {
    const getFilterValues = async () => {
      const result = await fetchFromSupabase("settings", '*', {})
      if (result.length > 0) {
        const settings = result[0] as unknown as {
          id: string,
          created_at: Date,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filter_values: any,
        }
        setSettings(settings)
      }
    }
    getFilterValues()
  }, [])


  return (
    <>
    <ToastContainer />
    <ExperienceWrapper
      controls={{orbitControls: { }}}
      initialCameraPosition={new THREE.Vector3(0, 0, 1)}
      cameraFov={75}
      environmentFilePath="/syferfontein_1d_clear_puresky_1k.hdr"
    >
      <ambientLight />
      {/* <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh> */}
      <ShaderPlane
          settings={settings}
        />
      {/* <PenroseTriangle /> */}
    </ExperienceWrapper>
    </>
  )
}