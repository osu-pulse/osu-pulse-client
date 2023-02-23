export enum Platform {
  ELECTRON = 'electron',
  CAPACITOR = 'capacitor',
  WEB = 'web',
}

export const platform
  = (import.meta.env.VITE_PLATFORM as Platform) ?? Platform.WEB
