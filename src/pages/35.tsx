import { useMount, useReactive } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import DatGui, { DatFolder, DatNumber } from 'react-dat-gui';
import { useRef } from 'react';

const Index = () => {
  const objectRef = useRef<THREE.Mesh[]>([]);
  const renderRef = useRef<Function | null>(null);
  const state = useReactive({
    data: {
      p1: 4,
      r1: 0,
      s1: 1,
      p2: 4,
      r2: 0,
      s2: 1,
      p3: 4,
      r3: 0,
      s3: 1,
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
    camera.position.set(4, 4, 4);
    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    // 轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(8, 0, 0);
    // light
    const light1 = new THREE.SpotLight();
    light1.position.set(10, 10, 10);
    scene.add(light1);
    const light2 = new THREE.SpotLight();
    light2.position.set(-10, 10, 10);
    scene.add(light2);
    // 添加球体
    const object1 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(),
      new THREE.MeshPhongMaterial({ color: 0xff0000 }),
    );
    object1.position.set(4, 0, 0);
    scene.add(object1);
    object1.add(new THREE.AxesHelper(5));

    const object2 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(),
      new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
    );
    object2.position.set(4, 0, 0);
    object1.add(object2);
    object2.add(new THREE.AxesHelper(5));

    const object3 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(),
      new THREE.MeshPhongMaterial({ color: 0x0000ff }),
    );
    object3.position.set(4, 0, 0);
    object2.add(object3);
    object3.add(new THREE.AxesHelper(5));

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
    const debug = document.getElementById('debug') as HTMLDivElement;
    objectRef.current = [object1, object2, object3];
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      render();
      const object1WorldPosition = new THREE.Vector3();
      object1.getWorldPosition(object1WorldPosition);

      const object2WorldPosition = new THREE.Vector3();
      object2.getWorldPosition(object2WorldPosition);
      const object3WorldPosition = new THREE.Vector3();
      object3.getWorldPosition(object3WorldPosition);
      debug.innerText =
        'Red\n' +
        'Local Pos X : ' +
        object1.position.x.toFixed(2) +
        '\n' +
        'World Pos X : ' +
        object1WorldPosition.x.toFixed(2) +
        '\n' +
        '\nGreen\n' +
        'Local Pos X : ' +
        object2.position.x.toFixed(2) +
        '\n' +
        'World Pos X : ' +
        object2WorldPosition.x.toFixed(2) +
        '\n' +
        '\nBlue\n' +
        'Local Pos X : ' +
        object3.position.x.toFixed(2) +
        '\n' +
        'World Pos X : ' +
        object3WorldPosition.x.toFixed(2) +
        '\n';
    }
    renderRef.current = animate;

    animate();
  });
  const handleUpdate = (value: typeof state.data) => {
    state.data = value;

    const [object1, object2, object3] = objectRef.current;
    object1.position.x = value.p1;
    object1.rotation.x = value.r1;
    object1.scale.x = value.s1;

    object2.position.x = value.p2;
    object2.rotation.x = value.r2;
    object2.scale.x = value.s2;

    object3.position.x = value.p3;
    object3.rotation.x = value.r3;
    object3.scale.x = value.s3;
  };
  return (
    <div className="con">
      <DatGui data={state.data} onUpdate={handleUpdate} className="my_gui">
        <DatFolder title="object1" closed={false}>
          <DatNumber
            path="p1"
            label="x position"
            min={0}
            max={10}
            step={0.01}
          />
          <DatNumber
            path="r1"
            label="x rotation"
            min={0}
            max={Math.PI * 2}
            step={0.01}
          />
          <DatNumber path="s1" label="x rotation" min={0} max={2} step={0.01} />
        </DatFolder>
        <DatFolder title="object2" closed={false}>
          <DatNumber
            path="p2"
            label="x position"
            min={0}
            max={10}
            step={0.01}
          />
          <DatNumber
            path="r2"
            label="x rotation"
            min={0}
            max={Math.PI * 2}
            step={0.01}
          />
          <DatNumber path="s2" label="x rotation" min={0} max={2} step={0.01} />
        </DatFolder>
        <DatFolder title="object3" closed={false}>
          <DatNumber
            path="p3"
            label="x position"
            min={0}
            max={10}
            step={0.01}
          />
          <DatNumber
            path="r3"
            label="x rotation"
            min={0}
            max={Math.PI * 2}
            step={0.01}
          />
          <DatNumber path="s3" label="x rotation" min={0} max={2} step={0.01} />
        </DatFolder>
      </DatGui>
      <canvas id="canvas"></canvas>
      <div id="debug" className="debug"></div>
    </div>
  );
};

export default Index;
