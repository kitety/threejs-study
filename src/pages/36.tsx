import { useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import DatGui, { DatFolder, DatNumber } from 'react-dat-gui';
import { useRef } from 'react';

const Index = () => {
  const objectRef = useRef<THREE.BufferGeometry[]>([]);
  const renderRef = useRef<Function | null>(null);
  const state = useReactive({
    data: {
      x: -1,
    },
  });
  useMount(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(1.6, 1.7, 2);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    const material = new THREE.MeshNormalMaterial();
    const geometry = new THREE.BufferGeometry();
    const points = [
      new THREE.Vector3(-1, 1, -1), //c
      new THREE.Vector3(-1, -1, 1), //b
      new THREE.Vector3(1, 1, 1), //a

      new THREE.Vector3(1, 1, 1), //a
      new THREE.Vector3(1, -1, -1), //d
      new THREE.Vector3(-1, 1, -1), //c

      new THREE.Vector3(-1, -1, 1), //b
      new THREE.Vector3(1, -1, -1), //d
      new THREE.Vector3(1, 1, 1), //a

      new THREE.Vector3(-1, 1, -1), //c
      new THREE.Vector3(1, -1, -1), //d
      new THREE.Vector3(-1, -1, 1), //b
    ];

    geometry.setFromPoints(points);
    geometry.computeVertexNormals();
    objectRef.current = [geometry];
    const object = new THREE.Mesh(geometry, material);
    scene.add(object);

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
      requestAnimationFrame(animate);
      controls.update();
      render();
    }
    renderRef.current = animate;

    animate();
  });
  const handleUpdate = (value: typeof state.data) => {
    state.data = value;

    const [geometry] = objectRef.current;
    geometry.attributes.position.array[3] = value.x;
    geometry.attributes.position.needsUpdate = true;
    console.log('geometry: ', geometry);
  };
  return (
    <div className="con">
      <DatGui data={state.data} onUpdate={handleUpdate} className="my_gui">
        <DatFolder title="object1" closed={false}>
          <DatNumber path="x" label="x position" min={-5} max={1} step={0.01} />
        </DatFolder>
      </DatGui>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default Index;
