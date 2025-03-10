import { create } from 'zustand'

interface ShaderSettingsState {
  mixNoise: number
  noiseScale: number
  simplexSpeed: number
  simplexIntensity: number
  worleySpeed: number
  worleyIntensity: number
  image: string
  setMixNoise: (mixNoise: number) => void
  setNoiseScale: (noiseScale: number) => void
  setSimplexSpeed: (simplexSpeed: number) => void
  setSimplexIntensity: (simplexIntensity: number) => void
  setWorleySpeed: (worleySpeed: number) => void
  setWorleyIntensity: (worleyIntensity: number) => void
  setImage: (image: string) => void
}

export const useShaderSettings = create<ShaderSettingsState>((set) => ({
  mixNoise: 0.2,
  noiseScale: 5.0,
  simplexSpeed: 0.05,
  simplexIntensity: 0.01,
  worleySpeed: 0.05,
  worleyIntensity: 0.01,
  image: '',
  setMixNoise: (mixNoise: number) => set({ mixNoise }),
  setNoiseScale: (noiseScale: number) => set({ noiseScale }),
  setSimplexSpeed: (simplexSpeed: number) => set({ simplexSpeed }),
  setSimplexIntensity: (simplexIntensity: number) => set({ simplexIntensity }),
  setWorleySpeed: (worleySpeed: number) => set({ worleySpeed }),
  setWorleyIntensity: (worleyIntensity: number) => set({ worleyIntensity }),
  setImage: (image: string) => set({ image }),
}))