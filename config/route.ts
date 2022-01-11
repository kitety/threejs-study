import { IBestAFSRoute } from '@umijs/plugin-layout';

const routes: IBestAFSRoute[] = [
  {
    path: '/',
    component: '@/pages/index',
    name:'首页',
  },
  {
    path: '/user',
    component: '@/pages/user',
    name:'user',
  },
];
export default routes;
