import { useEventListener, useMount } from 'ahooks';
import { useRef } from 'react';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import './35.less';

const fbxSrc =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/xbot.fbx';
const modelSrc =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/vanguard.glb';

const glbFile =
  'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/eve@punching.glb';
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

    camera.position.set(0.8, 1.4, 1.0);

    const canvas = document.getElementById('canvas')!;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.target.set(0, 1, 0);

    const sceneMeshes: THREE.Mesh[] = [];
    let boxHelper: THREE.BoxHelper;

    const dragControls = new DragControls(
      sceneMeshes,
      camera,
      renderer.domElement,
    );
    dragControls.addEventListener('hoveron', function () {
      boxHelper.visible = true;
      orbitControls.enabled = false;
    });
    dragControls.addEventListener('hoveroff', function () {
      boxHelper.visible = false;
      orbitControls.enabled = true;
    });
    dragControls.addEventListener('drag', function (event) {
      console.log('event: ', event);
      event.object.position.y = 0;
    });
    dragControls.addEventListener('dragstart', function () {
      if (boxHelper) {
        boxHelper.visible = true;
      }
      orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', function () {
      if (boxHelper) {
        boxHelper.visible = false;
      }
      orbitControls.enabled = true;
    });

    const planeGeometry = new THREE.PlaneGeometry(25, 25);
    const texture = new THREE.TextureLoader().load(
      'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/grid.png',
    );
    const plane: THREE.Mesh = new THREE.Mesh(
      planeGeometry,
      new THREE.MeshPhongMaterial({ map: texture }),
    );
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    scene.add(plane);

    renderer.setSize(window.innerWidth - 220, window.innerHeight - 50);

    let mixer: THREE.AnimationMixer;
    let modelReady = false;
    const animationActions: THREE.AnimationAction[] = [];
    let activeAction: THREE.AnimationAction;
    let lastAction: THREE.AnimationAction;
    const gltfLoader = new GLTFLoader();
    let modelGroup: THREE.Group;
    let modelDragBox: THREE.Mesh;

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
      glbFile,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Group) {
            modelGroup = child;
          }
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            (child as THREE.Mesh).geometry.computeVertexNormals();
          }

          mixer = new THREE.AnimationMixer(gltf.scene);
          mixer.clipAction(gltf.animations[0]).play();

          modelDragBox = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 1.3, 0.5),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
          );
          modelDragBox.geometry.translate(0, 0.65, 0);
          scene.add(modelDragBox);
          sceneMeshes.push(modelDragBox);
          scene.add(gltf.scene);
          boxHelper = new THREE.BoxHelper(modelDragBox, 0xffff00);
          boxHelper.visible = false;
          scene.add(boxHelper);
          modelReady = true;
        });
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

    const mirrorBack1: Reflector = new Reflector(
      new THREE.PlaneBufferGeometry(2, 2),
      {
        color: new THREE.Color(0x7f7f7f),
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
      },
    );

    mirrorBack1.position.y = 1;
    mirrorBack1.position.z = -1;
    scene.add(mirrorBack1);

    const mirrorBack2: Reflector = new Reflector(
      new THREE.PlaneBufferGeometry(2, 2),
      {
        color: new THREE.Color(0x7f7f7f),
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
      },
    );

    mirrorBack2.position.y = 1;
    mirrorBack2.position.z = -2;
    scene.add(mirrorBack2);

    const mirrorFront1: Reflector = new Reflector(
      new THREE.PlaneBufferGeometry(2, 2),
      {
        color: new THREE.Color(0x7f7f7f),
        //clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
      },
    );
    mirrorFront1.position.y = 1;
    mirrorFront1.position.z = 1;
    mirrorFront1.rotateY(Math.PI);
    scene.add(mirrorFront1);

    const mirrorFront2: Reflector = new Reflector(
      new THREE.PlaneBufferGeometry(2, 2),
      {
        color: new THREE.Color(0x7f7f7f),
        //clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
      },
    );
    mirrorFront2.position.y = 1;
    mirrorFront2.position.z = 2;
    mirrorFront2.rotateY(Math.PI);
    scene.add(mirrorFront2);

    const clock = new THREE.Clock();
    function animate() {
      render();
      if (modelReady) {
        mixer.update(clock.getDelta());
        modelGroup.position.copy(modelDragBox.position);
        boxHelper.update();
      }
      requestAnimationFrame(animate);
    }
    renderRef.current = animate;

    animate();
  });

  return (
    <div className="con">
      <div id="instructions">
        G : Move&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R :
        Rotate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S :
        Scale&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default Index;
