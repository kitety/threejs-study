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
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        'https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
        (texture) => {
          const crt = new THREE.WebGLCubeRenderTarget(texture.image.height);
          crt.fromEquirectangularTexture(renderer, texture);
          scene.background = crt.texture;
        },
      );

      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
      camera.position.set(10, 0, 10);

      const light = new THREE.HemisphereLight(0xffffff, 0x333333, 1);
      scene.add(light);

      const controls = new OrbitControls(camera, canvasRef.current);
      controls.update();

      const loader = new GLTFLoader();
      loader.load(
        modelSrc,
        (group) => {
          console.log('group: ', group);
          scene.add(group.scene);
        },
        (event) => {
          console.log(
            Math.floor((event.loaded * 100) / event.total) + '% loaded',
          );
          state.count = Math.floor((event.loaded * 100) / event.total);
        },
        (error) => {
          console.log(error.type);
        },
      );

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
      <Spin tip={`已经加载：${state.count}%`} spinning={state.count < 100}>
        <canvas
          ref={canvasRef}
          className="full-screen"
          style={{
            background:
              'url(https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220207175946.png) no-repeat center center',
            backgroundSize: 'cover',
          }}
        />
      </Spin>
    </>
  );
};

export default Index;
