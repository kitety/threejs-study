import { useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import DatGui, { DatFolder, DatNumber } from 'react-dat-gui';
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
    Array<
      | THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial>
      | THREE.MeshPhongMaterial
    >
  >([]);
  const lightRef = useRef<THREE.SpotLight | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const renderRef = useRef<Function | null>(null);
  const state = useReactive({
    data: {
      widthSegments: 360,
      heightSegments: 180,
      x: 0,
      nx: 5,
      ny: 5,
      cx: 0.25,
      cy: 0.25,
      rx: 0.25,
      ry: 0.6,
    },
  });
  useMount(() => {
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

    const light = new THREE.SpotLight(0xffffff, 2);
    light.position.set(0, 5, 10);
    scene.add(light);
    lightRef.current = light;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );

    camera.position.set(0, 0, 1);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    const planeGeo = new THREE.PlaneGeometry(3.6, 1.8, 360, 180);
    const material = new THREE.MeshPhongMaterial();
    const texture = new THREE.TextureLoader().load(worldColorImg);
    // 重复和中间
    texture.repeat.x = 0.25;
    texture.repeat.y = 0.25;
    texture.center.x = 0.25;
    texture.center.y = 0.6;
    textureRef.current = texture;

    material.map = texture;

    const displacementTexture = new THREE.TextureLoader().load(gebcoBathy);
    material.displacementMap = displacementTexture;
    material.displacementScale = 0.3;
    const normalTexture = new THREE.TextureLoader().load(normalImg);
    // material.normalMap = normalTexture;
    // material.normalScale.set(5, 5);

    material.wireframe = true;
    const plane = new THREE.Mesh(planeGeo, material);
    scene.add(plane);
    objectRef.current = [plane, material];

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
    state.data = value;
    const [geometry, material] = objectRef.current;

    const newGeometry = new THREE.PlaneGeometry(
      3.6,
      1.8,
      value.widthSegments,
      value.heightSegments,
    );
    (
      geometry as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial>
    ).geometry.dispose();
    (
      geometry as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial>
    ).geometry = newGeometry;
    (material as THREE.MeshPhongMaterial).normalScale.x = value.nx;
    (material as THREE.MeshPhongMaterial).normalScale.y = value.ny;
    if (lightRef.current) {
      lightRef.current.position.x = value.x;
    }
    if (textureRef.current) {
      textureRef.current.center.x = value.cx;
      textureRef.current.center.y = value.cy;
      console.log('value.cy: ', value.cy);
      textureRef.current.repeat.x = value.rx;
      textureRef.current.repeat.y = value.ry;
      // textureRef.current.needsUpdate = true;
    }
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
        <DatFolder title="Light" closed={false}>
          <DatNumber path="x" label="position.x" min={1} step={0.01} max={10} />
          <DatNumber
            path="nx"
            label="normalScale.x"
            min={1}
            step={0.01}
            max={10}
          />
          <DatNumber
            path="ny"
            label="normalScale.y"
            min={1}
            step={0.01}
            max={10}
          />
        </DatFolder>
        <DatFolder title="texture" closed={false}>
          <DatNumber path="rx" label="repeat.x" min={0} step={0.01} max={1} />
          <DatNumber path="ry" label="repeat.y" min={0} step={0.01} max={1} />
          <DatNumber path="cx" label="center.x" min={0} step={0.01} max={1} />
          <DatNumber path="cy" label="center.y" min={0} step={0.01} max={1} />
        </DatFolder>
      </DatGui>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default Index;
