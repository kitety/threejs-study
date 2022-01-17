import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
let boo = false;

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 2, 1, 100);
      camera.position.z = 20;
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 5, 10);
      scene.add(light);

      const controls = new OrbitControls(camera, canvasRef.current);
      // 惯性
      controls.enableDamping = true;
      controls.update();

      const colors = ['blue', 'red', 'green'];

      const box: THREE.Mesh[] = [];

      colors.forEach((color, i) => {
        const mat = new THREE.MeshPhongMaterial({ color });
        const geometry = new THREE.BoxGeometry(4, 4, 4);
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.set(6 * (i - 1), 0, 0);
        scene.add(mesh);
        box.push(mesh);
      });

      const render = () => {
        boo = false;
        controls.update();
        renderer.render(scene, camera);
      };
      const handleChange = () => {
        if (!boo) {
          boo = true;
          window.requestAnimationFrame(render);
        }
      };
      controls.addEventListener('change', handleChange); //添加事件处理函数，触发重新渲染
      window.requestAnimationFrame(render);
      const handleResize = () => {
        if (canvasRef.current) {
          const width = canvasRef.current.clientWidth;
          const height = canvasRef.current.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          window.requestAnimationFrame(render);
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
