import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CameraHelper, Scene } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface SphereShadowBase {
  base: THREE.Object3D;
  sphereMesh: THREE.Mesh;
  shadowMesh: THREE.Mesh;
  y: number;
}

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.shadowMap.enabled = true;
      // renderer.physicallyCorrectLights = true;

      // scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x333333);
      // 相机
      const camera = new THREE.PerspectiveCamera(45, 2, 5, 100);
      camera.position.set(0, 10, 20);
      scene.add(camera);

      // const helperCamera = new THREE.PerspectiveCamera(45, 2, 5, 100);
      // helperCamera.position.set(20, 10, 20);
      // helperCamera.lookAt(0, 5, 0);
      // scene.add(helperCamera);

      // const cameraHelper = new THREE.CameraHelper(helperCamera);
      // scene.add(cameraHelper);
      //添加半球环境光
      // const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
      // scene.add(hemisphereLight);

      // 控制
      const controls = new OrbitControls(camera, canvasRef.current);
      controls.target.set(0, 5, 0);
      controls.update();

      // 平行光源
      const light = new THREE.PointLight(0xffffff, 1);
      light.castShadow = true;
      light.position.set(0, 10, 0);
      // light.target.position.set(-4, 0, -4);
      scene.add(light);
      // light target
      // scene.add(light.target);

      const shadowCamera = light.shadow.camera;
      // shadowCamera.left = -10;
      // shadowCamera.right = 10;
      // shadowCamera.top = 10;
      // shadowCamera.bottom = -10;
      shadowCamera.updateProjectionMatrix();

      // 平行光的辅助对象
      const lightHelper = new THREE.PointLightHelper(light);
      scene.add(lightHelper);

      // 灯光阴影的辅助对象
      const shadowHelper = new THREE.CameraHelper(shadowCamera);
      scene.add(shadowHelper);

      const planeSize = 40;
      const loader = new THREE.TextureLoader();
      const texture = loader.load(
        'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/未标题-1.png',
      );
      texture.wrapT = THREE.RepeatWrapping;
      texture.wrapS = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      texture.repeat.set(planeSize / 2, planeSize / 2);

      // 接受阴影
      const planeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
      const mesh = new THREE.Mesh(planeGeo, planeMaterial);
      mesh.receiveShadow = true;
      mesh.rotation.x = Math.PI * -0.5;
      scene.add(mesh);

      const material = new THREE.MeshPhongMaterial({
        color: 0x88aacc,
      });
      const boxMat = new THREE.BoxBufferGeometry(4, 4, 4);
      const boxMesh = new THREE.Mesh(boxMat, material);
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      boxMesh.position.set(5, 3, 0);
      scene.add(boxMesh);

      const roomMat = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        side: THREE.BackSide, //只看里面
      });
      const roomGeo = new THREE.BoxBufferGeometry(30, 30, 30);
      const roomMesh = new THREE.Mesh(roomGeo, roomMat);
      roomMesh.receiveShadow = true;
      roomMesh.position.set(0, 14.9, 0);
      scene.add(roomMesh);

      const sphereMat = new THREE.SphereBufferGeometry(3, 32, 32);
      const sphereMesh = new THREE.Mesh(sphereMat, material);
      sphereMesh.castShadow = true;
      sphereMesh.receiveShadow = true;
      sphereMesh.position.set(-4, 5, 0);
      scene.add(sphereMesh);

      const render = () => {
        // cameraHelper.update();
        lightHelper.update();
        shadowHelper.update();

        renderer.render(scene, camera);
        window.requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);
      const handleResize = () => {
        if (canvasRef.current) {
          const width = canvasRef.current.clientWidth;
          const height = canvasRef.current.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default Index;
