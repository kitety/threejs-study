import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useReactive } from 'ahooks';
import { Spin } from 'antd';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const modelSrc = 'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/glb.glb';

const Index = () => {
  const state = useReactive({
    count: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
      camera.position.set(10, 0, 10);

      const light = new THREE.HemisphereLight(0xffffff, 0x333333, 1);
      scene.add(light);

      const controls = new OrbitControls(camera, canvasRef.current);
      controls.update();
      const planeDataArr = [
        {
          color: 'red',
          ratation: 0,
          imgsrc:
            'https://threejsfundamentals.org/threejs/resources/images/tree-01.png',
        },
        {
          color: 'yellow',
          ratation: Math.PI * 0.5,
          imgsrc:
            'https://threejsfundamentals.org/threejs/resources/images/tree-02.png',
        },
      ];

      planeDataArr.forEach((value) => {
        const geometry = new THREE.PlaneBufferGeometry(2, 2);
        const textureLoader = new THREE.TextureLoader();
        const material = new THREE.MeshBasicMaterial({
          color: value.color,
          map: textureLoader.load(value.imgsrc),
          alphaTest: 0.2,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.y = value.ratation;
        scene.add(plane);
      });

      const render = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);

      const handleResize = () => {
        if (canvasRef.current === null) {
          return;
        }

        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        const canvasAspect = width / height;

        camera.aspect = canvasAspect;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [canvasRef]);
  return (
    <>
      <Spin tip={`已经加载：${state.count}%`} spinning={false}>
        <canvas
          ref={canvasRef}
          className="full-screen"
          style={{
            background:
              'url(https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20220207175946.png) no-repeat center center',
            backgroundSize: 'cover',
          }}
        />
      </Spin>
    </>
  );
};

export default Index;
