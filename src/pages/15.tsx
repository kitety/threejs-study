import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as RTScene from './component/render-target-scene';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const rtScene = RTScene.scene;
      const rtBoxs = RTScene.boxs;
      const rtCamera = RTScene.camera;

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      // 离屏渲染对象的尺寸为 宽 512 像素、高 512 像素
      const rendererTarget = new THREE.WebGLRenderTarget(512, 512);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x333333);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 10, 10);
      light.target.position.set(-2, 2, 2);
      scene.add(light);
      scene.add(light.target);

      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
      camera.position.set(0, 0, 15);

      const controls = new OrbitControls(camera, canvasRef.current);
      controls.update();

      const material = new THREE.MeshStandardMaterial({
        map: rendererTarget.texture,
      });

      const cubeGeo = new THREE.BoxBufferGeometry(4, 4, 4);
      const cubeMesh = new THREE.Mesh(cubeGeo, material);
      cubeMesh.position.set(4, 0, 0);
      scene.add(cubeMesh);

      const circleGeo = new THREE.CircleBufferGeometry(2.8, 32);
      const circleMesh = new THREE.Mesh(circleGeo, material);
      circleMesh.position.set(-4, 0, 0);
      scene.add(circleMesh);

      const render = (time: number) => {
        time *= 0.001;
        rtBoxs.forEach((box) => {
          box.rotation.set(time, time, 0);
        });
        renderer.setRenderTarget(rendererTarget);
        renderer.render(rtScene, rtCamera);
        renderer.setRenderTarget(null);
        // 虽然渲染器的渲染目标最终又被设置为 null，但是 离屏渲染的画面我们已经获得并保存在 rendererTarget 中。

        cubeMesh.rotation.set(time, time, 0);
        renderer.render(scene, camera);
        window.requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);
      const handleResize = () => {
        if (canvasRef.current) {
          const width = canvasRef.current.clientWidth;
          const height = canvasRef.current.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default Index;
