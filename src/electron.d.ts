declare interface Window {
    electron: {
      minimize(): void;
      maximize(): void;
      unmaximize(): void;
      close(): void;
    }
}
