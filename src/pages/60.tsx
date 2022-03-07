import { useEventListener, useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
const objLink =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/monkey.obj';
const mtlLink =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/monkey.mtl';
const monkeyTexturedMtl =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/monkeyTextured.mtl';
const monkeyTexturedObj =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/monkeyTextured.obj';
// ![](https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/grid.png)

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
    light.position.set(2.5, 7.5, 15);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );
    const objLoader = new OBJLoader();

    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshNormalMaterial();

    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    camera.position.set(0, 0, 3);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    renderer.domElement.ondragstart = function (event) {
      event.preventDefault();
      return false;
    };
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlLink, (material) => {
      material.preload();
      objLoader.setMaterials(material);
      objLoader.load(
        objLink,
        (obj) => {
          scene.add(obj);
          // 轨道控制器
          const controls = new TransformControls(camera, renderer.domElement);
          controls.attach(obj);
          controlsRef.current = controls;
          scene.add(controls);
          controls.addEventListener('dragging-changed', function (event) {
            orbitControls.enabled = !event.value;
            //dragControls.enabled = !event.value
          });
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.log(error);
        },
      );
    });

    mtlLoader.load(
      monkeyTexturedMtl,
      (materials) => {
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
          monkeyTexturedObj,
          (object) => {
            object.position.x = 2.5;
            scene.add(object);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          (error) => {
            console.log('An error happened');
          },
        );
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.log('An error happened');
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
