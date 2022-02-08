import React, { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js';
import { useMount, useReactive } from 'ahooks';
import './32.less';
import { Spin } from 'antd';
import {
  AmbientLight,
  AnimationMixer,
  BoxGeometry,
  CameraHelper,
  Color,
  DirectionalLight,
  DirectionalLightHelper,
  DoubleSide,
  LoadingManager,
  Material,
  Mesh,
  MeshDepthMaterial,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  RGBADepthPacking,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from 'three';

const skyImg =
  'https://cdn.jsdelivr.net/gh/dragonir/3d@master/src/containers/Olympic/images/sky.jpg';
const landModel =
  'https://cdn.jsdelivr.net/gh/dragonir/3d@master/src/containers/Olympic/models/land.glb';
const flagModel =
  'https://cdn.jsdelivr.net/gh/dragonir/3d@master/src/containers/Olympic/models/flag.glb';
const flagPng =
  'https://cdn.jsdelivr.net/gh/dragonir/3d@master/src/containers/Olympic/images/flag.png';
const bingdundunModel =
  'https://cdn.jsdelivr.net/gh/dragonir/3d@master/src/containers/Olympic/models/bingdundun.glb';
const treeTexture =
  'https://cdn.jsdelivr.net/gh/dragonir/3d@master/src/containers/Olympic/images/tree.png';

const treeModel =
  'https://cdn.jsdelivr.net/gh/dragonir/3d@master/src/containers/Olympic/models/panda.gltf';
const Olympic = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useReactive({
    count: 0,
  });
  const initThree = () => {
    const meshes = [];
    if (!canvasRef.current) return;
    const init = () => {
      if (!canvasRef.current) return;
      const renderer = new WebGLRenderer({
        antialias: true,
        canvas: canvasRef.current,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      // 场景
      const scene = new Scene();
      scene.background = new TextureLoader().load(skyImg);
      console.log('scene.background: ', scene.background);

      // 相机
      const camera = new PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.set(0, 30, 100);
      camera.lookAt(0, 0, 0);

      const cubeGeometry = new BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new MeshLambertMaterial({ color: 0xdc161a });
      const cube = new Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0);

      // 光源
      const light = new DirectionalLight(0xffffff, 1);
      light.intensity = 1;
      light.position.set(16, 16, 8);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 40;
      light.shadow.camera.bottom = -40;
      light.shadow.camera.left = -40;
      light.shadow.camera.right = 40;
      scene.add(light);

      const lightHelper = new DirectionalLightHelper(light, 1, 'red');
      scene.add(lightHelper);
      const lightCameraHelper = new CameraHelper(light.shadow.camera);
      scene.add(lightCameraHelper);

      // 环境光
      const ambientLight = new AmbientLight(0xcfffff);
      ambientLight.intensity = 0.5;
      scene.add(ambientLight);

      // 加载管理器
      const manager = new LoadingManager();
      manager.onStart = (url, loaded, total) => {};
      manager.onLoad = () => {
        state.count = 100;
      };
      manager.onProgress = async (url, loaded, total) => {
        state.count = Math.floor((loaded / total) * 100);
      };

      // 添加地面
      const loader = new GLTFLoader(manager);
      loader.load(landModel, (mesh) => {
        // console.log('mesh: ', mesh);
        mesh.scene.traverse((i) => {
          const child = i as unknown as Mesh;
          // console.log('child: ', child.name);
          if (child.isMesh) {
            meshes.push(child);
            (child.material as MeshStandardMaterial).metalness = 0.1;
            (child.material as MeshStandardMaterial).roughness = 0.8;
            // 地面
            if (child.name === 'Mesh_2') {
              (child.material as MeshStandardMaterial).metalness = 0.5;
              child.receiveShadow = true;
            }
            // 围巾
            if (child.name === 'Mesh_17') {
              (child.material as MeshStandardMaterial).metalness = 0.2;
              (child.material as MeshStandardMaterial).roughness = 0.8;
            }
          }
        });
        mesh.scene.rotation.y = Math.PI / 4;
        mesh.scene.position.set(15, -20, 0);
        mesh.scene.scale.set(0.9, 0.9, 0.9);
        scene.add(mesh.scene);
      });

      // 添加旗子
      loader.load(flagModel, (mesh) => {
        mesh.scene.traverse((i) => {
          const child = i as unknown as Mesh;
          if (child.isMesh) {
            meshes.push(child);
            child.castShadow = true;

            // 旗帜
            if (child.name === 'mesh_0001') {
              (child.material as MeshStandardMaterial).metalness = 0.1;
              (child.material as MeshStandardMaterial).roughness = 0.1;
              (child.material as MeshStandardMaterial).map =
                new TextureLoader().load(flagPng);
            }
            // 旗杆
            if (child.name === '柱体') {
              (child.material as MeshStandardMaterial).metalness = 0.6;
              (child.material as MeshStandardMaterial).roughness = 0;
              (child.material as MeshStandardMaterial).refractionRatio = 1;
              (child.material as MeshStandardMaterial).color = new Color(
                0xeeeeee,
              );
            }
          }
        });

        mesh.scene.rotation.y = Math.PI / 24;
        mesh.scene.position.set(2, -7, -1);
        mesh.scene.scale.set(4, 4, 4);
        // 动画
        let meshAnimation = mesh.animations[0];
        const mixer = new AnimationMixer(mesh.scene);
        let animationClip = meshAnimation;
        let clipAction = mixer.clipAction(animationClip).play();
        animationClip = clipAction.getClip();
        scene.add(mesh.scene);
      });

      // bingdundun
      loader.load(bingdundunModel, (mesh) => {
        mesh.scene.traverse(function (i) {
          const child = i as unknown as Mesh;
          if (child.isMesh) {
            meshes.push(child);
            if (child.name === 'oldtiger001') {
              (child.material as MeshStandardMaterial).metalness = 0.5;
              (child.material as MeshStandardMaterial).roughness = 0.8;
            }
            if (child.name === 'oldtiger002') {
              (child.material as MeshStandardMaterial).transparent = true;
              (child.material as MeshStandardMaterial).opacity = 0.5;
              (child.material as MeshStandardMaterial).metalness = 0.2;
              (child.material as MeshStandardMaterial).roughness = 0;
              (child.material as MeshStandardMaterial).refractionRatio = 1;
              child.castShadow = true;
            }
          }
        });
        mesh.scene.rotation.y = Math.PI / 24;
        mesh.scene.position.set(-8, -12, 0);
        mesh.scene.scale.set(24, 24, 24);
        scene.add(mesh.scene);
      });

      // 添加树木
      const treeMaterial = new MeshPhysicalMaterial({
        map: new TextureLoader().load(treeTexture),
        transparent: true,
        side: DoubleSide,
        metalness: 0.2,
        roughness: 0.8,
        depthTest: true,
        depthWrite: false,
        // skinning: false,
        fog: false,
        reflectivity: 0.1,
        refractionRatio: 0,
      });
      const treeCustomDepthMaterial = new MeshDepthMaterial({
        depthPacking: RGBADepthPacking,
        map: new TextureLoader().load(treeTexture),
        alphaTest: 0.5,
      });
      loader.load(treeModel, (mesh) => {})
    };
    init();
  };
  useEffect(() => {
    initThree();
  }, [canvasRef]);
  return (
    <Spin tip={`已经加载：${state.count}%`} spinning={state.count < 100}>
      <canvas ref={canvasRef} className="full-screen" />
    </Spin>
  );
};

export default Olympic;
