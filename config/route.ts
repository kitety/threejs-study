import { IBestAFSRoute } from '@umijs/plugin-layout';

const routes: IBestAFSRoute[] = [
  {
    path: '/',
    component: '@/pages/01',
    name:'01BoxGeometry',
  },
  {
    path: '/02',
    component: '@/pages/02',
    name:'02size',
  },
  {
    path: '/03',
    component: '@/pages/03',
    name:'03Primitives',
  },

];
export default routes;
