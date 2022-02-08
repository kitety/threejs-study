import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useReactive } from 'ahooks';
import { Spin } from 'antd';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const modelSrc = 'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/glb.glb';

const Index = () => {
  const state = useReactive({
    count: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
      camera.position.set(10, 0, 10);

      const light = new THREE.HemisphereLight(0xffffff, 0x333333, 1);
      scene.add(light);

      const controls = new OrbitControls(camera, canvasRef.current);
      controls.update();

      const colors = [
        'red',
        'blue',
        'darkorange',
        'darkviolet',
        'green',
        'tomato',
        'sienna',
        'crimson',
      ];
      const cube_size = 1; //立方体尺寸
      const cube_margin = 0.6; //立方体间距空隙
      colors.forEach((color, index) => {
        const geometry = new THREE.BoxBufferGeometry(
          cube_size,
          cube_size,
          cube_size,
        );
        const material = new THREE.MeshPhongMaterial({
          color,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = (index % 2 ? 1 : -1) * cube_size * cube_margin;
        cube.position.y =
          (Math.floor(index / 4) ? -1 : 1) * cube_size * cube_margin;
        cube.position.z =
          index % 4 >= 2 ? 1 : (-1 * cube_size * cube_margin) / 2;

        scene.add(cube);
      });

      const render = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);

      const handleResize = () => {
        if (canvasRef.current === null) {
          return;
        }

        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        const canvasAspect = width / height;

        camera.aspect = canvasAspect;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [canvasRef]);
  return (
    <>
      <Spin tip={`已经加载：${state.count}%`} spinning={false}>
        <canvas ref={canvasRef} className="full-screen" />
      </Spin>
    </>
  );
};

export default Index;
