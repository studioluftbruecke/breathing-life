import { createContext } from "react";

export type LoadingScreenTypes = 'default' | 'menu' | 'button' | 'none'
export type DebugSettingsType = {
  debug: boolean
  perf: boolean
  axesHelper: boolean
  debugInterface: boolean
  PWA: boolean
  consoleLog: boolean
  displayMobileLogs: boolean
  loadingScreen: LoadingScreenTypes
  disableAllInterfaces: boolean
  leva: boolean
}
const DebugModeContext = createContext({
  debugSettings: {debug: false, perf: false, axesHelper: false, debugInterface: false, PWA: false, consoleLog: false, displayMobileLogs: false, loadingScreen: 'none', disableAllInterfaces: false, leva: false},
  setDebugSettings: (state: DebugSettingsType) => { }
});

export default DebugModeContext