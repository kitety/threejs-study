import { useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import DatGui, {
  DatBoolean,
  DatColor,
  DatFolder,
  DatNumber,
  DatPresets,
  DatSelect,
} from 'react-dat-gui';
import { useRef } from 'react';

const worldColorImg =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/worldColour.5400x2700.jpg';

const normalImg =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/material-textures-3.zip-earth_normalmap_8192x4096.jpg';

// 法线贴图

const Index = () => {
  const objectRef = useRef<Array<THREE.MeshPhysicalMaterial | THREE.SpotLight>>(
    [],
  );
  const renderRef = useRef<Function | null>(null);
  const state = useReactive({
    data: {
      x: 10,
      y: 10,
      lx: 0,
    },
  });
  useMount(() => {
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

    const light = new THREE.SpotLight(0xffffff, 2);
    light.position.set(0, 5, 10);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );

    camera.position.set(0, 0, 3);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    const planeGeo = new THREE.PlaneGeometry(3.6, 1.8);
    const material = new THREE.MeshPhysicalMaterial();
    const texture = new THREE.TextureLoader().load(worldColorImg);
    material.map = texture;

    const normalTexture = new THREE.TextureLoader().load(normalImg);
    material.normalMap = normalTexture;
    material.normalScale.set(2, 2);

    const plane = new THREE.Mesh(planeGeo, material);
    scene.add(plane);
    objectRef.current = [material, light];

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
      controls.update();
      render();
      requestAnimationFrame(animate);
    }
    renderRef.current = animate;

    animate();
  });

  const handleUpdate = (value: typeof state.data) => {
    console.log('value: ', value);
    state.data = value;
    const [material, light] = objectRef.current;

    (material as THREE.MeshPhysicalMaterial).normalScale.x = value.x;
    (material as THREE.MeshPhysicalMaterial).normalScale.y = value.y;
    // (material as THREE.MeshPhysicalMaterial).needsUpdate = true;
    (light as THREE.SpotLight).position.x = value.lx;
  };

  return (
    <div className="con">
      <DatGui data={state.data} onUpdate={handleUpdate} className="my_gui">
        <DatFolder title="matreial" closed={false}>
          <DatNumber path="x" label="x" min={0} max={10} step={0.01} />
          <DatNumber path="y" label="y" min={0} max={10} step={0.01} />
          <DatNumber path="lx" label="light x" min={-20} max={20} step={0.01} />
        </DatFolder>
      </DatGui>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default Index;
