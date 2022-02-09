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
      rx: 0,
      ry: 0,
      rz: 0,
      px: 0,
      py: 0,
      pz: 0,
      sx: 1,
      sy: 1,
      sz: 1,
      cameraZ: 2,
    },
  });
  useMount(() => {
    const scene = new THREE.Scene();

    const camera1 = new THREE.PerspectiveCamera(75, 2, 0.1, 10);
    cameraRef.current = camera1;

    camera1.position.z = 2;
    camera1.position.y = 1;

    const canvas1 = document.getElementById('c1') as HTMLCanvasElement;

    const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 });
    renderer1.setSize(243, 243);

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

      state.data.cameraZ = camera1.position.z;
    }

    render();
    renderRef.current = render;
  });
  const handleUpdate = (value: typeof state.data) => {
    state.data = value;
    if (cubeRef.current) {
      cubeRef.current.rotation.x = value.rx;
      cubeRef.current.rotation.y = value.ry;
      cubeRef.current.rotation.z = value.rz;
      cubeRef.current.position.x = value.px;
      cubeRef.current.position.y = value.py;
      cubeRef.current.position.z = value.pz;
      cubeRef.current.scale.x = value.sx;
      cubeRef.current.scale.y = value.sy;
      cubeRef.current.scale.z = value.sz;
    }
    if (cameraRef.current) {
      cameraRef.current.position.z = value.cameraZ;
    }
    renderRef.current?.();
  };
  return (
    <>
      <DatGui data={state.data} onUpdate={handleUpdate} className="my_gui">
        <DatNumber
          path="rx"
          label="rotation x"
          min={0}
          max={2 * Math.PI}
          step={0.1}
        />
        <DatNumber
          path="ry"
          label="rotation y"
          min={0}
          max={2 * Math.PI}
          step={0.1}
        />
        <DatNumber
          path="rz"
          label="rotation z"
          min={0}
          max={2 * Math.PI}
          step={0.1}
        />
        <DatNumber path="px" label="position x" min={-10} max={10} step={0.1} />
        <DatNumber path="py" label="position y" min={-10} max={10} step={0.1} />
        <DatNumber path="pz" label="position z" min={-10} max={10} step={0.1} />
        <DatNumber path="sx" label="scale x" min={0} max={5} step={0.1} />
        <DatNumber path="sy" label="scale y" min={0} max={5} step={0.1} />
        <DatNumber path="sz" label="scale z" min={0} max={5} step={0.1} />
        <DatNumber
          path="cameraZ"
          label="cameraZ"
          min={0}
          max={10}
          step={0.01}
        />
      </DatGui>
      <canvas id="c1" className={styles.c}></canvas>
    </>
  );
};

export default Index;
