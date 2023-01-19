import type { RouteRecordRaw } from 'vue-router';

export const playlistsRoute: RouteRecordRaw = {
  name: RouteName.PLAYLISTS,
  path: '/playlists',
  component: () => import('../views/PlaylistView.vue'),
};
