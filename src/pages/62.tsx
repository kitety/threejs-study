import { useEventListener, useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const GLTFLink =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/monkey.gltf';
const LGBlink =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/monkey.glb';

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

    const light = new THREE.PointLight();
    light.position.set(5, 5, 5);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );
    const objLoader = new OBJLoader();

    camera.position.set(0, 0, 2);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    renderer.domElement.ondragstart = function (event) {
      event.preventDefault();
      return false;
    };
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    const loader = new GLTFLoader();

    loader.load(
      LGBlink,
      (GLTF) => {
        GLTF.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.receiveShadow = true;
            m.castShadow = true;
          }
          if ((child as THREE.Light).isLight) {
            const l = child as THREE.Light;
            l.castShadow = true;
            l.shadow.bias = -0.003;
            l.shadow.mapSize.width = 2048;
            l.shadow.mapSize.height = 2048;
          }
        });
        scene.add(GLTF.scene);
        // 轨道控制器
        const controls = new TransformControls(camera, renderer.domElement);
        controls.attach(GLTF.scene);
        controlsRef.current = controls;
        scene.add(controls);
        controls.addEventListener('dragging-changed', function (event) {
          orbitControls.enabled = !event.value;
        });
      },
      (xhr) => {
        console.log('xhr: ', xhr);
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.log(error);
      },
    );

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
