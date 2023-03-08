import { createSharedComposable, whenever } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { usePlayer } from '@/player/stores/player'
import { useTracksService } from '@/shared/services/tracks'
import { omit } from '@/shared/utils/object'

export const useUrlTrack = createSharedComposable(() => {
  const router = useRouter()
  const route = useRoute()

  const tracksService = useTracksService()
  const { result } = tracksService.track(computed(() => route.query.trackId as string))

  const { track } = usePlayer()
  whenever(result, async (result) => {
    track.value = result.track

    await router.replace({
      query: omit(route.query, ['trackId']),
    })
  })
})
