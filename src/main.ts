import { createRouter, createWebHistory } from 'vue-router';
import { provideApolloClient } from '@vue/apollo-composable';
import App from '~/App.vue';

provideApolloClient(apolloClient);

const app = createApp(App);

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
});
app.use(router);

app.mount('#app');
