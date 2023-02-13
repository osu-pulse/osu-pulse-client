export interface FadeOptions {
  target: number;
  source?: number;
  duration?: number;
  delta?: number;
  multi?: boolean;
}

type FadeId = string;
const intervals: Record<FadeId, any> = {};
const multiIntervals: Record<FadeId, any> = {};
const multiAudios: Record<FadeId, HTMLMediaElement> = {};
const multiQueue: FadeId[] = [];

export async function fade(
  audio: HTMLMediaElement,
  options: FadeOptions,
): Promise<void> {
  const { target, source, duration, step, multi } = {
    source: audio.volume,
    duration: 2000,
    step: 0.05,
    multi: false,
    ...options,
  };

  await new Promise((resolve) => {
    audio.volume = source;
    let cache = audio.volume;
    const id = audio.src;

    function removeSingle(id: FadeId) {
      clearInterval(intervals[id]);
      delete intervals[id];
    }

    function removeMulti(id: FadeId) {
      clearInterval(multiIntervals[id]);
      multiAudios[id].pause();
      delete multiIntervals[id];
      delete multiAudios[id];
      const index = multiQueue.findIndex((el) => el === id);
      multiQueue.splice(index, 1);
    }

    function finish() {
      if (intervals[id]) {
        removeSingle(id);
      }
      if (multiIntervals[id]) {
        removeMulti(id);
      }
    }

    finish();

    const intervalId = setInterval(() => {
      if (cache !== audio.volume) {
        console.log('invalid');
        finish();
        resolve(undefined);
      } else if (Math.abs(audio.volume - target) > step) {
        audio.volume += (target > source ? 1 : -1) * step;
        cache = audio.volume;
      } else {
        console.log('finished');
        audio.volume = target;
        finish();
        resolve(undefined);
      }
    }, duration / (Math.abs(audio.volume - target) / step));

    if (multi) {
      multiIntervals[id] = intervalId;
      multiAudios[id] = audio;
      multiQueue.push(id);
      console.log(multiQueue.length);
      multiQueue.slice(0, -2).forEach(removeMulti);
    } else {
      intervals[id] = intervalId;
    }
  });
}

export interface CrossFadeOptions {
  target?: number;
  duration?: number;
}

export async function crossFade(
  sourceAudio?: HTMLMediaElement,
  targetAudio?: HTMLMediaElement,
  options?: CrossFadeOptions,
): Promise<void> {
  const { target, duration } = {
    target: sourceAudio?.volume ?? 1,
    duration: 3000,
    ...options,
  };
  await Promise.all(
    [
      sourceAudio &&
        fade(sourceAudio, { source: target, target: 0, duration, multi: true }),
      targetAudio && fade(targetAudio, { source: 0, target, duration }),
    ].filter(Boolean),
  );
}

export function calcBuffer(ranges: TimeRanges, progress: number): number {
  for (let i = 0; i < ranges.length; ++i) {
    if (ranges.start(i) <= progress && ranges.end(i) >= progress) {
      return ranges.end(i);
    }
  }
  return 0;
}
