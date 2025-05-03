'use client'

import { Slider } from "@/lib/components/ui/slider"
import { useShaderSettings } from "../stores/useShaderSettings"
import { Button } from "./ui/button"
import { useEffect, useRef, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion"
import { Diamond, Gear, Waves, X } from "@phosphor-icons/react/dist/ssr"
import { Input } from "./ui/input"
import { HexColorPicker } from "react-colorful";
import { useTheme } from "next-themes"
import { Separator } from "./ui/separator"
import { useSpring, animated } from '@react-spring/web'
import Image from "next/image"
import { useProfile } from "../providers/ProfileProvider"
import { useUpProvider } from "../providers/UpProvider"
import Link from "next/link"


const DARK_BACKGROUND_HEX = '#000000'
const LIGHT_BACKGROUND_HEX = '#FFFFFF'
const LUFT_BACKGROUND_HEX = '#170056'


export default function ShaderSettingsInterface(props: {
  userHasAccess: boolean
}) {
  const { profileData } = useProfile();
  const { isMiniApp } = useUpProvider();
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [accordionValue, setAccordionValue] = useState('image')
  const { theme, setTheme } = useTheme()

  const {
    mixNoise,
    worleyNoiseScale,
    simplexNoiseScale,
    simplexSpeed,
    simplexIntensity,
    worleySpeed,
    worleyIntensity,
    image,
    gradientColor1,
    gradientColor2,
    setMixNoise,
    setWorleyNoiseScale,
    setSimplexNoiseScale,
    setSimplexSpeed,
    setSimplexIntensity,
    setWorleySpeed,
    setWorleyIntensity,
    setImage,
    setGradientColor1,
    setGradientColor2
  } = useShaderSettings()

  useEffect(() => {
    // Update the CSS background value of #experience-wrapper-canvas-container
    const canvasContainer = document.getElementById('experience-wrapper-canvas-container')
    if (canvasContainer) {
      canvasContainer.style.background = `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`
    }
  }, [gradientColor1, gradientColor2])

  const presetButtonClassName = "w-full bg-background h-8 border rounded-md text-center flex items-center justify-center font-finger-paint"


  const [isToggled, setIsToggled] = useState(false);

  const [transparency, setTransparency] = useState(100)

  // Define the spring animation for transparency
  const { transparencySpring } = useSpring({
    transparencySpring: isToggled ? transparency : 0,
    config: { tension: 170, friction: 26 }, // Adjust for desired animation feel
  });

  // Toggle the state on button click
  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };

  useEffect(() => {
    // Update the CSS background value of #shader-settings-interface
    const shaderSettingsInterface = document.getElementById('shader-settings-interface')
    if (shaderSettingsInterface && isToggled) {
      shaderSettingsInterface.style.opacity = `${transparency / 100}`
    }
  }, [transparency])

  return (
    <>
      <div className={`fixed top-8 right-8 w-8 h-8 z-50 ${isToggled ? 'hidden' : ''}`}>
        <animated.div
          style={{
            opacity: transparencySpring?.to((t: number) => 1 - t / 100),
          }}
        >
          <Button
            variant={'ghost'}
            className={`border rounded-md w-8 h-8 flex items-center justify-center`}
            onClick={handleToggle}
          >
            <Gear size={20} />
          </Button>
        </animated.div>
      </div>
      <div className={`fixed top-8 right-0 w-full max-w-screen max-h-[93dvh] overflow-scroll md:w-fit md:right-8 flex flex-col items-center md:items-end z-50 ${isToggled ? '' : 'hidden'}`}>
        <animated.div
          id="shader-settings-interface"
          className="w-full h-full min-w-[280px] max-w-[360px] space-y-4 border rounded-md p-4 bg-background"
          style={{
            opacity: transparencySpring?.to((t: number) => t / 100),
          }}
        >
          <div className="flex flex-row items-center justify-between">
            <h1 className="w-full text-xl font-finger-paint">Breathing Life</h1>
            <div className="flex flex-row items-center w-full justify-center">
              <div className="flex flex-col items-end justify-center mr-3 hover:cursor-pointer text-center" onClick={() => {
                setGradientColor1(theme === 'luft' ? DARK_BACKGROUND_HEX : (theme === 'light' ? LUFT_BACKGROUND_HEX : LIGHT_BACKGROUND_HEX))
                setGradientColor2(theme === 'luft' ? DARK_BACKGROUND_HEX : (theme === 'light' ? LUFT_BACKGROUND_HEX : LIGHT_BACKGROUND_HEX))
                setTheme(theme === 'luft' ? 'dark' : (theme === 'light' ? 'luft' : 'light'))
              }}>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xs text-primary/80"><span className="relative top-[1px]">Theme</span></div>
                  <div className="text-xs text-primary/80 italic"><span className="relative top-[2px]">{theme}</span></div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-primary/80 mb-2">Transparency</span>
                <Slider
                  className="w-3/4"
                  defaultValue={[50]}
                  value={[transparency]}
                  onValueChange={(value: number[]) => setTransparency(value[0])}
                  max={100}
                  min={5}
                  step={1}
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute bottom-3 right-[-10px] opacity-50">
                <X size={16} onClick={handleToggle} />
              </div>
            </div>
          </div>
          <Separator className="w-full my-4" />

          <div className="grid grid-cols-7 gap-2 w-full">
            <Button variant={'ghost'} className={presetButtonClassName} onClick={() => {
              setMixNoise(Math.random());
              setWorleyNoiseScale(Math.random() * 10);
              setSimplexNoiseScale(Math.random() * 10);
              setSimplexSpeed(Math.random());
              setSimplexIntensity(Math.random() * 0.1);
              setWorleySpeed(Math.random());
              setWorleyIntensity(Math.random() * 0.1);
            }}>B</Button>
            <Button variant={'ghost'} className={presetButtonClassName} onClick={() => {
              setMixNoise(Math.random());
              setWorleyNoiseScale(Math.random() * 10);
              setSimplexNoiseScale(Math.random() * 10);
              setSimplexSpeed(Math.random());
              setSimplexIntensity(Math.random() * 0.1);
              setWorleySpeed(Math.random());
              setWorleyIntensity(Math.random() * 0.1);
            }}>R</Button>
            <Button variant={'ghost'} className={presetButtonClassName} onClick={() => {
              setMixNoise(Math.random());
              setWorleyNoiseScale(Math.random() * 10);
              setSimplexNoiseScale(Math.random() * 10);
              setSimplexSpeed(Math.random());
              setSimplexIntensity(Math.random() * 0.1);
              setWorleySpeed(Math.random());
            }}>E</Button>
            <Button variant={'ghost'} className={presetButtonClassName} onClick={() => {
              setMixNoise(Math.random());
              setWorleyNoiseScale(Math.random() * 10);
              setSimplexNoiseScale(Math.random() * 10);
              setSimplexSpeed(Math.random());
              setSimplexIntensity(Math.random() * 0.1);
              setWorleySpeed(Math.random());
              setWorleyIntensity(Math.random() * 0.1);
            }}>A</Button>
            <Button variant={'ghost'} className={presetButtonClassName} onClick={() => {
              setMixNoise(Math.random());
              setWorleyNoiseScale(Math.random() * 10);
              setSimplexNoiseScale(Math.random() * 10);
              setSimplexSpeed(Math.random());
              setSimplexIntensity(Math.random() * 0.1);
              setWorleySpeed(Math.random());
              setWorleyIntensity(Math.random() * 0.1);
            }}>T</Button>
            <Button variant={'ghost'} className={presetButtonClassName} onClick={() => {
              setMixNoise(Math.random());
              setWorleyNoiseScale(Math.random() * 10);
              setSimplexNoiseScale(Math.random() * 10);
              setSimplexSpeed(Math.random());
              setSimplexIntensity(Math.random() * 0.1);
              setWorleySpeed(Math.random());
              setWorleyIntensity(Math.random() * 0.1);
            }}>H</Button>
            <Button variant={'ghost'} className={presetButtonClassName} onClick={() => {
              setMixNoise(Math.random());
              setWorleyNoiseScale(Math.random() * 10);
              setSimplexNoiseScale(Math.random() * 10);
              setSimplexSpeed(Math.random());
              setSimplexIntensity(Math.random() * 0.1);
              setWorleySpeed(Math.random());
              setWorleyIntensity(Math.random() * 0.1);
            }}>E</Button>
          </div>
          <Accordion
            // className="text-primary"
            value={accordionValue}
            onValueChange={setAccordionValue}
            type="single"
            collapsible
            defaultValue={image ? '' : 'image'}
          >
            <AccordionItem value="image" className="border-none">
              <AccordionTrigger>Image</AccordionTrigger>
              <AccordionContent>
                <div className="w-full h-full space-y-2">
                  <div
                    // className="flex flex-row items-center gap-2 w-full justify-between"
                  >
                    {isMiniApp && props.userHasAccess ? <>
                    <div className="flex flex-row items-center gap-2">
                      <input ref={fileInputRef} className="hidden" type="file" accept="image/*" onChange={(e) => {
                        if (!e.target.files?.[0]) return;
                        const fileUrl = URL.createObjectURL(e.target.files[0]);
                        setImage(fileUrl);
                        setAccordionValue('')
                      }} />
                      <Image
                        src={image}
                        alt="Image"
                        width={50}
                        height={50}
                        className="rounded-md mr-1 w-12 h-12 object-cover aspect-square"
                      />
                      <Button
                        variant={'default'}
                        disabled={!props.userHasAccess || !isMiniApp}
                        onClick={() => {
                          if (!props.userHasAccess || !isMiniApp) {
                            console.error('User has no access or is not on the grid.');
                            return;
                          }
                          fileInputRef.current?.click()
                        }}
                      >
                        {image ? 'Update image' : 'Select image'}
                      </Button>
                      </div>
                    </> : <>
                    <div className="text-muted-foreground flex flex-row items-center gap-2 w-full">
                      <span className="w-50">Access required for image upload.</span>
                      {!isMiniApp ? <><span>Login currently only supported on the <a href={process.env.NEXT_PUBLIC_STUDIO_LUFTBRUECKE_UP_URL} target="_blank" className="underline text-blue-500">Grid</a>.</span></> : <>
                        {!profileData ? <><span>Login via the "Connect" button on the top-left of this grid.</span></> : <><span>You don't have access yet. <a href={process.env.NEXT_PUBLIC_UNIVERSAL_PAGE_BREATHING_LIFE_DROP_URL} target="_blank" className="underline text-blue-500">Get access here</a>.</span></>}
                      </>}
                    </div>
                    </>}
                    {/* <div className="text-xs text-muted-foreground">
                        {!isMiniApp && <>
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground w-full text-center">
                              Login currently only supported on the grid
                            </span>
                            <Link href="https://profile.link/studioluftbruecke@a7A6" target="_blank" className="underline text-blue-500">universaleverything.io</Link>
                          </div>
                        </>}
                        {!profileData && isMiniApp && <>
                          <span className=" w-full text-center">Please login on the top right of this window.</span>
                        </>}
                      </div> */}
                  </div>
                  {/* <div className="flex flex-row w-full">
                  </div> */}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="customize" className="border-none">
              <AccordionTrigger>Customize</AccordionTrigger>
              <AccordionContent>
                <div className="w-full h-full space-y-2">
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-row space-between items-center w-[35%]">
                        <Waves size={24} />
                        {/* <ArrowsHorizontal className="mx-2" size={24} /> */}
                        <Diamond size={24} />
                        <span className="text-sm font-bold mx-2">Mix</span>
                      </div>
                      <Slider
                        className="w-[47%] ml-4"
                        defaultValue={[33]}
                        max={1}
                        step={0.01}
                        value={[mixNoise]}
                        onValueChange={(value: number[]) => setMixNoise(value[0])}
                        disabled={image === ''}
                      />
                      <div className="w-[18%]">
                        <Input
                          type="number"
                          step="0.01"
                          value={Math.round(mixNoise * 100)}
                          onChange={(e) => setMixNoise((Number(e.target.value) / 100 || 0))}
                          className="p-2 h-8"
                          disabled={image === ''}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-row space-between items-center w-[35%]">
                        <Waves size={24} />
                        <span className="text-sm font-bold mx-2">Speed</span>
                      </div>
                      <Slider
                        className="w-[47%] ml-4"
                        defaultValue={[0.05]}
                        max={1.0}
                        step={0.01}
                        value={[simplexSpeed]}
                        onValueChange={(value: number[]) => setSimplexSpeed(value[0])}
                        disabled={image === ''}
                      />
                      <div className="w-[18%]">
                        <Input
                          type="number"
                          step="0.01"
                          value={Math.round(simplexSpeed * 100)}
                          onChange={(e) => setSimplexSpeed((Number(e.target.value) / 100 || 0))}
                          className="p-2 h-8"
                          disabled={image === ''}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-row space-between items-center w-[35%]">
                        <Waves size={24} />
                        <span className="text-sm font-bold mx-2">Intensity</span>
                      </div>
                      <Slider
                        className="w-[47%] ml-4"
                        defaultValue={[0.01]}
                        max={0.1}
                        step={0.001}
                        value={[simplexIntensity]}
                        onValueChange={(value: number[]) => setSimplexIntensity(value[0])}
                        disabled={image === ''}
                      />
                      <div className="w-[18%]">
                        <Input
                          type="number"
                          step="0.01"
                          value={Math.round(simplexIntensity * 1000)}
                          onChange={(e) => setSimplexIntensity((Number(e.target.value) / 1000 || 0))}
                          className="p-2 h-8"
                          disabled={image === ''}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-row space-between items-center w-[35%]">
                        {/* <Resize size={24} /> */}
                        <Waves size={24} />
                        <span className="text-sm font-bold mx-2">Scale</span>
                      </div>
                      <Slider
                        className="w-[47%] ml-4"
                        defaultValue={[5.0]}
                        max={100.0}
                        step={0.1}
                        value={[simplexNoiseScale]}
                        onValueChange={(value: number[]) => setSimplexNoiseScale(value[0])}
                        disabled={image === ''}
                      />
                      <div className="w-[18%]">
                        <Input
                          type="number"
                          step="0.01"
                          value={Math.round(simplexNoiseScale)}
                          onChange={(e) => setSimplexNoiseScale((Number(e.target.value) || 0))}
                          className="p-2 h-8"
                          disabled={image === ''}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-row space-between items-center w-[35%]"><Diamond size={24} />
                        <span className="text-sm font-bold mx-2">Speed</span>
                      </div>
                      <Slider
                        className="w-[47%] ml-4"
                        defaultValue={[0.05]}
                        max={1.0}
                        step={0.01}
                        value={[worleySpeed]}
                        onValueChange={(value: number[]) => setWorleySpeed(value[0])}
                        disabled={image === ''}
                      />
                      <div className="w-[18%]">
                        <Input
                          type="number"
                          step="0.01"
                          value={Math.round(worleySpeed * 100)}
                          onChange={(e) => setWorleySpeed((Number(e.target.value) / 100 || 0))}
                          className="p-2 h-8"
                          disabled={image === ''}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-row space-between items-center w-[35%]">
                        <Diamond size={24} />
                        <span className="text-sm font-bold mx-2">Intensity</span>
                      </div>
                      <Slider
                        className="w-[47%] ml-4"
                        defaultValue={[0.01]}
                        max={0.1}
                        step={0.001}
                        value={[worleyIntensity]}
                        onValueChange={(value: number[]) => setWorleyIntensity(value[0])}
                        disabled={image === ''}
                      />
                      <div className="w-[18%]">
                        <Input
                          type="number"
                          step="0.01"
                          value={Math.round(worleyIntensity * 1000)}
                          onChange={(e) => setWorleyIntensity((Number(e.target.value) / 1000 || 0))}
                          className="p-2 h-8"
                          disabled={image === ''}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-row space-between items-center w-[35%]">
                        {/* <Resize size={24} /> */}
                        <Diamond size={24} />
                        <span className="text-sm font-bold mx-2">Scale</span>
                      </div>
                      <Slider
                        className="w-[47%] ml-4"
                        defaultValue={[5.0]}
                        max={100.0}
                        step={0.1}
                        value={[worleyNoiseScale]}
                        onValueChange={(value: number[]) => setWorleyNoiseScale(value[0])}
                        disabled={image === ''}
                      />
                      <div className="w-[18%]">
                        <Input
                          type="number"
                          step="0.01"
                          value={Math.round(worleyNoiseScale)}
                          onChange={(e) => setWorleyNoiseScale((Number(e.target.value) || 0))}
                          className="p-2 h-8"
                          disabled={image === ''}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="background" className="border-none">
              <AccordionTrigger>Background</AccordionTrigger>
              <AccordionContent>
                <div className="w-full h-full space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="small-react-colorful flex flex-col justify-center items-center">
                      <Input className="w-[120px] mb-2" type="text" value={gradientColor1} onChange={(e) => { setGradientColor1(e.target.value) }} />
                      <HexColorPicker className="w-10 small-react-colorful" color={gradientColor1} onChange={(color: string) => { setGradientColor1(color) }} />
                      <span className="text-sm text-primary font-bold mt-2">Gradient Color 1</span>
                    </div>
                    <div className="small-react-colorful flex flex-col justify-center items-center">
                      <Input className="w-[120px] mb-2" type="text" value={gradientColor2} onChange={(e) => { setGradientColor2(e.target.value) }} />
                      <HexColorPicker className="small-react-colorful" color={gradientColor2} onChange={(color: string) => { setGradientColor2(color) }} />
                      <span className="text-sm text-primary font-bold mt-2">Gradient Color 2</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="about" className="border-none">
              <AccordionTrigger>About</AccordionTrigger>
              <AccordionContent>
                <div className="w-full h-full flex flex-col">
                  <span>&#x0022;Breathing Life&#x0022; is a creative tool for animating images into breath-taking visual experiences. Inspired by altered visionary states, the images come to life in a natural way, while it is also possible to create otherworldly effects.</span>
                  <span className="mt-2">This tool harnesses the mathematical elegance of Simplex Noise — known for its natural-looking randomness — alongside Worley Noise, famous for creating organic cellular patterns resembling natural textures like stone, water, and biological surfaces. Together, these algorithmic foundations generate fluid, ever evolving landscapes that both complement and reimagine the original image.</span>
                  <Separator className="my-4" />
                  <span className="text-sm">Do you have any questions or feedback?<br />Leave a message via <Link className="text-primary underline" href="mailto:hi@studioluftbruecke.org">hi@studioluftbruecke.org</Link></span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </animated.div>
      </div>
    </>
  )
}