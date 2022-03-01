import { useMount } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { useRef } from 'react';

// 背景图
const bgImg =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220218194720.png';

const Index = () => {
  const renderRef = useRef<Function | null>(null);

  useMount(() => {
    const scene1 = new THREE.Scene();
    scene1.add(new THREE.AxesHelper(5));

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );

    camera.position.set(0, 0, 7);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    // 轨道控制器
    const controls = new TrackballControls(camera, renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene1.add(cube);

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
      controls.update();
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
