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

const gebcoBathy =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220218181648.png';

const worldColorImg =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/worldColour.5400x2700.jpg';

const normalImg =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/material-textures-3.zip-earth_normalmap_8192x4096.jpg';

// 法线贴图

const Index = () => {
  const objectRef = useRef<
    Array<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial>>
  >([]);
  const renderRef = useRef<Function | null>(null);
  const state = useReactive({
    data: {
      widthSegments: 360,
      heightSegments: 180,
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

    const planeGeo = new THREE.PlaneGeometry(3.6, 1.8, 360, 180);
    const material = new THREE.MeshPhongMaterial();
    const texture = new THREE.TextureLoader().load(worldColorImg);
    material.map = texture;

    const displacementTexture = new THREE.TextureLoader().load(gebcoBathy);
    material.displacementMap = displacementTexture;

    const plane = new THREE.Mesh(planeGeo, material);
    scene.add(plane);
    objectRef.current = [plane];

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
    const [geometry] = objectRef.current;

    const newGeometry = new THREE.PlaneGeometry(
      3.6,
      1.8,
      value.widthSegments,
      value.heightSegments,
    );
    geometry.geometry.dispose();
    geometry.geometry = newGeometry;
  };
  return (
    <div className="con">
      <DatGui data={state.data} onUpdate={handleUpdate} className="my_gui">
        <DatFolder title="PlaneGeometry" closed={false}>
          <DatNumber
            path="widthSegments"
            label="widthSegments"
            min={1}
            step={1}
            max={360}
          />
          <DatNumber
            path="heightSegments"
            label="heightSegments"
            min={1}
            step={1}
            max={180}
          />
        </DatFolder>
      </DatGui>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default Index;
