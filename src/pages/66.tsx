import { useEventListener, useMount } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const fbxSrc =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/xbot.fbx';

const Index = () => {
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
    // scene.background = new THREE.Color(0xff0000);

    const light = new THREE.PointLight();
    light.position.set(0.8, 1.4, 1.0);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );

    camera.position.set(0, 0, 4);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    renderer.domElement.ondragstart = function (event) {
      event.preventDefault();
      return false;
    };
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    const loader = new FBXLoader();

    const material = new THREE.MeshNormalMaterial();
    loader.load(
      fbxSrc,
      (object) => {
        console.log('object: ', object);
        object.traverse(function (child) {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = material;
            if ((child as THREE.Mesh).material as THREE.Material) {
              ((child as THREE.Mesh).material as THREE.Material).transparent =
                false;
            }
          }
        });
        object.scale.set(0.01, 0.01, 0.01);
        scene.add(object);

        // 轨道控制器
        const controls = new TransformControls(camera, renderer.domElement);
        controls.attach(object);
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
