import { useEventListener, useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { useRef } from 'react';

const Index = () => {
  const state = useReactive({
    lock: true,
  });
  const renderRef = useRef<Function | null>(null);
  const controlsRef = useRef<TransformControls | null>(null);

  useEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyT':
        controlsRef.current?.setMode('translate');
        break;
      case 'KeyR':
        controlsRef.current?.setMode('rotate');
        break;
      case 'KeyS':
        controlsRef.current?.setMode('scale');
        break;
    }
  });

  useMount(() => {
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.set(0, 0, 2);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.domElement.ondragstart = function (event) {
      event.preventDefault();
      return false;
    };
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    // 轨道控制器
    const controls = new TransformControls(camera, renderer.domElement);
    controls.attach(cube);
    console.log('controls: ', controls);
    controlsRef.current = controls;
    scene.add(controls);

    window.addEventListener('resize', onWindowResize, false);
    function render() {
      renderer.render(scene, camera);
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
