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
  {
    path: '/17',
    component: '@/pages/17',
    name: '17canvas',
  },
  {
    path: '/18',
    component: '@/pages/18',
    name: '18canvas2',
  },
  {
    path: '/19',
    component: '@/pages/19',
    name: '19Canvas Earth',
  },
  {
    path: '/20',
    component: '@/pages/20',
    name: '20 3D Earth',
  },
  {
    path: '/21',
    component: '@/pages/21',
    name: '21 3D Optimization Earth',
  },
  // 模型的加载
  {
    path: '/22',
    component: '@/pages/22',
    name: '22 model loader',
  },
  {
    path: '/23',
    component: '@/pages/23',
    name: '23 gltf loader',
  },
  {
    path: '/24',
    component: '@/pages/24',
    name: '24 scene background',
  },
  {
    path: '/25',
    component: '@/pages/25',
    name: '25 scene background',
  },
  {
    path: '/26',
    component: '@/pages/26',
    name: '26 SkyBox1',
  },
  {
    path: '/27',
    component: '@/pages/27',
    name: '27 SkyBox2',
  },
  {
    path: '/28',
    component: '@/pages/28',
    name: '28 transparent1',
  },
  {
    path: '/29',
    component: '@/pages/29',
    name: '29 transparent2',
  },
  {
    path: '/30',
    component: '@/pages/30',
    name: '30 transparent3',
  },
  {
    path: '/31',
    component: '@/pages/31',
    name: '31 transparent4',
  },
  {
    path: '/32',
    component: '@/pages/32',
    name: '32 scene ',
  },
  {
    path: '/33',
    component: '@/pages/33',
    name: '33 scene ',
  },
  {
    path: '/34',
    component: '@/pages/34',
    name: '34 scene ',
  },
  {
    path: '/35',
    component: '@/pages/35',
    name: '35 object-hierarchy ',
  },
  {
    path: '/36',
    component: '@/pages/36',
    name: '36 geometry-to-buffergeometry ',
  },
  {
    path: '/37',
    component: '@/pages/37',
    name: '37 SpecularMap',
  },
  {
    path: '/38',
    component: '@/pages/38',
    name: '38 roughness metalness',
  },
  {
    path: '/39',
    component: '@/pages/39',
    name: '39 bumpmap',
  },
  {
    path: '/40',
    component: '@/pages/40',
    name: '40 NormalMap',
  },
  {
    path: '/41',
    component: '@/pages/41',
    name: '41 displacmentmap',
  },
  {
    path: '/42',
    component: '@/pages/42',
    name: '42 displacmentmap normalmap',
  },
  {
    path: '/43',
    component: '@/pages/43',
    name: '43 texture offset repeat center',
  },
  {
    path: '/44',
    component: '@/pages/44',
    name: '44 mipmaps',
  },
];
export default routes;
