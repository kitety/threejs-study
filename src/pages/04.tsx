import React, { useCallback, useEffect, useRef } from 'react';
import * as Three from 'three';
import {
  cone,
  cylinder,
  dodecahedron,
  edges,
  extrude,
  icos,
  lathe,
  myBox,
  myCircle,
  myOctahedron,
  plane,
  polyhedron,
  ring,
  shapeG,
  Sphere,
  tetrahedron,
  torus,
  torusknot,
  wireframe,
} from './component/03';
import {
  earthOrbit,
  moonOrbit,
  pointLight,
  sunEarthOrbit,
} from './component/create-something';

const nodeArr = [sunEarthOrbit, earthOrbit, moonOrbit]; //太阳、地球、月亮对应的网格
const Primitives = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Three.WebGLRenderer | null>(null);
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null);
  const sceneRef = useRef<Three.Scene | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      // 创建渲染器
      const renderer = new Three.WebGL1Renderer({ canvas: canvasRef.current });
      rendererRef.current = renderer;

      // 创建镜头
      const camera = new Three.PerspectiveCamera(40, 2, 0.1, 1000);
      camera.position.set(0, 50, 0);
      camera.up.set(0, 0, 1);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // 创建场景
      const scene = new Three.Scene();
      scene.background = new Three.Color(0x111111);
      sceneRef.current = scene;

      // 将太阳系和灯光添加进来
      scene.add(pointLight);
      scene.add(sunEarthOrbit);

      renderer.render(scene, camera);

      nodeArr.forEach((item) => {
        const axes = new Three.AxesHelper();
        const material = axes.material as Three.Material;
        material.depthTest = false;
        axes.renderOrder = 1; // renderOrder 的该值默认为 0，这里设置为 1 ，目的是为了提高优先级，避免被物体本身给遮盖住
        item.add(axes);
      });
      const render = (time: number) => {
        // 转换为秒
        time *= 0.001;
        nodeArr.forEach((node) => {
          node.rotation.y = time;
        });
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
      // render()

      const resize = () => {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };
      resize();
      window.addEventListener('resize', resize);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }
  }, [canvasRef]);
  return <canvas ref={canvasRef} className="full-screen" />;
};

export default Primitives;
