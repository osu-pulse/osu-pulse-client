import type { Track } from '~/shared/dto/track';
import { calcBuffer, crossFade } from '~/player/utils/audio';
import { useTracksService } from '~/shared/services/tracks';

const usePlayerState = createGlobalState(() => ({
  track: shallowRef<Track>(),

  fade: ref<number | undefined>(300),
  audio: shallowRef(new Audio()),
  caching: ref(false),

  playing: ref(false),
  progress: ref(0),
  buffer: ref(0),
  duration: ref(0),
  volume: ref(1),
  muted: ref(false),
}));

export const usePlayer = createSharedComposable(() => {
  const {
    track,
    fade,
    audio,
    playing,
    caching,
    progress,
    buffer,
    duration,
    volume,
    muted,
  } = usePlayerState();

  // TODO: Вынести в хук с кэшами
  const tracksService = useTracksService();
  const { mutate: mutateCacheTrack } = tracksService.cacheTrack();
  const mutateCacheTrackDebounced = useDebounceFn(mutateCacheTrack, 300);
  async function cacheTrack() {
    if (track.value && !track.value.url.audio) {
      caching.value = true;
      const result = await mutateCacheTrackDebounced({
        trackId: track.value.id,
      });

      const cachedTrack = result?.data?.cacheTrack;
      if (cachedTrack && cachedTrack.id === track.value?.id) {
        track.value = result?.data?.cacheTrack;
        caching.value = false;
      }
    }
  }

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(
    playing,
    async (value) => {
      if (value) {
        await cacheTrack();
        audio.value.play();
      } else {
        audio.value.pause();
      }
    },
  );
  const { ignoreUpdates: ignoreProgressUpdates } = watchIgnorable(
    progress,
    (value) => (audio.value.currentTime = value),
  );
  const { ignoreUpdates: ignoreVolumeUpdates } = watchIgnorable(
    volume,
    (value) => (audio.value.volume = value),
  );
  const { ignoreUpdates: ignoreMuteUpdates } = watchIgnorable(
    muted,
    (value) => (audio.value.muted = value),
  );

  const listeners: Pick<
    Record<keyof GlobalEventHandlersEventMap, () => void>,
    | 'canplay'
    | 'play'
    | 'pause'
    | 'timeupdate'
    | 'progress'
    | 'durationchange'
    | 'volumechange'
  > = {
    canplay: () => playing.value && audio.value.play(),
    play: () => ignorePlayingUpdates(() => (playing.value = true)),
    pause: () => ignorePlayingUpdates(() => (playing.value = false)),
    timeupdate: () =>
      ignoreProgressUpdates(() => (progress.value = audio.value.currentTime)),
    progress: () =>
      (buffer.value = calcBuffer(audio.value.buffered, progress.value)),
    durationchange: () => (duration.value = audio.value.duration),
    volumechange: () =>
      ignoreVolumeUpdates(() =>
        ignoreMuteUpdates(() => {
          volume.value = audio.value.volume;
          muted.value = audio.value.muted;
        }),
      ),
  };

  function createAudio(src: string) {
    audio.value = new Audio(src);
    audio.value.volume = volume.value;
    audio.value.muted = muted.value;
    listeners.timeupdate();
    listeners.progress();
    listeners.durationchange();
    Object.entries(listeners).forEach(([event, handler]) =>
      audio.value.addEventListener(event, handler),
    );
    return audio.value;
  }
  function cleanAudio() {
    Object.entries(listeners).forEach(([event, handler]) =>
      audio.value.removeEventListener(event, handler),
    );
    const cache = audio.value;
    audio.value = new Audio();
    listeners.timeupdate();
    listeners.progress();
    listeners.durationchange();
    return cache;
  }

  watch(track, async (value, oldValue) => {
    const oldSrc = oldValue?.url?.audio;
    const src = value?.url?.audio;

    if (oldSrc !== src) {
      const oldAudio = cleanAudio();

      if (src) {
        const newAudio = createAudio(src);
        // await crossFade(oldAudio, newAudio, { duration: 3000 });
      }
    }

    if (!src && playing.value) {
      await cacheTrack();
    }
  });

  return {
    track,

    fade,
    audio: readonly(audio),
    caching: readonly(caching),

    playing,
    progress,
    volume,
    muted,
    buffer: readonly(buffer),
    duration: readonly(duration),
  };
});
