import React, { useEffect, useRef } from 'react';
import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from 'three';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new WebGLRenderer({ canvas: canvasRef.current });

      const camera = new PerspectiveCamera(40, 2, 0.1, 1000);
      camera.position.set(0, 0, 50);

      const scene = new Scene();
      scene.background = new Color(0xcccccc);

      // 创建一个纹理加载器
      const loader = new TextureLoader();
      //创建一个材质，材质的 map 属性值为 纹理加载器加载的图片资源
      const material = new MeshBasicMaterial({
        map: loader.load(
          'https://cdn.jsdelivr.net/gh/kitety/blog_img@master/img/20210226115624.png',
        ),
      });

      const box = new BoxBufferGeometry(8, 8, 8);
      const mesh = new Mesh(box, material);
      scene.add(mesh);

      const render = (time: number) => {
        time = time * 0.001;

        mesh.rotation.x = time;
        mesh.rotation.y = time;
        renderer.render(scene, camera);

        window.requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);

      const resizeHandle = () => {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      };
      resizeHandle();
      window.addEventListener('resize', resizeHandle);

      return () => {
        window.removeEventListener('resize', resizeHandle);
      };
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default Index;
