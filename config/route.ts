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
  {
    path: '/45',
    component: '@/pages/45',
    name: '45 custom mipmaps',
  },
  {
    path: '/46',
    component: '@/pages/46',
    name: '46 anistropic',
  },
  {
    path: '/48',
    component: '@/pages/48',
    name: '48 directional light',
  },
  {
    path: '/49',
    component: '@/pages/49',
    name: '49 hemisphere light',
  },
  {
    path: '/50',
    component: '@/pages/50',
    name: '50 point light',
  },
  {
    path: '/51',
    component: '@/pages/51',
    name: '51 spot light',
  },
  {
    path: '/52',
    component: '@/pages/52',
    name: '52 spot light shadow',
  },
  {
    path: '/53',
    component: '@/pages/53',
    name: '53 directional light shadow',
  },
  {
    path: '/54',
    component: '@/pages/54',
    name: '54 TrackballControls ',
  },
  {
    path: '/55',
    component: '@/pages/55',
    name: '55 pointerlock-controls',
  },
  {
    path: '/56',
    component: '@/pages/56',
    name: '56 drag controls',
  },
  {
    path: '/57',
    component: '@/pages/57',
    name: '57 transform controls',
  },
  {
    path: '/58',
    component: '@/pages/58',
    name: '58 multi controls',
  },
  {
    path: '/59',
    component: '@/pages/59',
    name: '59 obj model loader',
  },
  {
    path: '/60',
    component: '@/pages/60',
    name: '60 mtl loader',
  },
  {
    path: '/61',
    component: '@/pages/61',
    name: '61 gltf loader',
  },
  {
    path: '/62',
    component: '@/pages/62',
    name: '62 gltf loader',
  },
  {
    path: '/63',
    component: '@/pages/63',
    name: '63 draco loader',
  },
  {
    path: '/64',
    component: '@/pages/64',
    name: '64 ply loader',
  },
  {
    path: '/65',
    component: '@/pages/65',
    name: '65 stl loader',
  },
  {
    path: '/66',
    component: '@/pages/66',
    name: '66 fbx loader',
  },
  {
    path: '/67',
    component: '@/pages/67',
    name: '67 gltf animations',
  },
  {
    path: '/68',
    component: '@/pages/68',
    name: '68 gltf-animations-drag',
  },
  {
    path: '/69',
    component: '@/pages/69',
    name: '69 reflector',
  },
];
export default routes;
