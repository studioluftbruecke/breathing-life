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

  const [filterValues, setFilterValues] = useState<any>()

  useEffect(() => {
    const getFilterValues = async () => {
      const result = await fetchFromSupabase("test_refraction_lukso_db", '*', {})
      if (result.length > 0) {
        const filterValues = result[0] as unknown as {
          id: string,
          created_at: Date,
          filter_values: any,
        }
        setFilterValues(filterValues)
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
          filterValues={filterValues}
        />
      {/* <PenroseTriangle /> */}
    </ExperienceWrapper>
    </>
  )
}