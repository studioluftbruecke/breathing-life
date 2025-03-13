'use client'

import { Slider } from "@/app/lib/components/ui/slider"
import { useShaderSettings } from "../stores/useShaderSettings"
import { Button } from "./ui/button"
import { FormEventHandler, useEffect, useRef, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/lib/components/ui/accordion"
import { Asterisk, Diamond, Resize, Waves } from "@phosphor-icons/react/dist/ssr"
import { InputWithUnit } from "./ui/input-with-unit"
import { Input } from "./ui/input"
import { isHexColor, isValidNumber } from "@/app/lib/utils/utils";
import { HexColorPicker } from "react-colorful";
import { Label } from "./ui/label"
import { useTheme } from "next-themes"
import { Separator } from "./ui/separator"


export default function ShaderSettingsInterface() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [accordionValue, setAccordionValue] = useState('image')
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    if (theme !== 'dark') {
      setTheme('dark')
    }
  }, [])


  const [transparency, setTransparency] = useState(100)

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

  useEffect(() => {
    // Update the CSS background value of #shader-settings-interface
    const shaderSettingsInterface = document.getElementById('shader-settings-interface')
    if (shaderSettingsInterface) {
      shaderSettingsInterface.style.opacity = `${transparency / 100}`
    }
  }, [transparency])

  const presetButtonClassName = "w-full bg-background h-8 border rounded-md text-center flex items-center justify-center font-finger-paint"

  return (
    <div className="fixed top-0 right-0 z-50 p-8 min-w-[420px] max-w-[420px] overflow-auto max-h-dvh">
      <div id="shader-settings-interface" className="w-full h-full space-y-4 border rounded-md p-4 bg-background">
        <div className="grid grid-cols-2 items-center justify-between">
          <h1 className="text-xl font-finger-paint">Breathing Life</h1>
          <div className="flex flex-row items-center w-full justify-center">
            <div className="w-full flex flex-col items-end justify-center mr-3 hover:cursor-pointer text-center" onClick={() => {
              setTheme(theme === 'pink' ? 'dark' : (theme === 'light' ? 'pink' : 'light'))
            }}>
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs text-primary/80"><span className="relative top-[1px]">Theme</span></div>
                <div className="text-xs text-primary/80 italic">{theme}</div>
              </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
              <span className="text-xs text-primary/80 mb-2">Transparency</span>
              <Slider className="w-3/4" defaultValue={[50]} value={[transparency]} onValueChange={(value: number[]) => setTransparency(value[0])} max={100} min={0} step={1} />
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
                <div className="flex flex-row grid grid-cols-2 gap-8 w-full">
                  <div className="flex flex-row items-center gap-2 w-full justify-between">
                    {/* <label>Image</label> */}
                    <input ref={fileInputRef} className="hidden" type="file" accept="image/*" onChange={(e) => {
                      if (!e.target.files?.[0]) return;
                      const fileUrl = URL.createObjectURL(e.target.files[0]);
                      setImage(fileUrl);
                      setAccordionValue('customize')
                    }} />
                    <Button variant={'secondary'} onClick={() => { fileInputRef.current?.click() }}>{image ? 'Update image' : 'Select image'}</Button>
                  </div>
                </div>
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
          <AccordionItem value="feedback" className="border-none">
            <AccordionTrigger>Feedback</AccordionTrigger>
            <AccordionContent>
              <div className="w-full h-full space-y-2 flex flex-col items-center">
                <span className="text-sm text-primary font-bold">Do you have any feedback?</span>
                <span className="text-sm text-primary">We are happy to hear from you via</span>
                <span className="text-sm text-primary">hi@studioluftbruecke.org</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}