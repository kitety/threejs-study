import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CameraHelper, Scene } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface SphereShadowBase {
  base: THREE.Object3D;
  sphereMesh: THREE.Mesh;
  shadowMesh: THREE.Mesh;
  y: number;
}

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xadd8e6);
      // scene.fog = new THREE.Fog(0xadd8e6, 1, 2);
      scene.fog = new THREE.FogExp2(0xadd8e6, 0.8);

      const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
      camera.position.set(0, 0, 2);

      const controls = new OrbitControls(camera, canvasRef.current);
      controls.update();

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(-1, 2, 4);
      scene.add(light);

      const colors = ['blue', 'red', 'green'];

      const box: THREE.Mesh[] = [];

      colors.forEach((color, i) => {
        const mat = new THREE.MeshPhongMaterial({ color });
        if(i===0){
          // 不受雾的影响
          mat.fog=false;
        }
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.set(2 * (i - 1), 0, 0);
        scene.add(mesh);
        box.push(mesh);
      });

      const render = (time: number) => {
        time *= 0.001;
        box.forEach((mesh, i) => {
          mesh.rotation.y = time;
          mesh.rotation.x = time;
        });

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
