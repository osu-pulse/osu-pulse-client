interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_GQL_URL: string;
}

interface ImportMeta {
  readonly env: Readonly<ImportMetaEnv>;
}
