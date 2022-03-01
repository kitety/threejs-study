import { useEventListener, useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { useRef } from 'react';

const Index = () => {
  const state = useReactive({
    lock: true,
  });
  const renderRef = useRef<Function | null>(null);
  const controlsRef = useRef<DragControls | null>(null);

  useMount(() => {
    const scene1 = new THREE.Scene();
    scene1.add(new THREE.AxesHelper(5));

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );
    const light = new THREE.PointLight();
    light.position.set(10, 10, 10);
    scene1.add(light);

    camera.position.set(0, 1, 3);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);
    const geometry = new THREE.BoxGeometry();

    const material = [
      new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true }),
      new THREE.MeshPhongMaterial({ color: 0x00ff00, transparent: true }),
      new THREE.MeshPhongMaterial({ color: 0x0000ff, transparent: true }),
    ];

    const cubes = [
      new THREE.Mesh(geometry, material[0]),
      new THREE.Mesh(geometry, material[1]),
      new THREE.Mesh(geometry, material[2]),
    ];
    cubes[0].position.x = -2;
    cubes[1].position.x = 0;
    cubes[2].position.x = 2;
    cubes.forEach((c) => scene1.add(c));
    // 轨道控制器
    const controls = new DragControls(cubes, camera, renderer.domElement);
    controlsRef.current = controls;
    controls.addEventListener('hoveron', function (event) {
      console.log('event: ', event);
    });

    window.addEventListener('resize', onWindowResize, false);
    function render() {
      renderer.render(scene1, camera);
    }
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);
      render();
    }
    function animate() {
      // controls.update();
      render();
      requestAnimationFrame(animate);
    }
    renderRef.current = animate;

    animate();
  });

  return (
    <div className="con">
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default Index;
