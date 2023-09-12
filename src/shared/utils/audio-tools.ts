export function audioDuration(src: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio(src)
    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration
      audio.src = ''
      resolve(duration)
    })
  })
}

export function audioTime(time: number): string {
  const m = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${m}:${`0${s}`.slice(-2)}`
}
