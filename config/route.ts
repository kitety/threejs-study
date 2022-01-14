import { IBestAFSRoute } from '@umijs/plugin-layout';

const routes: IBestAFSRoute[] = [
  {
    path: '/',
    component: '@/pages/01',
    name: '01BoxGeometry',
  },
  {
    path: '/02',
    component: '@/pages/02',
    name: '02size',
  },
  {
    path: '/03',
    component: '@/pages/03',
    name: '03Primitives',
  },
  {
    path: '/04',
    component: '@/pages/04',
    name: '04Scene',
  },
  {
    path: '/05',
    component: '@/pages/05',
    name: '05Texture',
  },
  {
    path: '/06',
    component: '@/pages/06',
    name: '06Texture',
  },
  {
    path: '/07',
    component: '@/pages/07',
    name: '07Light',
  },
  {
    path: '/08',
    component: '@/pages/08',
    name: '08Camera',
  },
];
export default routes;