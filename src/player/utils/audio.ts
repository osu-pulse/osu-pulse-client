export interface FadeOptions {
  target: number;
  source?: number;
  duration?: number;
}

const intervals: Record<string, any> = {};

export async function fade(
  audio: HTMLMediaElement,
  options: FadeOptions,
): Promise<void> {
  const { target, source, duration } = {
    source: audio.volume,
    duration: 300,
    ...options,
  };
  await new Promise((resolve) => {
    audio.volume = source;
    const delta = target > source ? 0.05 : -0.05;
    clearInterval(intervals[audio.src]);

    intervals[audio.src] = setInterval(() => {
      console.log(audio.volume, audio.src);
      if (Math.abs(audio.volume - target) > Math.abs(delta)) {
        audio.volume += delta;
      } else {
        audio.volume = target;
        clearInterval(intervals[audio.src]);
        resolve(undefined);
      }
    }, duration / (Math.abs(audio.volume - target) / Math.abs(delta)));
  });
}

export interface CrossFadeOptions {
  volume?: number;
  duration?: number;
}

export async function crossFade(
  sourceAudio: HTMLMediaElement,
  targetAudio: HTMLMediaElement,
  options?: CrossFadeOptions,
): Promise<void> {
  const { volume, duration } = {
    volume: sourceAudio.volume,
    duration: 300,
    ...options,
  };
  await Promise.all([
    fade(sourceAudio, { source: volume, target: 0, duration }),
    fade(targetAudio, { source: 0, target: volume, duration }),
  ]);
}

export function calcBuffer(ranges: TimeRanges, progress: number): number {
  for (let i = 0; i < ranges.length; ++i) {
    if (ranges.start(i) <= progress && ranges.end(i) >= progress) {
      return ranges.end(i);
    }
  }
  return 0;
}
