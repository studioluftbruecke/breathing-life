import { Slider } from "@/app/lib/components/ui/slider"
import { useShaderSettings } from "../stores/useShaderSettings"
import { Button } from "./ui/button"
import { useRef } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/lib/components/ui/accordion"
import { Diamond, Resize, Waves } from "@phosphor-icons/react/dist/ssr"
import { InputWithUnit } from "./ui/input-with-unit"
import { Input } from "./ui/input"



export default function ShaderSettingsInterface() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mixNoise, worleyNoiseScale, simplexNoiseScale, simplexSpeed, simplexIntensity, worleySpeed, worleyIntensity, image, setMixNoise, setWorleyNoiseScale, setSimplexNoiseScale, setSimplexSpeed, setSimplexIntensity, setWorleySpeed, setWorleyIntensity, setImage } = useShaderSettings()

  return (
    <div className="fixed top-0 right-0 z-50 p-8 min-w-[420px] max-w-[420px]">
      <div className="w-full h-full space-y-4 border rounded-md p-4 bg-card">
        <div className="flex flex-row items-center gap-2 w-full">
          <label>Image</label>
          <input ref={fileInputRef} className="hidden" type="file" accept="image/*" onChange={(e) => {
            if (!e.target.files?.[0]) return;
            const fileUrl = URL.createObjectURL(e.target.files[0]);
            setImage(fileUrl);
          }} />
          <Button variant="outline" onClick={() => { fileInputRef.current?.click() }}>Select file</Button>
        </div>
        {/* <Separator className="w-full my-4" /> */}

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-none">
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
                    <Slider className="w-[47%] ml-4" defaultValue={[33]} max={1} step={0.01} value={[mixNoise]} onValueChange={(value: number[]) => setMixNoise(value[0])} />
                    <div className="w-[18%]">
                      <Input
                        type="number"
                        step="0.01"
                        value={Math.round(mixNoise * 100)}
                        onChange={(e) => setMixNoise((Number(e.target.value) / 100 || 0))}
                        className="p-2 h-8"
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
                    <Slider className="w-[47%] ml-4" defaultValue={[0.05]} max={1.0} step={0.01} value={[simplexSpeed]} onValueChange={(value: number[]) => setSimplexSpeed(value[0])} />
                    <div className="w-[18%]">
                      <Input
                        type="number"
                        step="0.01"
                        value={Math.round(simplexSpeed * 100)}
                        onChange={(e) => setSimplexSpeed((Number(e.target.value) / 100 || 0))}
                        className="p-2 h-8"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row space-between items-center w-[35%]">
                      <Waves size={24} />
                      <span className="text-sm font-bold mx-2">Intensity</span>
                    </div>
                    <Slider className="w-[47%] ml-4" defaultValue={[0.01]} max={0.1} step={0.001} value={[simplexIntensity]} onValueChange={(value: number[]) => setSimplexIntensity(value[0])} />
                    <div className="w-[18%]">
                      <Input
                        type="number"
                        step="0.01"
                        value={Math.round(simplexIntensity * 1000)}
                        onChange={(e) => setSimplexIntensity((Number(e.target.value) / 1000 || 0))}
                        className="p-2 h-8"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row space-between items-center w-[35%]">
                      {/* <Resize size={24} /> */}
                      <Waves size={24} />
                      <span className="text-sm font-bold mx-2">Scale</span>
                    </div>
                    <Slider className="w-[47%] ml-4" defaultValue={[5.0]} max={100.0} step={0.1} value={[simplexNoiseScale]} onValueChange={(value: number[]) => setSimplexNoiseScale(value[0])} />
                    <div className="w-[18%]">
                      <Input
                        type="number"
                        step="0.01"
                        value={Math.round(simplexNoiseScale)}
                        onChange={(e) => setSimplexNoiseScale((Number(e.target.value) || 0))}
                        className="p-2 h-8"
                      />
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-4 space-y-4">
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row space-between items-center w-[35%]"><Diamond size={24} />
                      <span className="text-sm font-bold mx-2">Speed</span>
                    </div>
                    <Slider className="w-[47%] ml-4" defaultValue={[0.05]} max={1.0} step={0.01} value={[worleySpeed]} onValueChange={(value: number[]) => setWorleySpeed(value[0])} />
                    <div className="w-[18%]">
                      <Input
                        type="number"
                        step="0.01"
                        value={Math.round(worleySpeed * 100)}
                        onChange={(e) => setWorleySpeed((Number(e.target.value) / 100 || 0))}
                        className="p-2 h-8"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row space-between items-center w-[35%]">
                      <Diamond size={24} />
                      <span className="text-sm font-bold mx-2">Intensity</span>
                    </div>
                    <Slider className="w-[47%] ml-4" defaultValue={[0.01]} max={0.1} step={0.001} value={[worleyIntensity]} onValueChange={(value: number[]) => setWorleyIntensity(value[0])} />
                    <div className="w-[18%]">
                      <Input
                        type="number"
                        step="0.01"
                        value={Math.round(worleyIntensity * 1000)}
                        onChange={(e) => setWorleyIntensity((Number(e.target.value) / 1000 || 0))}
                        className="p-2 h-8"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row space-between items-center w-[35%]">
                      {/* <Resize size={24} /> */}
                      <Diamond size={24} />
                      <span className="text-sm font-bold mx-2">Scale</span>
                    </div>
                    <Slider className="w-[47%] ml-4" defaultValue={[5.0]} max={100.0} step={0.1} value={[worleyNoiseScale]} onValueChange={(value: number[]) => setWorleyNoiseScale(value[0])} />
                    <div className="w-[18%]">
                      <Input
                        type="number"
                        step="0.01"
                        value={Math.round(worleyNoiseScale)}
                        onChange={(e) => setWorleyNoiseScale((Number(e.target.value) || 0))}
                        className="p-2 h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}