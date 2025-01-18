import { createContext } from "react";

// export type ExperienceModesType = 'default' | 'party'
export type ExperienceContextType = {
  started: boolean
  allAudioFilesLoaded: boolean
  enterWithSoundOn: boolean
  // mode: ExperienceModesType
}
const ExperienceContext = createContext({
  experienceContext: {started: false, allAudioFilesLoaded: false, enterWithSoundOn: true },
  setExperienceContext: (state: ExperienceContextType) => { }
});

export default ExperienceContext