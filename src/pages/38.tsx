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
const cubeImgs = [
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/nx_eso0932a.jpg',
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/ny_eso0932a.jpg',
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/nz_eso0932a.jpg',
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/px_eso0932a.jpg',
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/py_eso0932a.jpg',
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/pz_eso0932a.jpg',
];
const specularImg =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/earthSpecular.jpg';

const Index = () => {
  const objectRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const renderRef = useRef<Function | null>(null);
  const state = useReactive({
    data: {
      color: '#ffffff',
      emissive: '#000000',
      shininess: 140,
      wireframe: false,
      flatShading: false,
      reflectivity: 1,
      combine: 1,
      refractionRatio: 0.98,
      envMapIntensity: 0.98,
      roughness: 0.5,
      metalness: 0.5,
      clearcoatRoughness: 0.5,
      clearcoat: 0.5,
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

    const envTexture = new THREE.CubeTextureLoader().load(cubeImgs);
    envTexture.mapping = THREE.CubeReflectionMapping;
    material.envMap = envTexture;
    const specularTexture = new THREE.TextureLoader().load(specularImg);
    // material.specularMap = specularTexture;
    material.roughnessMap = specularTexture;
    material.metalnessMap = specularTexture;
    const plane = new THREE.Mesh(planeGeo, material);
    scene.add(plane);
    objectRef.current = [material];

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
    const [material] = objectRef.current;
    material.color.setHex(Number(value.color.toString().replace('#', '0x')));
    material.emissive.setHex(
      Number(value.emissive.toString().replace('#', '0x')),
    );
    material.wireframe = value.wireframe;
    material.flatShading = value.flatShading;
    material.reflectivity = value.reflectivity;
    material.refractionRatio = value.refractionRatio;
    material.envMapIntensity = value.envMapIntensity;
    material.roughness = value.roughness;
    material.metalness = value.metalness;
    material.clearcoat = value.clearcoat;
    material.clearcoatRoughness = value.clearcoatRoughness;

    material.needsUpdate = true;

    // // 长度是36 4*3*3
    // geometry.attributes.position.array[3] = value.x;
    // geometry.attributes.position.needsUpdate = true;
    // console.log('geometry: ', geometry);
  };

  return (
    <div className="con">
      <DatGui data={state.data} onUpdate={handleUpdate} className="my_gui">
        <DatFolder title="matreial" closed={false}>
          {/* 颜色 */}
          <DatColor path="color" label="color" />
          {/* 材质的放射（光）颜色 */}
          <DatColor path="emissive" label="emissive" />

          {/* 线框 */}
          <DatBoolean path="wireframe" label="wireframe" />
          {/* 定义材质是否使用平面着色进行渲染 */}
          <DatBoolean path="flatShading" label="flatShading" />
          {/* 环境贴图对表面的影响程度 */}
          <DatNumber
            path="reflectivity"
            label="reflectivity"
            min={0}
            max={1}
            step={0.01}
          />
          {/* 空气折射率除以材质的折射率 */}
          <DatNumber
            path="refractionRatio"
            label="refractionRatio"
            min={0}
            max={1}
            step={0.01}
          />
          {/* 通过乘以环境贴图的颜色来缩放环境贴图的效果。 */}
          <DatNumber
            path="envMapIntensity"
            label="envMapIntensity"
            min={0}
            max={1}
            step={0.01}
          />
          <DatNumber
            path="roughness"
            label="roughness"
            min={0}
            max={1}
            step={0.01}
          />
          <DatNumber
            path="metalness"
            label="metalness"
            min={0}
            max={1}
            step={0.01}
          />
          <DatNumber
            path="clearcoat"
            label="clearcoat"
            min={0}
            max={1}
            step={0.01}
          />
          <DatNumber
            path="clearcoatRoughness"
            label="clearcoatRoughness"
            min={0}
            max={1}
            step={0.01}
          />
        </DatFolder>
      </DatGui>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default Index;
