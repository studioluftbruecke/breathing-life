import { Suspense, useContext, useEffect, useMemo, useRef, useState } from "react";
import DebugModeContext, { LoadingScreenTypes, DebugSettingsType } from "@/app/lib/contexts/DebugModeContext";
import { Environment, KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import dynamic from "next/dynamic";
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { RefObject } from "react";
import * as THREE from 'three'
import ExperienceContext from "../contexts/ExperienceContext";
import { Leva } from "leva";

const LoadingScreen = dynamic(
  () => import('./LoadingScreen'),
  { ssr: false }
)

function CustomEnvironment(props: { environmentFilePath: string }) {
  return <>
    <Environment
      files={props.environmentFilePath}
      background
    >
    </Environment>
  </>
}


export type ExperienceWrapperProps = {
  environmentFilePath?: string
  controls?: {
    orbitControls?: {
      dampingFactor?: number
      panSpeed?: number
      rotateSpeed?: number
      target?: THREE.Vector3
      maxPolarAngle?: number
      minPolarAngle?: number
    }
  } | null 
  initialCameraPosition?: THREE.Vector3
  loadingScreen?: 'LoadingScreen' | null
  maxCameraDistance?: number
  cameraFov?: number
}

function ExperienceWrapper({
  initialCameraPosition = new THREE.Vector3(0, 2, -15),
  controls=null,
  maxCameraDistance = 500,
  ...props
}: React.PropsWithChildren<ExperienceWrapperProps>) {
  /**
   * Ref
   */
  const orbitRef = useRef<OrbitControlsImpl>(null!)
  const [orbitControlsRef, _setOrbitControlsRef] = useState<RefObject<OrbitControlsImpl>>(orbitRef)

  /**
   * Component State
   */
  const [debugSettings, setDebugSettings] = useState<DebugSettingsType>({ debug: false, perf: false, axesHelper: false, debugInterface: false, PWA: false, consoleLog: false, displayMobileLogs: false, loadingScreen: 'none', disableAllInterfaces: false, leva: false })

  /**
   * Contexts
   */
  const {experienceContext, setExperienceContext} = useContext(ExperienceContext)


  useEffect(() => {
    if (debugSettings.consoleLog) console.log('render ExperienceWrapper')
  }, [debugSettings.consoleLog])


  /**
   * Game State
   */
  // const showInterface = useKonchordExperience((state) => state.showInterface)

  /**
   * Atmoky State
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('debug') === 'true') {
      setDebugSettings((prevState) => {
        return {
          ...prevState,
          debug: true
        }
      })
    }
    if (urlParams.get('perf') === 'true') {
      setDebugSettings((prevState) => {
        return {
          ...prevState,
          perf: true
        }
      })
    }
    if (urlParams.get('axesHelper') === 'true') {
      setDebugSettings((prevState) => {
        return {
          ...prevState,
          axesHelper: true
        }
      })
    }
    if (urlParams.get('debugInterface') === 'true') {
      setDebugSettings((prevState) => {
        return {
          ...prevState,
          debugInterface: true
        }
      })
    }

    if (urlParams.get('disableAllInterfaces') === 'true') {
      setDebugSettings((prevState) => {
        return {
          ...prevState,
          disableAllInterfaces: true
        }
      })
    }

    if (urlParams.get('PWA') === 'true') {
      setDebugSettings((prevState) => {
        return {
          ...prevState,
          PWA: true
        }
      })
    }

    if (urlParams.get('consoleLog') === 'true') {
      setDebugSettings((prevState) => {
        return {
          ...prevState,
          consoleLog: true
        }
      })
    }

    if (urlParams.get('displayMobileLogs') === 'true') {
      setDebugSettings((prevState) => {
        return {
          ...prevState,
          displayMobileLogs: true
        }
      })
    }

    if (urlParams.get('leva') === 'true') {
      setDebugSettings((prevState) => {
        return {
          ...prevState,
          leva: true
        }
      })
    }

    if (urlParams.get('loadingScreen')) {
      const loadingScreenQueryParam = urlParams.get('loadingScreen')
      setDebugSettings((prevState) => {
        const newObject: DebugSettingsType = {
          ...prevState
        }
        newObject.loadingScreen = loadingScreenQueryParam as LoadingScreenTypes
        return newObject
      })
    }

  }, [])


  const keyboardMap = useMemo(() => {
    return [
      { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
      { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
      { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
      { name: 'rotateR', keys: ['KeyE'] },
      { name: 'rotateL', keys: ['KeyQ'] },
      { name: 'rotateReset', keys: ['KeyR'] },
      { name: 'jump', keys: ['Space'] },
      { name: 'run', keys: ['Shift'] },
      { name: 'action1', keys: ['1'] },
      { name: 'action2', keys: ['2'] },
      { name: 'action3', keys: ['3'] },
      // { name: 'action4', keys: ['KeyF'] }
    ]
  }, [])


  const setExperienceStartedHandler = () => {
    setExperienceContext({
      ...experienceContext,
      started: true
    })
  }


  return <>
    <DebugModeContext.Provider value={{ debugSettings, setDebugSettings }}>
      {props.loadingScreen === 'LoadingScreen' || debugSettings.loadingScreen === 'default' ? <>
        <LoadingScreen
          experienceStarted={experienceContext.started}
          setExperienceStarted={setExperienceStartedHandler}
        />
      </> : null}
      <Leva
        hidden={!debugSettings.leva}
      />
      <KeyboardControls map={keyboardMap} >
        <Canvas
          flat
          shadows
          dpr={[1, 2]}
          camera={{
            fov: props.cameraFov ?? 60,
            near: 0.01,
            far: maxCameraDistance * 2,
            position: initialCameraPosition
          }}
          gl={{
            logarithmicDepthBuffer: true,
            preserveDrawingBuffer: true
          }}
        >
          {debugSettings.axesHelper ? <axesHelper args={[1000]} /> : null}

          {props.environmentFilePath ? <CustomEnvironment environmentFilePath={props.environmentFilePath} /> : null}
          {controls && controls.orbitControls && <OrbitControls
              ref={orbitControlsRef}
              makeDefault
              target={controls.orbitControls.target ?? new THREE.Vector3(0, 0, 0)}
              dampingFactor={controls.orbitControls.dampingFactor ?? 1}
              panSpeed={controls.orbitControls.panSpeed ?? 1}
              rotateSpeed={controls.orbitControls.rotateSpeed ?? 1}
              maxDistance={maxCameraDistance}
              minDistance={1}
              maxPolarAngle={controls.orbitControls.maxPolarAngle ?? Math.PI}
              minPolarAngle={controls.orbitControls.minPolarAngle ?? 0}
            />}
          <Suspense fallback={null}>
            <Physics timeStep="vary" debug={debugSettings.debug}>
              {props.children}
            </Physics>
          </Suspense>

        </Canvas>
    </KeyboardControls>
  </DebugModeContext.Provider >
  </>
}

export default ExperienceWrapper 