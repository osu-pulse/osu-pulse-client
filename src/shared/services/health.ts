export const useHealthService = createGlobalState(() => ({
  health: () =>
    useQuery<{ health: true }, Record<string, never>>(
      gql`
        query health {
          health
        }
      `,
    ),
}));
