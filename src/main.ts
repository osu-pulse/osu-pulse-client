import { createRouter, createWebHistory } from 'vue-router'
import { provideApolloClient } from '@vue/apollo-composable'
import { createApp } from 'vue'
import App from '@/App.vue'
import { friendsRoute } from '@/friends/router'
import { homeRoute } from '@/home/router'
import { settingsRoute } from '@/settings/router'
import { apolloClient } from '@/core/utils/apollo'
import { devicesRoute } from '@/devices/router'
import { RouteName } from '@/shared/constants/route-name'
import { playlistsRoute } from '@/playlists/router'
import { libraryRoute } from '@/library/router'
import { themesRoute } from '@/themes/router'

provideApolloClient(apolloClient)

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: { name: RouteName.HOME } },
    devicesRoute,
    friendsRoute,
    homeRoute,
    playlistsRoute,
    libraryRoute,
    settingsRoute,
    themesRoute,
  ],
})
app.use(router)

app.mount('#app')
