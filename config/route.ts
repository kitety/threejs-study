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
    name: '08PerspectiveCamera',
  },
  {
    path: '/09',
    component: '@/pages/09',
    name: '09OrthographicCamera',
  },
  {
    path: '/10',
    component: '@/pages/10',
    name: '10FakeShadow',
  },
  {
    path: '/11',
    component: '@/pages/11',
    name: '11Shadow',
  },
  {
    path: '/12',
    component: '@/pages/12',
    name: '12SpotLightShadow',
  },
  {
    path: '/13',
    component: '@/pages/13',
    name: '13PointLightShadow',
  },
  {
    path: '/14',
    component: '@/pages/14',
    name: '14Fog',
  },
  {
    path: '/15',
    component: '@/pages/15',
    name: '15Render Target',
  },
  {
    path: '/16',
    component: '@/pages/16',
    name: '16按需渲染',
  },
];
export default routes;
