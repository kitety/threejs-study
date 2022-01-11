import { useMount } from 'ahooks';
import { useEffect, useRef } from 'react';
import {
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

export default function IndexPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      // 创建渲染器
      const renderer = new WebGLRenderer({ canvas: canvasRef.current });
      // 创建镜头
      // perspective
      const camera = new PerspectiveCamera(75, 2, 0.1, 5);

      // 创建场景
      const scene = new Scene();
      const geometry = new BoxGeometry(1, 1, 1);
      //创建材质
      //我们需要让立方体能够反射光，所以不使用MeshBasicMaterial，而是改用MeshPhongMaterial
      const material1 = new MeshPhongMaterial({ color: 0x44aa88 });
      const material2 = new MeshPhongMaterial({ color: 0x44aa88 });
      const material3 = new MeshPhongMaterial({ color: 0x44aa88 });

      // 创建网格
      const cube1 = new Mesh(geometry, material1);
      cube1.position.x = -2;
      scene.add(cube1);
      const cube2 = new Mesh(geometry, material2);
      cube2.position.x = 0;
      scene.add(cube2);
      const cube3 = new Mesh(geometry, material3);
      cube3.position.x = 2;
      scene.add(cube3);
      const cubes = [cube1, cube2, cube3];

      // 创建光源
      const light = new DirectionalLight(0xffffff, 1);
      light.position.set(-1, 2, 4);
      scene.add(light);
      //将光源添加到场景中，若场景中没有任何光源，则可反光材质的物体渲染出的结果是一片漆黑，什么也看不见

      //设置透视镜头的Z轴距离，以便我们以某个距离来观察几何体
      //之前初始化透视镜头时，设置的近平面为 0.1，远平面为 5
      //因此 camera.position.z 的值一定要在 0.1 - 5 的范围内，超出这个范围则画面不会被渲染
      camera.position.z = 2;
      // renderer.render(scene, camera);

      const render = (time: number) => {
        time = time * 0.001; //原本 time 为毫秒，我们这里对 time 进行转化，修改成 秒，以便于我们动画旋转角度的递增
        // cube.rotation.x = time;
        // cube.rotation.y = time;
        // cube.rotation.z = time;
        cubes.map((cube) => {
          cube.rotation.x = time;
          // cube.rotation.y = time;
        });
        renderer.render(scene, camera);
        window.requestAnimationFrame(render);
      };
      window.requestAnimationFrame(render);
    }
  }, [canvasRef]);
  return <canvas ref={canvasRef} />;
}
