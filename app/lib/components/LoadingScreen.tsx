import { useContext, useEffect, useState } from "react"
import DebugModeContext from "@/app/lib/contexts/DebugModeContext"
import ExperienceContext from "@/app/lib/contexts/ExperienceContext"
import { Button } from "@/app/lib/components/ui/button"
import { CircleNotch } from "@phosphor-icons/react/dist/ssr"


export default function LoadingScreen({
  experienceStarted,
  setExperienceStarted
}: {
  experienceStarted: boolean,
  setExperienceStarted: () => void
}) {
  const { debugSettings, setDebugSettings } = useContext(DebugModeContext)
  if (debugSettings.consoleLog) console.log('render LoadingScreen')

  const { experienceContext, setExperienceContext } = useContext(ExperienceContext)

  // let { active, progress, errors, item, loaded, total } = useProgress()
  // useEffect(() => {
  //   console.log('active', active)
  //   console.log('progress', progress)
  //   console.log('errors', errors)
  //   console.log('item', item)
  //   console.log('loaded', loaded)
  //   console.log('total', total)
  // }, [active, progress, errors, item, loaded, total])
  const [smoothedProgress, setSmoothedProgress] = useState(0)
  const [enableEnterExperience, setEnableEnterExperience] = useState(false)
  // const smoothProgressFn = useDebouncedCallback((progress) => {
  //   setSmoothedProgress(progress)
  // }, 33);

  // This handles the case if a model is loaded from the web
  // Specifically I couldn't find a way to preload the react-three/drei Cloud component properly
  // This caused the progress to go to 100 and then jump back to 0 when loading the GLTF models
  // if (item.includes('https')) {
  //   progress = 0
  // }

  // const disableButton = progress !== 100

  useEffect(() => {
    if (experienceContext.allAudioFilesLoaded) {
      // setEnableEnterExperience(true)
      setExperienceStarted()
    }
  }, [setEnableEnterExperience, experienceContext.allAudioFilesLoaded])

  return <>
    {experienceStarted ? <></> : <>
      <div className="fixed top-0 left-0 w-full h-full z-50 bg-background">
        <div className="flex flex-col justify-center items-center w-full h-full">
          {/* <p className="text-xl text-center text-foreground">
            Loading {Math.round(progress)} %
          </p> */}
          <Button
            variant={enableEnterExperience ? 'default' : 'outline'}
            className={`text-xl text-center text-black rounded px-4 py-2 mt-4 lg:mt-8 hover:bg-superDeepSpace z-[1001]`}
            disabled={!enableEnterExperience}
            onClick={setExperienceStarted}
          >
            {enableEnterExperience ? 'Enter' : <><CircleNotch className="animate-spin mr-4" />{`${Math.round(smoothedProgress)} %`}</>}
          </Button>
          {/* <button
            className={`text-xl text-center text-black rounded px-4 py-2 mt-4 ${disableButton ? 'bg-slate-500' : 'bg-white'}`}
            disabled={disableButton}
            onClick={setExperienceStarted}
          >
            Start
          </button> */}
        </div>
      </div>
    </>}
  </>
}