interface ImportMetaEnv {
  VITE_BASE_URL: string;
  VITE_API_URL: string;
  VITE_GQL_URL: string;
  VITE_KC_URL: string;
}

interface ImportMeta {
  readonly env: Readonly<ImportMetaEnv>;
}
