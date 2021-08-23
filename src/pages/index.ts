import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: {
      name: 'operations',
    },
  },
  {
    path: '/operations',
    name: 'operations',
    component() {
      return import('./Operations.vue');
    },
  },
  {
    path: '/operations/create',
    name: 'operations.create',
    component() {
      return import('./Operations.vue');
    },
    meta: {
      create: true,
    },
  },
  {
    path: '/operations/:id/edit',
    name: 'operations.edit',
    component() {
      return import('./Operations.vue');
    },
    meta: {
      create: true,
    },
  },
] as RouteRecordRaw[];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
