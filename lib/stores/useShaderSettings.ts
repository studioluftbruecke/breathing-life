import { create } from 'zustand'
import * as THREE from 'three'

interface ShaderSettingsState {
  mixNoise: number
  worleyNoiseScale: number
  simplexNoiseScale: number
  simplexSpeed: number
  simplexIntensity: number
  worleySpeed: number
  worleyIntensity: number
  image: string
  gradientColor1: string
  gradientColor2: string
  cameraPosition: THREE.Vector3
  triggerReset: string
  setMixNoise: (mixNoise: number) => void
  setWorleyNoiseScale: (worleyNoiseScale: number) => void
  setSimplexNoiseScale: (simplexNoiseScale: number) => void
  setSimplexSpeed: (simplexSpeed: number) => void
  setSimplexIntensity: (simplexIntensity: number) => void
  setWorleySpeed: (worleySpeed: number) => void
  setWorleyIntensity: (worleyIntensity: number) => void
  setImage: (image: string) => void
  setGradientColor1: (gradientColor1: string) => void
  setGradientColor2: (gradientColor2: string) => void
  setCameraPosition: (cameraPosition: THREE.Vector3) => void
  setTriggerReset: (triggerReset: string) => void
}

export const useShaderSettings = create<ShaderSettingsState>((set) => ({
  mixNoise: 0.2,
  worleyNoiseScale: 5.0,
  simplexNoiseScale: 5.0,
  simplexSpeed: 0.05,
  simplexIntensity: 0.01,
  worleySpeed: 0.05,
  worleyIntensity: 0.01,
  image: '/Breathing-Life-Cover-Image.jpg',
  gradientColor1: '#170056',
  gradientColor2: '#170056',
  cameraPosition: new THREE.Vector3(0, 0, 1),
  triggerReset: 'abc',
  setMixNoise: (mixNoise: number) => set({ mixNoise }),
  setWorleyNoiseScale: (worleyNoiseScale: number) => set({ worleyNoiseScale }),
  setSimplexNoiseScale: (simplexNoiseScale: number) => set({ simplexNoiseScale }),
  setSimplexSpeed: (simplexSpeed: number) => set({ simplexSpeed }),
  setSimplexIntensity: (simplexIntensity: number) => set({ simplexIntensity }),
  setWorleySpeed: (worleySpeed: number) => set({ worleySpeed }),
  setWorleyIntensity: (worleyIntensity: number) => set({ worleyIntensity }),
  setImage: (image: string) => set({ image }),
  setGradientColor1: (gradientColor1: string) => set({ gradientColor1 }),
  setGradientColor2: (gradientColor2: string) => set({ gradientColor2 }),
  setCameraPosition: (cameraPosition: THREE.Vector3) => set({ cameraPosition }),
  setTriggerReset: (triggerReset: string) => set({ triggerReset }),
}))