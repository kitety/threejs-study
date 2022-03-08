import { useEventListener, useMount } from 'ahooks';
import './35.less';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import DatGui, {
  DatBoolean,
  DatButton,
  DatColor,
  DatFolder,
  DatNumber,
  DatPresets,
  DatSelect,
} from 'react-dat-gui';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const fbxSrc =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/xbot.fbx';
const modelSrc =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/vanguard.glb';
const Index = () => {
  const renderRef = useRef<Function | null>(null);
  const controlsRef = useRef<TransformControls | null>(null);
  const methodsArrRef = useRef<Function[]>([]);

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
    // scene.background = new THREE.Color(0xff0000);

    const light1 = new THREE.PointLight(0xffffff, 2);
    light1.position.set(2.5, 2.5, 2.5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 2);
    light2.position.set(-2.5, 2.5, 2.5);
    scene.add(light2);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );

    camera.position.set(0, 2, 3.0);

    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    renderer.domElement.ondragstart = function (event) {
      event.preventDefault();
      return false;
    };

    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    let mixer: THREE.AnimationMixer;
    let modelReady = false;
    const animationActions: THREE.AnimationAction[] = [];
    let activeAction: THREE.AnimationAction;
    let lastAction: THREE.AnimationAction;
    const gltfLoader = new GLTFLoader();

    const setAction = (toAction: THREE.AnimationAction) => {
      if (toAction != activeAction) {
        lastAction = activeAction;
        activeAction = toAction;
        //lastAction.stop()
        lastAction.fadeOut(1);
        activeAction.reset();
        activeAction.fadeIn(1);
        activeAction.play();
      }
    };
    const animationsArr = [
      function () {
        setAction(animationActions[0]);
      },
      function () {
        setAction(animationActions[1]);
      },
      function () {
        setAction(animationActions[2]);
      },
      function () {
        setAction(animationActions[3]);
      },
    ];
    methodsArrRef.current = animationsArr;

    gltfLoader.load(
      modelSrc,
      (object) => {
        mixer = new THREE.AnimationMixer(object.scene);
        const animationAction = mixer.clipAction(object.animations[0]);
        animationActions.push(animationAction);
        // animationsFolder.add(animations, 'default');
        activeAction = animationActions[0];
        scene.add(object.scene);

        gltfLoader.load(
          'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/vanguard@samba.glb',
          (gltf) => {
            console.log('loaded samba');
            const animationAction = mixer.clipAction(
              (gltf as any).animations[0],
            );
            animationActions.push(animationAction);
            // animationsFolder.add(animations, 'samba');

            //add an animation from another file
            // ![](https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/vanguard@bellydance.glb)
            gltfLoader.load(
              'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/vanguard@bellydance.glb',
              (gltf) => {
                console.log('loaded bellydance');
                const animationAction = mixer.clipAction(
                  (gltf as any).animations[0],
                );
                animationActions.push(animationAction);
                // animationsFolder.add(animations, 'bellydance');

                //add an animation from another file
                // ![]()
                gltfLoader.load(
                  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/vanguard@goofyrunning.glb',
                  (gltf) => {
                    console.log('loaded goofyrunning');
                    (gltf as any).animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                    const animationAction = mixer.clipAction(
                      (gltf as any).animations[0],
                    );
                    animationActions.push(animationAction);
                    // animationsFolder.add(animations, 'goofyrunning');

                    modelReady = true;
                  },
                  (xhr) => {
                    modelReady = true;
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                  },
                  (error) => {
                    console.log(error);
                  },
                );
              },
              (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
              },
              (error) => {
                console.log(error);
              },
            );
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          (error) => {
            console.log(error);
          },
        );
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
    const clock = new THREE.Clock();
    function animate() {
      render();
      if (modelReady) mixer.update(clock.getDelta());
      requestAnimationFrame(animate);
    }
    renderRef.current = animate;

    animate();
  });
  const handleClick = (index: number) => {
    console.log('index: ', index);
    methodsArrRef.current[index]?.();
  };
  return (
    <div className="con">
      <canvas id="canvas"></canvas>
      <DatGui data={{}} onUpdate={() => {}} className="my_gui">
        <DatFolder title="animations" closed={false}>
          <DatButton label="default" onClick={() => handleClick(0)} />
          <DatButton label="samba" onClick={() => handleClick(1)} />
          <DatButton label="bellydance" onClick={() => handleClick(2)} />
          <DatButton label="goofyrunning" onClick={() => handleClick(3)} />
        </DatFolder>
      </DatGui>
    </div>
  );
};

export default Index;
