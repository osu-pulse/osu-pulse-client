import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/shared/constants/route-name'

export const playlistsRoute: RouteRecordRaw = {
  name: RouteName.PLAYLISTS,
  path: '/playlists',
  component: () => import('../views/PlaylistView.vue'),
}
