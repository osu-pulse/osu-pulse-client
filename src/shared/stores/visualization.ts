// export const useAudioVisualize = (audio: HTMLAudioElement) => {
//   audio.load()
//   void audio.play()
//
//   const context = new AudioContext()
//
//   const source = context.createMediaElementSource(audio)
//
//   const analyser = context.createAnalyser()
//   analyser.fftSize = 32
//
//   source.connect(analyser)
//   analyser.connect(context.destination)
//
//   const bars = new Uint8Array(analyser.frequencyBinCount)
//
//   useRafFn(() => {
//     analyser.getByteFrequencyData(bars)
//     console.log(Array.from(bars))
//   })
// }
import {
  createGlobalState,
  createSharedComposable,
  useEventListener,
  useRafFn,
} from '@vueuse/core'
import { computed, readonly, ref, shallowReadonly, shallowRef, watch } from 'vue'
import { usePlayer } from '@/player/stores/player'
import { avg, max } from '@/shared/utils/array'

export interface VisualizeConfig {
  min: number
  max: number
  length: number
}

const useVisualizationState = createGlobalState(() => ({
  context: shallowRef<AudioContext>(),
  source: shallowRef<MediaElementAudioSourceNode>(),
  analyzer: shallowRef<AnalyserNode>(),
  bins: shallowRef<number[]>([]),
  config: ref<VisualizeConfig>({
    min: -80,
    max: -20,
    length: 256,
  }),
}))

export const useVisualization = createSharedComposable(() => {
  const { context, source, analyzer, bins, config } = useVisualizationState()

  const { audio } = usePlayer()
  useEventListener(['mousedown', 'keydown'], () => {
    if (!context.value) {
      context.value = new AudioContext()
      source.value = new MediaElementAudioSourceNode(context.value, { mediaElement: audio.value })
      analyzer.value = new AnalyserNode(context.value, { minDecibels: config.value.min, maxDecibels: config.value.max, fftSize: config.value.length * 2 })
      source.value.connect(analyzer.value)
      analyzer.value.connect(context.value.destination)
    }
  }, { once: true })

  watch(config, ({ min, max, length }) => {
    if (analyzer.value) {
      analyzer.value.minDecibels = min
      analyzer.value.maxDecibels = max
      analyzer.value.fftSize = length * 2
    }
  }, { deep: true })

  let array = new Uint8Array(config.value.length).map(() => 0)
  watch(() => config.value.length, (length) => {
    array = new Uint8Array(length).map(() => 0)
    bins.value = Array.from(array, el => el / 255)
  })

  useRafFn(() => {
    if (analyzer.value)
      analyzer.value.getByteFrequencyData(array)

    bins.value = Array.from(array, el => el / 255)
  }, { immediate: true })

  const effect = computed(() => {
    const bass = bins.value.slice(Math.round(bins.value.length * 0.3), Math.round(bins.value.length * 0.35))
    return ((avg(bass) ** 2 + max(bins.value) ** 2 + 0.5 * avg(bins.value) ** 0.7) / 2.5) ** 2
  },
  )

  return {
    config,
    bins: shallowReadonly(bins),
    effect: readonly(effect),
  }
})
