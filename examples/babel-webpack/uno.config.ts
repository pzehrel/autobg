import { defineConfig, presetWind3 } from 'unocss'
import presetAutobg from '@autobg/unocss'

export default defineConfig({
  presets: [
    presetAutobg(),
    presetWind3(),
  ],
}) 
