declare interface Window {
  ipc: {
    minimize(): void
    maximize(): void
    unmaximize(): void
    close(): void
  }
}
