import { defineConfig } from 'umi';
import routes from './route';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout: {
    name: 'Threejs Demo',
    routes,
  },
  mfsu: {},
  routes,
  fastRefresh: {},
  webpack5: {},
  publicPath: 'https://kitety.github.io/threejs-study/',
  base: '/threejs-study/',
});
