import type { Track } from '~/shared/dto/track';
import { calcBuffer } from '~/player/utils/audio';
import { useTracksService } from '~/shared/services/tracks';

const usePlayerState = createGlobalState(() => ({
  track: shallowRef<Track>(),

  audio: shallowRef(new Audio()),
  caching: ref(false),

  playing: ref(false),
  progress: ref(0),
  buffer: ref(0),
  duration: ref(0),
  volume: ref(1),
  muted: ref(false),
  ended: ref(false),
}));

export const usePlayer = createSharedComposable(() => {
  const {
    track,
    audio,
    playing,
    caching,
    progress,
    buffer,
    duration,
    volume,
    muted,
    ended,
  } = usePlayerState();

  // TODO: Вынести в хук с кэшами
  const tracksService = useTracksService();
  const { mutate: mutateCacheTrack } = tracksService.cacheTrack();
  async function cacheTrack() {
    if (track.value && !track.value.url.audio) {
      caching.value = true;
      const result = await mutateCacheTrack({
        trackId: track.value.id,
      });

      const cachedTrack = result?.data?.cacheTrack;
      if (cachedTrack && cachedTrack.id === track.value?.id) {
        track.value = result?.data?.cacheTrack;
        caching.value = false;
      }
    }
  }
  const cacheTrackDebounced = useDebounceFn(cacheTrack, 500, { maxWait: 0 });

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(
    playing,
    async (value) => {
      if (!value) {
        audio.value.pause();
      } else if (track.value?.url?.audio) {
        audio.value.play();
      } else {
        cacheTrackDebounced().then();
      }
    },
    { immediate: true },
  );
  const { ignoreUpdates: ignoreProgressUpdates } = watchIgnorable(
    progress,
    (value) => (audio.value.currentTime = value),
    { immediate: true },
  );
  const { ignoreUpdates: ignoreVolumeUpdates } = watchIgnorable(
    volume,
    (value) => (audio.value.volume = value),
    { immediate: true },
  );
  const { ignoreUpdates: ignoreMuteUpdates } = watchIgnorable(
    muted,
    (value) => (audio.value.muted = value),
    { immediate: true },
  );

  useEventListener(audio, 'canplay', () => playing.value && audio.value.play());
  useEventListener(audio, 'play', () =>
    ignorePlayingUpdates(() => (playing.value = true)),
  );
  useEventListener(audio, 'pause', () =>
    ignorePlayingUpdates(() => (playing.value = false)),
  );
  useEventListener(audio, 'timeupdate', () =>
    ignoreProgressUpdates(() => (progress.value = audio.value.currentTime)),
  );
  useEventListener(
    audio,
    'progress',
    () => (buffer.value = calcBuffer(audio.value.buffered, progress.value)),
  );
  useEventListener(
    audio,
    'durationchange',
    () =>
      (duration.value = isNaN(audio.value.duration) ? 0 : audio.value.duration),
  );
  useEventListener(audio, 'volumechange', () =>
    ignoreVolumeUpdates(() =>
      ignoreMuteUpdates(() => {
        volume.value = audio.value.volume;
        muted.value = audio.value.muted;
      }),
    ),
  );
  useEventListener(audio, 'ended', () => (ended.value = true));
  useEventListener(audio, 'playing', () => (ended.value = false));

  watch(track, async (value, oldValue) => {
    const oldSrc = oldValue?.url?.audio;
    const src = value?.url?.audio;

    if (oldSrc !== src) {
      duration.value = 0;
      caching.value = false;

      if (src) {
        audio.value.src = src;
      } else if (playing.value) {
        audio.value.src = '';
        cacheTrackDebounced().then();
      }

      ignoreProgressUpdates(() => (progress.value = 0));
      duration.value = 0;
    }
  });

  return {
    track,

    audio: readonly(audio),
    caching: readonly(caching),

    playing,
    progress,
    volume,
    muted,
    buffer: readonly(buffer),
    duration: readonly(duration),
    ended: readonly(ended),
  };
});
