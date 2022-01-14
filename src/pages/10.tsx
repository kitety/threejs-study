import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Scene } from 'three';

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
      renderer.physicallyCorrectLights = true;

      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000);
      camera.position.set(0, 10, 20);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
      scene.add(hemisphereLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0, 10, 5);
      directionalLight.target.position.set(-5, 0, 0);
      scene.add(directionalLight);
      scene.add(directionalLight.target);

      const planeSize = 40;
      const loader = new THREE.TextureLoader();
      const texture = loader.load(
        'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/未标题-1.png',
      );
      texture.wrapT = THREE.RepeatWrapping;
      texture.wrapS = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      texture.repeat.set(planeSize / 2, planeSize / 2);

      const planeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      planeMaterial.color.setRGB(1.5, 1.5, 1.5); //在纹理图片颜色的RGB基础上，分别乘以 1.5，这样可以不修改纹理图片的前提下让纹理图片更加偏白一些

      const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
      const mesh = new THREE.Mesh(planeGeo, planeMaterial);
      mesh.rotation.x = Math.PI * -0.5;
      scene.add(mesh);

      const shadowTexture = loader.load(
        'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220114185102.png',
      );
      //所有球体假阴影对应的数组
      const baseArray: SphereShadowBase[] = [];

      const sphereRadius = 1;
      const SphereGeo = new THREE.SphereBufferGeometry(sphereRadius, 32, 16);
      const shadowSize = 1; // 假阴影尺寸
      const shadowGeo = new THREE.PlaneBufferGeometry(shadowSize, shadowSize); //假阴影对应的平面几何体

      const numSphere = 15;
      for (let i = 0; i < numSphere; i++) {
        //创建 球和阴影 的整体对象
        const base = new THREE.Object3D();
        scene.add(base);

        const shadowMat = new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true,
          depthWrite: false,
        });

        const shadowSize = sphereRadius * 4;
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.position.y = 0.001;
        shadowMesh.rotation.x = Math.PI * -0.5;
        shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
        base.add(shadowMesh);

        const sphereMat = new THREE.MeshPhongMaterial();
        //给 球 设置不同颜色
        sphereMat.color.setRGB(i / numSphere, 1, 0.75);
        const sphereMesh = new THREE.Mesh(SphereGeo, sphereMat);
        sphereMesh.position.y = sphereRadius + 2;
        // sphereMesh.position.set(0, sphereRadius + 2, 0)
        base.add(sphereMesh);

        baseArray.push({
          base,
          sphereMesh,
          shadowMesh,
          y: sphereMesh.position.y,
        });
      }

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 5, 0);
      controls.update();

      const render = (time: number) => {
        time = time * 0.001;
        baseArray.forEach((item, index) => {
          const { base, sphereMesh, shadowMesh, y } = item;
          const u = index / baseArray.length;
          const speed = time * 0.2;
          const angle = speed + u * Math.PI * 2 * (index % 1 ? 1 : -1);
          const radius = Math.sin(speed - index) * 10;

          base.position.set(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius,
          );
          const yOff = Math.abs(Math.sin(time * 2 + index));
          sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);
          (shadowMesh.material as THREE.Material).opacity =
            THREE.MathUtils.lerp(1, 0.25, yOff);
        });
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
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
