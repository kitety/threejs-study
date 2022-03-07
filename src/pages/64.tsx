import { useEventListener, useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
const GLTFLink =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/monkey.gltf';
// 压缩过的文件
const LGBlink =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/monkey_compressed.glb';

// ply 文件
const plyFile =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/sean4.ply';

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
    light.position.set(20, 20, 20);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );

    camera.position.set(0, 0, 40);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    renderer.domElement.ondragstart = function (event) {
      event.preventDefault();
      return false;
    };
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    const loader = new PLYLoader();
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath(
    //   'https://cdn.jsdelivr.net/gh/google/draco@master/javascript/',
    // );
    // dracoLoader.setDecoderConfig({ type: 'js' });
    // loader.setDRACOLoader(dracoLoader);
    // 1
    const img1 =
      'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220307200636.png';
    // 2
    const img2 =
      'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220307200649.png';
    // 3
    const img3 =
      'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220307200704.png';
    // 4
    const img4 =
      'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220307200715.png';
    // 5
    const img5 =
      'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220307200726.png';
    // 6
    const img6 =
      'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220307200739.png';
    loader.load(
      plyFile,
      (geometry) => {
        const envTexture = new THREE.CubeTextureLoader().load([
          img1,
          img2,
          img3,
          img4,
          img5,
          img6,
        ]);
        envTexture.mapping = THREE.CubeReflectionMapping;
        const material = new THREE.MeshPhysicalMaterial({
          color: 0xb2ffc8,
          envMap: envTexture,
          metalness: 0,
          roughness: 0,
          transparent: true,
          transmission: 1.0,
          side: THREE.DoubleSide,
          clearcoat: 1.0,
          clearcoatRoughness: 0.25,
        });
        geometry.computeVertexNormals();
        console.log('geometry: ', geometry);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(-Math.PI / 2);
        scene.add(mesh);
        // 轨道控制器
        const controls = new TransformControls(camera, renderer.domElement);
        controls.attach(mesh);
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
