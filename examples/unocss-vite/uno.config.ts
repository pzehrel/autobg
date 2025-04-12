import { presetAutobg } from '@autobg/unocss'
import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAutobg({
      root: import.meta.dirname,
    }),
  ],
})
