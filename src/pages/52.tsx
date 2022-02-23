import { useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import DatGui, {
  DatBoolean,
  DatColor,
  DatFolder,
  DatNumber,
  DatSelect,
} from 'react-dat-gui';
import { useRef } from 'react';

// 背景图
const bgImg =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220218194720.png';

const Index = () => {
  const lightRef = useRef<THREE.SpotLight | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const materialRef = useRef<
    (
      | THREE.MeshBasicMaterial
      | THREE.MeshLambertMaterial
      | THREE.MeshPhongMaterial
      | THREE.MeshPhysicalMaterial
      | THREE.MeshToonMaterial
    )[]
  >([]);
  const renderRef = useRef<Function | null>(null);
  const state = useReactive({
    data: {
      intensity: 1,
      color: '#ffffff',
      bgColor: '#ffffff',
      mapsEnabled: true,
      x: 0,
      y: 2,
      z: 0,
      distance: 0,
      penumbra: 0,
      decay: 1,
      angle: Math.PI / 3,
    },
  });
  useMount(() => {
    const scene1 = new THREE.Scene();
    scene1.add(new THREE.AxesHelper(5));

    const light = new THREE.SpotLight();
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 100;
    scene1.add(light);
    const helper = new THREE.SpotLightHelper(light);
    const helper1 = new THREE.CameraHelper(light.shadow.camera);
    scene1.add(helper);
    scene1.add(helper1);
    light.position.set(0, 2, 0);
    const planeGeometry = new THREE.PlaneGeometry(100, 10);
    const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial());
    plane.rotateX(-Math.PI / 2);
    plane.position.y = -1.75;
    scene1.add(plane);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );

    camera.position.set(0, 0, 7);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);
    plane.receiveShadow = true;

    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    const torusGeometry = [
      new THREE.TorusGeometry(),
      new THREE.TorusGeometry(),
      new THREE.TorusGeometry(),
      new THREE.TorusGeometry(),
      new THREE.TorusGeometry(),
    ];
    const materials = [
      new THREE.MeshBasicMaterial(),
      new THREE.MeshLambertMaterial(),
      new THREE.MeshPhongMaterial(),
      new THREE.MeshPhysicalMaterial(),
      new THREE.MeshToonMaterial(),
    ];
    materialRef.current = materials;
    lightRef.current = light;
    const texture = new THREE.TextureLoader().load(bgImg);
    textureRef.current = texture;
    const torus = torusGeometry.map((geometry, index) => {
      const textureItem = materials[index];
      textureItem.map = texture;
      const torusItem = new THREE.Mesh(geometry, textureItem);
      torusItem.position.x = 4 * index - 8;
      return torusItem;
    });
    torus.forEach((item) => {
      scene1.add(item);
      item.castShadow = true;
      item.receiveShadow = true;
    });

    window.addEventListener('resize', onWindowResize, false);
    function render() {
      renderer.render(scene1, camera);
      torus.forEach((t) => {
        t.rotation.y += 0.01;
      });
    }
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
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
    state.data = value;
    if (lightRef.current) {
      lightRef.current.color.setHex(
        Number(value.color.toString().replace('#', '0x')),
      );
      lightRef.current.distance = value.distance;
      lightRef.current.decay = value.decay;

      lightRef.current.intensity = value.intensity;
      lightRef.current.angle = value.angle;
      lightRef.current.penumbra = value.penumbra;
      lightRef.current.position.set(value.x, value.y, value.z);
    }
    materialRef.current.forEach((item) => {
      if (value.mapsEnabled) {
        item.map = textureRef.current;
      } else {
        item.map = null;
      }
      item.needsUpdate = true;
    });
  };
  return (
    <div className="con">
      <DatGui data={state.data} onUpdate={handleUpdate} className="my_gui">
        <DatFolder title="Light" closed={false}>
          <DatColor path="color" label="color" />
          <DatNumber
            path="intensity"
            label="intensity"
            min={0}
            max={1}
            step={0.001}
          />
          <DatNumber
            path="distance"
            label="distance"
            min={0}
            max={100}
            step={0.001}
          />
          <DatNumber path="decay" label="decay" min={0} max={10} step={0.001} />
          <DatNumber
            path="penumbra"
            label="penumbra"
            min={0}
            max={1}
            step={0.001}
          />
          <DatNumber
            path="angle"
            label="angle"
            min={0}
            max={Math.PI / 2}
            step={0.001}
          />
          <DatNumber path="x" label="x" min={-10} max={10} step={0.01} />
          <DatNumber path="y" label="y" min={-10} max={10} step={0.01} />
          <DatNumber path="z" label="z" min={-10} max={10} step={0.01} />
        </DatFolder>
        <DatFolder title="Meshes" closed={false}>
          <DatBoolean path="mapsEnabled" label="mapsEnabled" />
        </DatFolder>
      </DatGui>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default Index;
