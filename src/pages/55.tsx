import { useEventListener, useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { useRef } from 'react';

const Index = () => {
  const state = useReactive({
    lock: true,
  });
  const renderRef = useRef<Function | null>(null);
  const controlsRef = useRef<PointerLockControls | null>(null);

  useEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyW':
        controlsRef.current?.moveForward(0.25);
        break;
      case 'KeyA':
        controlsRef.current?.moveRight(-0.25);
        break;
      case 'KeyS':
        controlsRef.current?.moveForward(-0.25);
        break;
      case 'KeyD':
        controlsRef.current?.moveRight(0.25);
        break;
    }
  });

  useMount(() => {
    const scene1 = new THREE.Scene();
    scene1.add(new THREE.AxesHelper(5));

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );

    camera.position.set(0, 1, 2);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    // 轨道控制器
    const controls = new PointerLockControls(camera, renderer.domElement);
    controlsRef.current = controls;
    const menuPanel = document.getElementById('menuPanel') as HTMLDivElement;
    const startButton = document.getElementById(
      'startButton',
    ) as HTMLInputElement;
    startButton.addEventListener(
      'click',
      function () {
        console.log(11);
        controls.lock();
      },
      false,
    );
    controls.addEventListener('lock', () => (menuPanel.style.display = 'none'));
    controls.addEventListener(
      'unlock',
      () => (menuPanel.style.display = 'block'),
    );

    const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene1.add(plane);

    const cubes: THREE.Mesh[] = [];

    for (let i = 0; i < 100; i++) {
      const geo = new THREE.BoxGeometry(
        Math.random() * 4,
        Math.random() * 4 * 4,
        Math.random() * 4,
      );
      const mat = new THREE.MeshBasicMaterial({ wireframe: true });

      switch (i % 3) {
        case 0:
          mat.color.set(0xff0000);
          break;
        case 1:
          mat.color.set(0x00ff00);
          break;
        case 2:
          mat.color.set(0x0000ff);
          break;
      }

      const cube = new THREE.Mesh(geo, mat);
      cubes.push(cube);
    }
    cubes.forEach((item) => {
      item.position.x = Math.random() * 100 - 50;
      item.position.z = Math.random() * 100 - 50;
      item.geometry.computeBoundingBox();
      item.position.y =
        (item.geometry.boundingBox!.max.y - item.geometry.boundingBox!.min.y) /
        2;
      scene1.add(item);
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
      <div id="menuPanel">
        <button id="startButton">Click to Start</button>
      </div>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default Index;
