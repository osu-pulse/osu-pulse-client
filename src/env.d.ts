interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_GQL_URL: string;
  VITE_AUTH_URL: string;
  VITE_PLATFORM: 'electron' | 'capacitor' | 'web' | undefined;
}

interface ImportMeta {
  readonly env: Readonly<ImportMetaEnv>;
}
