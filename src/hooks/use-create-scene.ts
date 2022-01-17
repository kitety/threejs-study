import { RefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
type RenderType = () => void;
const useCreateScene = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const renderRef = useRef<RenderType | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        preserveDrawingBuffer: true,
        alpha: true,
      });
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x222222);

      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
      camera.position.set(0, 5, 10);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 10, 0);
      scene.add(light);

      const controls = new OrbitControls(camera, canvasRef.current);
      controls.update();

      const colors = ['blue', 'green', 'red'];
      const cubes: THREE.Mesh[] = [];

      colors.forEach((color, i) => {
        const material = new THREE.MeshPhongMaterial({ color });
        const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set((i - 1) * 4, 0, 0);
        cubes.push(cube);
        scene.add(cube);
      });
      const render = () => {
        renderer.render(scene, camera);
      };
      const animate = (time: number) => {
        time = time * 0.001;
        cubes.forEach((cube, i) => {
          cube.rotation.x = time;
          cube.rotation.y = time;
        });
        render();
        requestAnimationFrame(animate);
      };
      renderRef.current = render;
      requestAnimationFrame(animate);
      const handleResize = () => {
        console.log(11);
        if (canvasRef.current === null) {
          return;
        }
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        camera.aspect = width / height;
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

  return renderRef;
};
export default useCreateScene;
