import { createRouter, createWebHistory } from 'vue-router';
import { provideApolloClient } from '@vue/apollo-composable';
import App from '~/App.vue';
import { useAuthentication } from '~/auth/stores/authentication';

provideApolloClient(apolloClient);

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: [
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

const { auth } = useAuthentication();
await auth();
app.mount('#app');
