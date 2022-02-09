import { useMount, useReactive } from 'ahooks';
import styles from './32.less';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import DatGui, { DatNumber } from 'react-dat-gui';
import { useRef } from 'react';

const Index = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const renderRef = useRef<Function | null>(null);
  const state = useReactive({
    data: {
      x: 0,
      y: 0,
      z: 0,
      cameraZ: 2,
    },
  });
  useMount(() => {
    const scene = new THREE.Scene();

    const camera1 = new THREE.PerspectiveCamera(75, 2, 0.1, 10);
    cameraRef.current = camera1;
    const camera2 = new THREE.OrthographicCamera(1, -1, 1, -1, 0.1, 10);
    const camera3 = new THREE.OrthographicCamera(1, -1, 1, -1, 0.1, 10);
    const camera4 = new THREE.OrthographicCamera(1, -1, 1, -1, 0.1, 10);

    camera1.position.z = 2;
    camera1.position.y = 1;
    camera2.lookAt(new THREE.Vector3(0, 0, 0));
    camera3.position.z = 1;
    camera4.position.x = 1;
    camera4.lookAt(new THREE.Vector3(0, 0, 0));

    const canvas1 = document.getElementById('c1') as HTMLCanvasElement;
    const canvas2 = document.getElementById('c2') as HTMLCanvasElement;
    const canvas3 = document.getElementById('c3') as HTMLCanvasElement;
    const canvas4 = document.getElementById('c4') as HTMLCanvasElement;

    const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 });
    renderer1.setSize(243, 243);
    const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 });
    renderer2.setSize(243, 243);
    const renderer3 = new THREE.WebGLRenderer({ canvas: canvas3 });
    renderer3.setSize(243, 243);
    const renderer4 = new THREE.WebGLRenderer({ canvas: canvas4 });
    renderer4.setSize(243, 243);

    const control = new OrbitControls(camera1, renderer1.domElement);
    control.addEventListener('change', render);
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    cubeRef.current = cube;
    scene.add(cube);
    var axisHelper = new THREE.AxesHelper(250);
    scene.add(axisHelper);

    function render() {
      renderer1.render(scene, camera1);
      renderer2.render(scene, camera2);
      renderer3.render(scene, camera3);
      renderer4.render(scene, camera4);
      state.data.cameraZ = camera1.position.z;
    }

    render();
    renderRef.current = render;
  });
  const handleUpdate = (value: typeof state.data) => {
    state.data = value;
    if (cubeRef.current) {
      cubeRef.current.rotation.x = value.x;
      cubeRef.current.rotation.y = value.y;
      cubeRef.current.rotation.z = value.z;
    }
    if (cameraRef.current) {
      cameraRef.current.position.z = value.cameraZ;
    }
    renderRef.current?.();
  };
  return (
    <>
      <DatGui data={state.data} onUpdate={handleUpdate} className="my_gui">
        <DatNumber path="x" label="x" min={0} max={2 * Math.PI} step={0.1} />
        <DatNumber path="y" label="y" min={0} max={2 * Math.PI} step={0.1} />
        <DatNumber path="z" label="z" min={0} max={2 * Math.PI} step={0.1} />
        <DatNumber
          path="cameraZ"
          label="cameraZ"
          min={0}
          max={10}
          step={0.01}
        />
      </DatGui>
      <canvas id="c1" className={styles.c}></canvas>
      <canvas id="c2" className={styles.c}></canvas>
      <canvas id="c3" className={styles.c}></canvas>
      <canvas id="c4" className={styles.c}></canvas>
    </>
  );
};

export default Index;
