import './bootstrap';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Home from './components/Home.vue';
import Card from './components/Card.vue';
import TopTenBreweries from './components/TopTenBreweries.vue';

// Vue.use(VueRouter);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/top-ten-breweries', component: TopTenBreweries },
  ],
});

// export default router;

const app = createApp({
  components: {
    Navbar,
    Home,
    Card,
  },
  template: `
    <div>
      <Navbar />
      <router-view></router-view>
    </div>
  `
});

app.use(router);

app.mount("#app");